import * as THREE from "three";

const DEG = Math.PI / 180;

/**
 * lat/lon in degrees → position on a sphere.
 * Convention: lon 0° faces +z (the camera), 90°E faces +x, north is +y.
 * The land mask sampler below uses the same convention.
 */
export function latLonToVector3(
  lat: number,
  lon: number,
  radius = 1,
  target = new THREE.Vector3(),
) {
  const phi = lat * DEG;
  const theta = lon * DEG;
  const c = Math.cos(phi);
  return target.set(
    radius * c * Math.sin(theta),
    radius * Math.sin(phi),
    radius * c * Math.cos(theta),
  );
}

export type LandTest = (lat: number, lon: number) => boolean;

/** Decode an equirectangular mask (white = land) into a lat/lon lookup. */
export async function loadLandMask(url: string, signal?: AbortSignal): Promise<LandTest> {
  const img = new Image();
  img.decoding = "async";
  img.src = url;
  await img.decode();
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

  const w = img.naturalWidth;
  const h = img.naturalHeight;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("2d canvas unavailable");
  ctx.drawImage(img, 0, 0);
  const { data } = ctx.getImageData(0, 0, w, h);

  return (lat, lon) => {
    const x = Math.min(w - 1, Math.max(0, Math.floor(((lon + 180) / 360) * w)));
    const y = Math.min(h - 1, Math.max(0, Math.floor(((90 - lat) / 180) * h)));
    return data[(y * w + x) * 4] > 127;
  };
}

/**
 * Halftone grid on the sphere: rows of dots along latitude, with the
 * longitudinal step widened by 1/cos(lat) so the spacing on the surface stays
 * uniform. Alternate rows are offset half a step. Returns [lat, lon, ...].
 */
export function sampleSurfaceGrid(spacing: number, keep: LandTest) {
  const rows = Math.round(Math.PI / spacing);
  const out: number[] = [];
  for (let i = 0; i < rows; i++) {
    const lat = -90 + ((i + 0.5) / rows) * 180;
    const circumference = 2 * Math.PI * Math.cos(lat * DEG);
    const count = Math.max(1, Math.round(circumference / spacing));
    const offset = i % 2 ? 0.5 : 0;
    for (let j = 0; j < count; j++) {
      const lon = -180 + ((j + offset) / count) * 360;
      if (keep(lat, lon)) out.push(lat, lon);
    }
  }
  return new Float32Array(out);
}

/** Great-circle path between two unit vectors, lifted by a sine bump. */
export class GreatCircleArc extends THREE.Curve<THREE.Vector3> {
  readonly angle: number;
  private readonly sinAngle: number;

  constructor(
    private readonly a: THREE.Vector3,
    private readonly b: THREE.Vector3,
    private readonly lift: number,
  ) {
    super();
    this.angle = a.angleTo(b);
    this.sinAngle = Math.sin(this.angle);
  }

  getPoint(t: number, target = new THREE.Vector3()) {
    if (this.sinAngle < 1e-6) return target.copy(this.a);
    const wa = Math.sin((1 - t) * this.angle) / this.sinAngle;
    const wb = Math.sin(t * this.angle) / this.sinAngle;
    target.set(
      this.a.x * wa + this.b.x * wb,
      this.a.y * wa + this.b.y * wb,
      this.a.z * wa + this.b.z * wb,
    );
    return target.multiplyScalar(1 + this.lift * Math.sin(Math.PI * t));
  }
}

/** mulberry32 — deterministic, so arc timing is identical on every mount. */
export function createRandom(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function easeInOutSine(u: number) {
  return 0.5 - 0.5 * Math.cos(Math.PI * u);
}

/** Resolve any CSS colour (incl. oklch) to a linear-space three.js Color. */
export function cssToColor(css: string, target: THREE.Color) {
  const probe = document.createElement("canvas");
  probe.width = 1;
  probe.height = 1;
  const ctx = probe.getContext("2d", { willReadFrequently: true });
  if (!ctx) return target.set(0xffffff);
  ctx.fillStyle = "#ffffff";
  ctx.fillStyle = css;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return target.setRGB(r / 255, g / 255, b / 255, THREE.SRGBColorSpace);
}
