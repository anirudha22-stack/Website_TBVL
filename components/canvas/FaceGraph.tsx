"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { buildFaceGraph } from "@/lib/faceGraph";
import { clamp, damp, remap, smoothstep, stage } from "@/lib/motion";

/**
 * The face, as a biometric system sees it.
 *
 * Nodes and edges share one morph function, so the outline and the graph
 * that hangs off it always deform together. Three states are blended:
 * the landmark graph it rests in, a scattered cloud of raw samples, and
 * a relaxed surface reconstruction.
 *
 * Every fourteen seconds an adversarial wavefront crosses the face. The
 * representation collapses toward noise, tints violet, and reconverges.
 * That is the lab's actual research subject, not an effect — which is
 * why it is the one thing on the page allowed to look unstable.
 */

const IRIS = [new THREE.Vector3(-0.36, 0.23, 0.6), new THREE.Vector3(0.36, 0.23, 0.6)];

/** Shared by the point and line shaders so both deform identically. */
const MORPH = /* glsl */ `
  uniform float uTime;
  uniform float uScatter;
  uniform float uSurface;
  uniform float uAttack;
  uniform float uAttackY;
  uniform float uBreath;
  uniform float uBlink;

  attribute vec3  aScatter;
  attribute vec3  aSurface;
  attribute float aRole;
  attribute float aSeed;

  vec3 morph(vec3 p, out float hit) {
    vec3 q = mix(p, aScatter, uScatter);
    q = mix(q, aSurface, uSurface);

    // Breathing: the whole head swells a fraction of a percent.
    q *= 1.0 + uBreath * 0.011;

    // Lids close by squashing the eye nodes toward the pupil line.
    if (aRole > 0.9) {
      q.y = 0.23 + (q.y - 0.23) * (1.0 - uBlink * 0.94);
    }

    // Adversarial wavefront: a band of noise sweeping up the face.
    float d = abs(q.y - uAttackY);
    hit = smoothstep(0.46, 0.0, d) * uAttack;
    q += hit * 0.1 * vec3(
      sin(aSeed * 61.7 + uTime * 9.0),
      cos(aSeed * 37.1 + uTime * 7.3),
      sin(aSeed * 23.9 + uTime * 11.0)
    );
    return q;
  }
`;

const POINT_VERT = /* glsl */ `
  ${MORPH}
  uniform float uPixelRatio;
  uniform float uSize;
  varying float vRole;
  varying float vSeed;
  varying float vHit;

  void main() {
    float hit;
    vec3 q = morph(position, hit);
    vec4 mv = modelViewMatrix * vec4(q, 1.0);
    gl_Position = projectionMatrix * mv;

    // Landmarks read larger than fill; eyes larger again.
    float base = 1.0 + aRole * 1.3;
    float twinkle = 0.75 + 0.25 * sin(uTime * 1.7 + aSeed * 42.0);
    gl_PointSize = uSize * base * twinkle * uPixelRatio * (30.0 / max(-mv.z, 0.1));

    vRole = aRole;
    vSeed = aSeed;
    vHit = hit;
  }
`;

const POINT_FRAG = /* glsl */ `
  // highp throughout: the varyings below are declared at default (high)
  // precision in the vertex stage, and GLSL requires the two stages to
  // agree on every varying and uniform they share.
  precision highp float;
  uniform vec3  uBeam;
  uniform vec3  uCyan;
  uniform vec3  uViolet;
  uniform float uOpacity;
  varying float vRole;
  varying float vSeed;
  varying float vHit;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float disc = smoothstep(0.5, 0.05, d);
    float core = pow(smoothstep(0.3, 0.0, d), 2.0);

    vec3 tint = mix(uBeam, uCyan, vRole);
    tint = mix(tint, uViolet, vHit);

    float a = disc * uOpacity * (0.4 + vSeed * 0.6) * (0.5 + vRole * 0.9);
    gl_FragColor = vec4(tint + core * (0.45 + vRole * 0.8), a);
  }
`;

const LINE_VERT = /* glsl */ `
  ${MORPH}
  attribute float aEnd;
  attribute float aEdge;
  varying float vRole;
  varying float vHit;
  varying float vPulse;

  void main() {
    float hit;
    vec3 q = morph(position, hit);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(q, 1.0);

    // A shimmer running end to end, plus a slow per-edge blink, so the
    // network reads as carrying signal rather than being wiring.
    float travel = sin(uTime * 1.6 + aEdge * 6.283 + aEnd * 2.6);
    float blink = smoothstep(0.55, 1.0, sin(uTime * 0.5 + aEdge * 21.7));
    vPulse = 0.35 + 0.35 * travel + blink * 0.6;

    vRole = aRole;
    vHit = hit;
  }
`;

const LINE_FRAG = /* glsl */ `
  // highp throughout: the varyings below are declared at default (high)
  // precision in the vertex stage, and GLSL requires the two stages to
  // agree on every varying and uniform they share.
  precision highp float;
  uniform vec3  uBeam;
  uniform vec3  uCyan;
  uniform vec3  uViolet;
  uniform float uOpacity;
  varying float vRole;
  varying float vHit;
  varying float vPulse;

  void main() {
    vec3 tint = mix(uBeam, uCyan, vRole * 0.8);
    tint = mix(tint, uViolet, vHit);
    gl_FragColor = vec4(tint, uOpacity * vPulse * 0.5);
  }
`;

export function FaceGraph({ groupRef }: { groupRef: React.RefObject<THREE.Group | null> }) {
  const face = useMemo(() => buildFaceGraph(), []);

  const pointGeo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(face.graph, 3));
    g.setAttribute("aScatter", new THREE.BufferAttribute(face.scatter, 3));
    g.setAttribute("aSurface", new THREE.BufferAttribute(face.surface, 3));
    g.setAttribute("aRole", new THREE.BufferAttribute(face.role, 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(face.seed, 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 4);
    return g;
  }, [face]);

  /**
   * Edges are expanded to non-indexed pairs so each vertex can carry its
   * own end marker and edge id — that is what lets a highlight travel
   * along a segment instead of the whole segment flashing at once.
   */
  const lineGeo = useMemo(() => {
    const n = face.edgeCount * 2;
    const pos = new Float32Array(n * 3);
    const sca = new Float32Array(n * 3);
    const sur = new Float32Array(n * 3);
    const rol = new Float32Array(n);
    const sed = new Float32Array(n);
    const end = new Float32Array(n);
    const eid = new Float32Array(n);

    for (let e = 0; e < face.edgeCount; e++) {
      for (let k = 0; k < 2; k++) {
        const src = face.edges[e * 2 + k];
        const dst = e * 2 + k;
        for (let c = 0; c < 3; c++) {
          pos[dst * 3 + c] = face.graph[src * 3 + c];
          sca[dst * 3 + c] = face.scatter[src * 3 + c];
          sur[dst * 3 + c] = face.surface[src * 3 + c];
        }
        rol[dst] = face.role[src];
        sed[dst] = face.seed[src];
        end[dst] = k;
        eid[dst] = (e % 97) / 97;
      }
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aScatter", new THREE.BufferAttribute(sca, 3));
    g.setAttribute("aSurface", new THREE.BufferAttribute(sur, 3));
    g.setAttribute("aRole", new THREE.BufferAttribute(rol, 1));
    g.setAttribute("aSeed", new THREE.BufferAttribute(sed, 1));
    g.setAttribute("aEnd", new THREE.BufferAttribute(end, 1));
    g.setAttribute("aEdge", new THREE.BufferAttribute(eid, 1));
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 4);
    return g;
  }, [face]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScatter: { value: 1 },
      uSurface: { value: 0 },
      uAttack: { value: 0 },
      uAttackY: { value: -2 },
      uBreath: { value: 0 },
      uBlink: { value: 0 },
      uPixelRatio: { value: 1 },
      uSize: { value: 1 },
      uOpacity: { value: 0 },
      uBeam: { value: new THREE.Color("#4c8dff") },
      uCyan: { value: new THREE.Color("#46e5f5") },
      uViolet: { value: new THREE.Color("#a98bff") },
    }),
    [],
  );

  /**
   * The two materials are written through refs rather than through the
   * `uniforms` object above.
   *
   * Passing one uniforms object to two `<shaderMaterial>` elements does
   * not give you one shared object: each material ends up with its own
   * copy, so mutating the original updates neither. That is what made
   * the face invisible — the frame loop was faithfully animating a
   * uniforms object no material was rendering with. The object below is
   * now only the initial template.
   */
  const pointMat = useRef<THREE.ShaderMaterial>(null);
  const lineMat = useRef<THREE.ShaderMaterial>(null);

  const eyeL = useRef<THREE.Mesh>(null);
  const eyeR = useRef<THREE.Mesh>(null);
  // `t` drives the ambient loops and is frozen under reduced motion.
  // `a` drives assembly only, and always advances — the face appearing
  // at all is not an ambient animation, and gating it on `t` hid the
  // whole hero from anyone who asked for less movement.
  const clock = useRef({ t: 0, a: 0, nextAttack: 7, blinkAt: 3.5, blink: 0 });

  useEffect(
    () => () => {
      pointGeo.dispose();
      lineGeo.dispose();
    },
    [pointGeo, lineGeo],
  );

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const c = clock.current;

    /** Writes one uniform to both materials that actually render. */
    const set = (name: string, value: number) => {
      const a = pointMat.current;
      const b = lineMat.current;
      if (a?.uniforms[name]) a.uniforms[name].value = value;
      if (b?.uniforms[name]) b.uniforms[name].value = value;
    };
    /** Reads a uniform back, for anything outside the shaders. */
    const get = (name: string) => pointMat.current?.uniforms[name]?.value ?? 0;

    if (!stage.reduced) c.t += dt;
    // Assembly runs from mount, unconditionally. The intro overlay is
    // opaque while it happens, so the face is already forming when the
    // veil lifts — and, more importantly, no single flag can leave the
    // hero empty if it fails to flip.
    c.a += dt;
    const t = c.t;
    set("uTime", t);
    set("uPixelRatio", state.gl.getPixelRatio());

    // --- assembly ---------------------------------------------------
    // The face arrives out of scattered samples once the intro clears,
    // which is the same gesture as the headline dissolving into it.
    // Reduced motion gets the assembled face immediately rather than
    // watching it build.
    const assembled = stage.reduced ? 1 : smoothstep(remap(c.a, 0.35, 1.9, 0, 1));

    // --- adversarial cycle ------------------------------------------
    let attack = 0;
    const since = t - c.nextAttack;
    if (since > 0) {
      // 0.35s onset, 0.5s hold, 1.7s recovery.
      if (since < 0.35) attack = since / 0.35;
      else if (since < 0.85) attack = 1;
      else if (since < 2.55) attack = 1 - (since - 0.85) / 1.7;
      else {
        attack = 0;
        c.nextAttack = t + 12 + Math.random() * 6;
      }
      set("uAttackY", -1.2 + (since / 2.2) * 2.6);
    }
    set("uAttack", stage.reduced ? 0 : attack);

    // --- representation state ---------------------------------------
    // Rests in the landmark graph; drifts toward the reconstructed
    // surface on a slow cycle; collapses to raw samples under attack.
    const surfaceCycle = stage.reduced ? 0.25 : 0.42 + 0.42 * Math.sin(t * 0.19 - 1.2);
    const collapse = Math.pow(attack, 1.5) * 0.55;
    set("uSurface", damp(get("uSurface"), surfaceCycle * (1 - collapse), 3, dt));
    set("uScatter", damp(get("uScatter"), 1 - assembled + collapse, 4.5, dt));

    set("uBreath", stage.reduced ? 0 : Math.sin(t * 0.62) + Math.sin(t * 0.29) * 0.4);

    // --- blink -------------------------------------------------------
    if (!stage.reduced) {
      if (t > c.blinkAt) {
        c.blink = Math.min(1, c.blink + dt * 11);
        if (c.blink >= 1) {
          c.blinkAt = t + 3 + Math.random() * 5;
          c.blink = 0.999;
        }
      } else {
        c.blink = Math.max(0, c.blink - dt * 9);
      }
    }
    // Triangle so the lid closes and opens rather than snapping back.
    const blink = c.blink > 0.5 ? (1 - c.blink) * 2 : c.blink * 2;
    set("uBlink", blink);

    // --- presence ----------------------------------------------------
    // Holds the frame through the hero, then clears out so the sections
    // below are never read through a face.
    const presence = assembled * (1 - smoothstep(remap(stage.hero, 0.35, 0.92, 0, 1)));
    const opacity = damp(get("uOpacity"), presence, 6, dt);
    set("uOpacity", opacity);
    set("uSize", damp(get("uSize"), 1 + attack * 0.5, 5, dt));

    const g = groupRef.current;
    if (g) {
      // Turns to follow the reader, and tracks the pointer like a gaze.
      stage.sx = damp(stage.sx, stage.px, 2.4, dt);
      stage.sy = damp(stage.sy, stage.py, 2.4, dt);
      const idle = stage.reduced ? 0 : Math.sin(t * 0.17) * 0.09;
      g.rotation.y = damp(g.rotation.y, idle + stage.sx * 0.3 + stage.hero * 0.5, 3, dt);
      g.rotation.x = damp(g.rotation.x, stage.sy * 0.14 + stage.hero * 0.12, 3, dt);
      // Rides high in the frame so the centred lockup crosses the jaw
      // rather than the eyes, then lifts further as the hero scrolls away.
      g.position.y = damp(g.position.y, 0.84 + stage.hero * 0.5, 3, dt);
      g.scale.setScalar(damp(g.scale.x || 0.62, 0.62, 3, dt));
      g.visible = opacity > 0.004;
    }

    // Eye glow scales with the blink so the light closes with the lid.
    const open = 1 - blink;
    const pulse = 1 + Math.sin(t * 2.3) * 0.12;
    for (const ref of [eyeL, eyeR]) {
      const m = ref.current;
      if (!m) continue;
      m.scale.set(pulse, Math.max(0.04, open * pulse), 1);
      const mat = m.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.26 * opacity * open;
    }
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={lineGeo} frustumCulled={false}>
        <shaderMaterial
          ref={lineMat}
          uniforms={uniforms}
          vertexShader={LINE_VERT}
          fragmentShader={LINE_FRAG}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      <points geometry={pointGeo} frustumCulled={false}>
        <shaderMaterial
          ref={pointMat}
          uniforms={uniforms}
          vertexShader={POINT_VERT}
          fragmentShader={POINT_FRAG}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Additive discs behind the irises — the only thing bright enough
          to bloom, which is what makes the gaze land. */}
      {IRIS.map((p, i) => (
        <mesh key={i} ref={i === 0 ? eyeL : eyeR} position={p}>
          <circleGeometry args={[0.05, 24]} />
          <meshBasicMaterial
            color="#9df4ff"
            transparent
            opacity={0}
            toneMapped={false}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

export { clamp };
