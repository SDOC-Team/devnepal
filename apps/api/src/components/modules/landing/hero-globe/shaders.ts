/**
 * All colour uniforms are in three's linear working space; every fragment
 * shader ends with `colorspace_fragment` so output matches the CSS tokens.
 */

/**
 * Halftone land dots. Instanced discs sitting on the sphere; alpha falls off
 * as a disc turns away from the camera so the rim reads as a sphere edge.
 */
export const DOTS = {
  vertex: /* glsl */ `
    uniform float uScale;
    varying float vFacing;
    void main() {
      vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position * uScale, 1.0);
      vec3 n = normalize(normalMatrix * mat3(instanceMatrix) * normal);
      vFacing = dot(n, normalize(-mvPosition.xyz));
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragment: /* glsl */ `
    uniform vec3 uColor;
    uniform float uOpacity;
    varying float vFacing;
    void main() {
      if (vFacing < 0.0) discard;
      float a = uOpacity * mix(0.12, 1.0, smoothstep(0.0, 0.55, vFacing));
      gl_FragColor = vec4(uColor, a);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }
  `,
};

/** Tube along a great-circle arc; uv.x is the 0→1 parameter along the path. */
export const ARC = {
  vertex: /* glsl */ `
    varying float vT;
    void main() {
      vT = uv.x;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragment: /* glsl */ `
    uniform vec3 uColor;
    uniform float uHead;
    uniform float uTail;
    uniform float uOpacity;
    uniform float uReverse;
    varying float vT;
    void main() {
      float t = mix(vT, 1.0 - vT, uReverse);
      float body = smoothstep(uHead - uTail, uHead, t);
      float cut = 1.0 - smoothstep(uHead, uHead + 0.008, t);
      float a = body * body * cut * uOpacity;
      if (a < 0.003) discard;
      gl_FragColor = vec4(uColor, a);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }
  `,
};

/** Expanding ring on a tangent quad. uT runs 0→1 over the ripple's life. */
export const RIPPLE = {
  vertex: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragment: /* glsl */ `
    uniform vec3 uColor;
    uniform float uT;
    uniform float uStrength;
    varying vec2 vUv;
    void main() {
      float d = length(vUv * 2.0 - 1.0);
      float r = mix(0.1, 0.94, uT);
      float ring = 1.0 - smoothstep(0.0, 0.08, abs(d - r));
      float a = ring * (1.0 - uT) * (1.0 - uT) * uStrength;
      if (a < 0.003) discard;
      gl_FragColor = vec4(uColor, a);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }
  `,
};
