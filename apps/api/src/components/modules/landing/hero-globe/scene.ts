import * as THREE from "three";

import {
  createRandom,
  cssToColor,
  easeInOutSine,
  GreatCircleArc,
  type LandTest,
  latLonToVector3,
  loadLandMask,
  sampleSurfaceGrid,
} from "./geo";
import { DECORATIVE_WAYPOINTS, HUB } from "./routes";
import { ARC, DOTS, RIPPLE } from "./shaders";

const RADIUS = 1;
const CAMERA_DISTANCE = 3.4;
const FOV = 26;

/**
 * Room kept between the sphere's rim and the canvas edge so arc tails that
 * lift past the rim never clip: 12% of the shorter side, clamped in px.
 */
const ARC_MARGIN = { ratio: 0.12, min: 20, max: 44 };
/** In wide boxes the sphere sits this far inside the right edge (px, before the arc margin). */
const RIGHT_INSET = 64;

/** Resting pose: hub faces the camera, a little up-left of the sphere's centre. */
const HUB_YAW = -0.2;
const HUB_TILT = 0.3;
const SWAY = { amplitude: 0.22, period: 64 };
const SLOW_RETURN = 0.3;

const MERIDIAN_STEP = 10;
const MERIDIAN_OPACITY = 0.28;
const PARALLEL_STEP = 30;
const PARALLEL_OPACITY = 0.14;
const DOT_SPACING = 0.026;
const DOT_OPACITY = 1;
const DOT_FADE_SECONDS = 1.4;

/** On-screen sizes in CSS px — held constant whatever size the globe renders at. */
const DOT_RADIUS_PX: [min: number, max: number] = [0.5, 1];
const ARC_WIDTH_PX = 0.75;
const HUB_MARKER_PX = 3;
const CITY_MARKER_PX = 1.75;
const HUB_PULSE_PX = 44;
const RIPPLE_PX = 30;

const ARC_TAIL = 0.5;
const ARC_OPACITY = 0.95;
const ARC_GAP: [number, number] = [6, 16];
const INBOUND_SHARE = 0.65;
const RIPPLE_SECONDS = 1.8;
const HUB_PULSE_PERIOD = 4.4;

type RippleMesh = THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;

type Arc = {
  curve: GreatCircleArc;
  mesh: THREE.Mesh<THREE.TubeGeometry, THREE.ShaderMaterial>;
  hubRipple: RippleMesh;
  cityRipple: RippleMesh;
  duration: number;
  start: number;
  inbound: boolean;
  rippleStart: number;
  rippleMesh: RippleMesh;
};

export type GlobeScene = {
  /** Re-read the host box and refit the camera. */
  resize(): void;
  /** Advance the simulation by `dt` seconds and render one frame. */
  frame(dt: number): void;
  /**
   * Any CSS colours (oklch is fine). `accentCss` paints arcs, hub and
   * markers; `neutralCss` paints the land dots and graticule.
   */
  setPalette(accentCss: string, neutralCss: string): void;
  setReducedMotion(reduced: boolean): void;
  /** Decode the land mask and drop in the halftone continents. */
  loadLand(url: string, signal?: AbortSignal): Promise<void>;
  dispose(): void;
};

const ORIGIN = new THREE.Vector3();
const _matrix = new THREE.Matrix4();
const _up = new THREE.Vector3();
const _scale = new THREE.Vector3();

/** Sit `object` on the sphere at `unit`, local +z pointing outward. */
function placeOnSphere(object: THREE.Object3D, unit: THREE.Vector3, radius: number) {
  _up.set(0, 1, 0);
  if (Math.abs(unit.y) > 0.99) _up.set(1, 0, 0);
  object.quaternion.setFromRotationMatrix(_matrix.identity().lookAt(unit, ORIGIN, _up));
  object.position.copy(unit).multiplyScalar(radius);
}

function buildGraticule(kind: "meridians" | "parallels", step: number, segments = 96) {
  const positions: number[] = [];
  const p = new THREE.Vector3();
  const q = new THREE.Vector3();
  const push = () => positions.push(p.x, p.y, p.z, q.x, q.y, q.z);
  if (kind === "meridians") {
    for (let lon = -180; lon < 180; lon += step) {
      for (let i = 0; i < segments; i++) {
        latLonToVector3(-90 + (i / segments) * 180, lon, RADIUS, p);
        latLonToVector3(-90 + ((i + 1) / segments) * 180, lon, RADIUS, q);
        push();
      }
    }
  } else {
    for (let lat = -90 + step; lat < 90; lat += step) {
      for (let i = 0; i < segments; i++) {
        latLonToVector3(lat, -180 + (i / segments) * 360, RADIUS, p);
        latLonToVector3(lat, -180 + ((i + 1) / segments) * 360, RADIUS, q);
        push();
      }
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  return geometry;
}

/** 1-device-pixel line set — the only line weight WebGL guarantees. */
function hairline(geometry: THREE.BufferGeometry, color: THREE.Color, opacity: number) {
  const lines = new THREE.LineSegments(
    geometry,
    new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity,
      depthWrite: false,
    }),
  );
  lines.renderOrder = 1;
  return lines;
}

const ARC_TUBULAR = 80;
const ARC_RADIAL = 6;
function tubeFor(curve: GreatCircleArc, radius: number) {
  return new THREE.TubeGeometry(curve, ARC_TUBULAR, radius, ARC_RADIAL, false);
}

function buildDots(land: LandTest, color: THREE.Color, scale: number) {
  const samples = sampleSurfaceGrid(DOT_SPACING, land);
  const count = samples.length / 2;
  const material = new THREE.ShaderMaterial({
    vertexShader: DOTS.vertex,
    fragmentShader: DOTS.fragment,
    uniforms: {
      uColor: { value: color },
      uOpacity: { value: 0 },
      uScale: { value: scale },
    },
    transparent: true,
    depthWrite: false,
  });
  const mesh = new THREE.InstancedMesh(new THREE.CircleGeometry(1, 8), material, count);
  const p = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    latLonToVector3(samples[i * 2], samples[i * 2 + 1], RADIUS, p);
    _up.set(0, 1, 0);
    if (Math.abs(p.y) > 0.99) _up.set(1, 0, 0);
    mesh.setMatrixAt(i, _matrix.identity().lookAt(p, ORIGIN, _up).setPosition(p));
  }
  mesh.instanceMatrix.needsUpdate = true;
  mesh.frustumCulled = false;
  mesh.renderOrder = 2;
  return mesh;
}

function makeRipple(color: THREE.Color, strength: number): RippleMesh {
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.ShaderMaterial({
      vertexShader: RIPPLE.vertex,
      fragmentShader: RIPPLE.fragment,
      uniforms: {
        uColor: { value: color },
        uT: { value: 0 },
        uStrength: { value: strength },
      },
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    }),
  );
  mesh.renderOrder = 6;
  mesh.visible = false;
  return mesh;
}

export function createGlobeScene(host: HTMLElement): GlobeScene | null {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "low-power",
    });
  } catch {
    return null;
  }
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  const canvas = renderer.domElement;
  canvas.className = "absolute inset-0 block size-full touch-pan-y select-none";
  canvas.setAttribute("aria-hidden", "true");
  host.appendChild(canvas);

  // ── palette (shared Color instances; uniforms reference them directly) ──
  const accent = new THREE.Color(0x155dfc);
  const neutral = new THREE.Color(0x737373);

  // ── scene graph ──
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.5, 10);
  camera.position.set(0, 0, CAMERA_DISTANCE);
  camera.lookAt(ORIGIN);

  const tilt = new THREE.Group();
  const spin = new THREE.Group();
  tilt.add(spin);
  scene.add(tilt);

  // Invisible sphere that only writes depth: the far hemisphere of dots,
  // lines and arcs is hidden, but the page background shows through.
  const occluder = new THREE.Mesh(
    new THREE.SphereGeometry(RADIUS - 0.004, 96, 64),
    new THREE.MeshBasicMaterial({ colorWrite: false }),
  );
  spin.add(occluder);

  const meridians = hairline(buildGraticule("meridians", MERIDIAN_STEP), neutral, MERIDIAN_OPACITY);
  const parallels = hairline(buildGraticule("parallels", PARALLEL_STEP), neutral, PARALLEL_OPACITY);
  spin.add(meridians, parallels);

  // ── Nepal hub + abstract route markers ──
  const hubUnit = latLonToVector3(HUB.lat, HUB.lon);
  const markerMaterial = new THREE.MeshBasicMaterial({
    color: accent,
    transparent: true,
    opacity: 0.95,
    depthWrite: false,
  });
  const hubMarker = new THREE.Mesh(new THREE.CircleGeometry(1, 24), markerMaterial);
  placeOnSphere(hubMarker, hubUnit, RADIUS + 0.003);
  hubMarker.renderOrder = 4;
  spin.add(hubMarker);

  const hubPulse = [0, 1].map(() => {
    const ring = makeRipple(accent, 0.45);
    placeOnSphere(ring, hubUnit, RADIUS + 0.004);
    ring.visible = true;
    spin.add(ring);
    return ring;
  });

  const cityUnits = DECORATIVE_WAYPOINTS.map((city) => latLonToVector3(city.lat, city.lon));
  const cityMarkers = new THREE.InstancedMesh(
    new THREE.CircleGeometry(1, 12),
    markerMaterial,
    cityUnits.length,
  );
  cityMarkers.renderOrder = 3;
  cityMarkers.frustumCulled = false;
  spin.add(cityMarkers);
  const layoutCityMarkers = (scale: number) => {
    const lift = RADIUS + 0.002;
    cityUnits.forEach((unit, index) => {
      _up.set(0, 1, 0);
      cityMarkers.setMatrixAt(
        index,
        _matrix
          .identity()
          .lookAt(unit, ORIGIN, _up)
          .scale(_scale.setScalar(scale))
          .setPosition(unit.x * lift, unit.y * lift, unit.z * lift),
      );
    });
    cityMarkers.instanceMatrix.needsUpdate = true;
  };

  // ── arcs ──
  const random = createRandom(2024);
  const arcs: Arc[] = cityUnits.map((cityUnit) => {
    const angle = hubUnit.angleTo(cityUnit);
    const lift = 0.04 + 0.16 * (angle / Math.PI);
    const curve = new GreatCircleArc(hubUnit, cityUnit, lift);
    const mesh = new THREE.Mesh(
      tubeFor(curve, 0.004),
      new THREE.ShaderMaterial({
        vertexShader: ARC.vertex,
        fragmentShader: ARC.fragment,
        uniforms: {
          uColor: { value: accent },
          uHead: { value: 0 },
          uTail: { value: ARC_TAIL },
          uOpacity: { value: ARC_OPACITY },
          uReverse: { value: 1 },
        },
        transparent: true,
        depthWrite: false,
      }),
    );
    mesh.renderOrder = 5;
    mesh.visible = false;
    spin.add(mesh);

    const hubRipple = makeRipple(accent, 0.8);
    placeOnSphere(hubRipple, hubUnit, RADIUS + 0.005);
    spin.add(hubRipple);
    const cityRipple = makeRipple(accent, 0.8);
    placeOnSphere(cityRipple, cityUnit, RADIUS + 0.005);
    spin.add(cityRipple);

    return {
      curve,
      mesh,
      hubRipple,
      cityRipple,
      duration: 3.6 + 2.6 * (angle / Math.PI),
      start: random() * 12,
      inbound: true,
      rippleStart: -1,
      rippleMesh: hubRipple,
    };
  });

  // ── state ──
  const baseYaw = -THREE.MathUtils.degToRad(HUB.lon) + HUB_YAW;
  let time = 0;
  let reduced = false;
  let disposed = false;
  let dots: THREE.InstancedMesh<THREE.CircleGeometry, THREE.ShaderMaterial> | null = null;
  let sphereRadiusPx = 200;

  // drag interaction — offsets on top of the resting pose, spring back to 0
  let dragging = false;
  let pointerId = -1;
  let lastX = 0;
  let lastY = 0;
  let yawOffset = 0;
  let tiltOffset = 0;
  let yawVelocity = 0;

  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    dragging = true;
    pointerId = event.pointerId;
    lastX = event.clientX;
    lastY = event.clientY;
    yawVelocity = 0;
    canvas.setPointerCapture(event.pointerId);
    host.dataset.dragging = "";
  };
  const onPointerMove = (event: PointerEvent) => {
    if (!dragging || event.pointerId !== pointerId) return;
    const dx = event.clientX - lastX;
    const dy = event.clientY - lastY;
    lastX = event.clientX;
    lastY = event.clientY;
    const scale = 1 / Math.max(80, sphereRadiusPx);
    yawOffset += dx * scale;
    tiltOffset = THREE.MathUtils.clamp(tiltOffset + dy * scale * 0.8, -0.5, 0.5);
    yawVelocity = yawVelocity * 0.7 + dx * scale * 60 * 0.3;
  };
  const endDrag = (event: PointerEvent) => {
    if (event.pointerId !== pointerId) return;
    dragging = false;
    pointerId = -1;
    delete host.dataset.dragging;
  };
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);

  const setPalette = (accentCss: string, neutralCss: string) => {
    cssToColor(accentCss, accent);
    cssToColor(neutralCss, neutral);
    meridians.material.color.copy(neutral);
    parallels.material.color.copy(neutral);
    markerMaterial.color.copy(accent);
  };

  /** World units per CSS px at the sphere; everything sized in px hangs off this. */
  let arcRadius = 0.004;
  // Land dots track the globe's size (small globe → finer halftone), clamped
  // so they never fall below a legible pixel or bloat on large screens.
  const dotRadiusPx = () =>
    THREE.MathUtils.clamp(sphereRadiusPx * 0.005, DOT_RADIUS_PX[0], DOT_RADIUS_PX[1]);
  const applyScreenSizes = () => {
    const unit = 1 / sphereRadiusPx;
    if (dots) dots.material.uniforms.uScale.value = dotRadiusPx() * unit;
    hubMarker.scale.setScalar(HUB_MARKER_PX * unit);
    layoutCityMarkers(CITY_MARKER_PX * unit);
    for (const ring of hubPulse) ring.scale.setScalar(HUB_PULSE_PX * unit);
    const nextArcRadius = (ARC_WIDTH_PX / 2) * unit;
    const rebuildTubes = Math.abs(nextArcRadius - arcRadius) / arcRadius > 0.02;
    if (rebuildTubes) arcRadius = nextArcRadius;
    for (const arc of arcs) {
      if (rebuildTubes) {
        const previous = arc.mesh.geometry;
        arc.mesh.geometry = tubeFor(arc.curve, arcRadius);
        previous.dispose();
      }
      arc.hubRipple.scale.setScalar(RIPPLE_PX * unit);
      arc.cityRipple.scale.setScalar(RIPPLE_PX * unit);
    }
  };

  const resize = () => {
    const { width, height } = host.getBoundingClientRect();
    if (width === 0 || height === 0) return;
    const short = Math.min(width, height);
    const margin = THREE.MathUtils.clamp(short * ARC_MARGIN.ratio, ARC_MARGIN.min, ARC_MARGIN.max);
    // As big as the canvas allows. Sits right of centre in wide boxes (the
    // hero copy is on the left) and centres itself once the box is narrow.
    sphereRadiusPx = short / 2 - margin;
    const centerX = Math.max(width / 2, width - sphereRadiusPx - margin - RIGHT_INSET);
    const centerY = height / 2;
    // Size of a square virtual viewport in which an on-axis sphere has radius
    // `sphereRadiusPx`; the canvas is a window into it, so the sphere is a true
    // circle wherever the composition puts it.
    const full =
      (2 *
        sphereRadiusPx *
        Math.tan(THREE.MathUtils.degToRad(FOV / 2)) *
        Math.sqrt(CAMERA_DISTANCE ** 2 - RADIUS ** 2)) /
      RADIUS;
    camera.aspect = 1;
    camera.setViewOffset(full, full, full / 2 - centerX, full / 2 - centerY, width, height);
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    applyScreenSizes();
  };
  resize();

  const updateArc = (arc: Arc) => {
    const material = arc.mesh.material;
    if (reduced) {
      arc.mesh.visible = true;
      material.uniforms.uHead.value = 1;
      material.uniforms.uTail.value = 1;
      material.uniforms.uOpacity.value = 0.4;
      arc.hubRipple.visible = false;
      arc.cityRipple.visible = false;
      return;
    }
    material.uniforms.uTail.value = ARC_TAIL;
    material.uniforms.uOpacity.value = ARC_OPACITY;

    const run = arc.duration * (1 + ARC_TAIL);
    const elapsed = time - arc.start;
    if (elapsed < 0) {
      arc.mesh.visible = false;
    } else {
      const s = Math.min(1, elapsed / run);
      const head = easeInOutSine(s) * (1 + ARC_TAIL);
      arc.mesh.visible = true;
      material.uniforms.uHead.value = head;
      if (head >= 1 && arc.rippleStart < 0 && s < 1) {
        arc.rippleStart = time;
        arc.rippleMesh = arc.inbound ? arc.hubRipple : arc.cityRipple;
      }
      if (s >= 1) {
        arc.mesh.visible = false;
        arc.start = time + ARC_GAP[0] + random() * (ARC_GAP[1] - ARC_GAP[0]);
        arc.inbound = random() < INBOUND_SHARE;
        material.uniforms.uReverse.value = arc.inbound ? 1 : 0;
      }
    }

    if (arc.rippleStart >= 0) {
      const u = (time - arc.rippleStart) / RIPPLE_SECONDS;
      if (u >= 1) {
        arc.rippleMesh.visible = false;
        arc.rippleStart = -1;
      } else {
        arc.rippleMesh.visible = true;
        arc.rippleMesh.material.uniforms.uT.value = u;
      }
    }
  };

  const frame = (dt: number) => {
    if (disposed) return;
    time += dt;

    if (!dragging) {
      yawOffset += yawVelocity * dt;
      yawVelocity *= Math.exp(-dt * 3);
      const k = 1 - Math.exp(-dt * SLOW_RETURN);
      yawOffset -= yawOffset * k;
      tiltOffset -= tiltOffset * k;
    }
    const sway = reduced ? 0 : SWAY.amplitude * Math.sin((2 * Math.PI * time) / SWAY.period);
    spin.rotation.y = baseYaw + sway + yawOffset;
    tilt.rotation.x = HUB_TILT + tiltOffset;

    if (dots) {
      const opacity = dots.material.uniforms.uOpacity;
      if (opacity.value < DOT_OPACITY) {
        opacity.value = Math.min(
          DOT_OPACITY,
          opacity.value + (dt * DOT_OPACITY) / DOT_FADE_SECONDS,
        );
      }
    }

    hubPulse.forEach((ring, i) => {
      ring.material.uniforms.uT.value = reduced ? 0.35 : (time / HUB_PULSE_PERIOD + i * 0.5) % 1;
    });
    for (const arc of arcs) updateArc(arc);

    renderer.render(scene, camera);
  };

  const loadLand = async (url: string, signal?: AbortSignal) => {
    const land = await loadLandMask(url, signal);
    if (disposed || signal?.aborted) return;
    dots = buildDots(land, neutral, dotRadiusPx() / sphereRadiusPx);
    spin.add(dots);
  };

  const dispose = () => {
    disposed = true;
    canvas.removeEventListener("pointerdown", onPointerDown);
    canvas.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("pointerup", endDrag);
    canvas.removeEventListener("pointercancel", endDrag);
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments) {
        object.geometry.dispose();
        const material = object.material as THREE.Material | THREE.Material[];
        if (Array.isArray(material)) {
          material.forEach((m) => {
            m.dispose();
          });
        } else {
          material.dispose();
        }
      }
    });
    renderer.dispose();
    canvas.remove();
  };

  return {
    resize,
    frame,
    setPalette,
    setReducedMotion: (value) => {
      reduced = value;
    },
    loadLand,
    dispose,
  };
}
