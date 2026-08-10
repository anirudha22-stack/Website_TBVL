"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { damp, remap, stage } from "@/lib/motion";

/**
 * Everything behind the face. This layer never fully clears — the
 * background is alive on every section, just quiet enough underneath the
 * copy that it never competes for attention.
 */

/** Soft radial falloff, generated once rather than shipped as a file. */
function useHazeTexture() {
  return useMemo(() => {
    const size = 128;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(255,255,255,0.5)");
    g.addColorStop(0.45, "rgba(255,255,255,0.12)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

/**
 * Volumetric fog, faked with a handful of large additive billboards at
 * different depths. Cheaper than a raymarched volume by orders of
 * magnitude and, drifting at these speeds, indistinguishable.
 */
function Haze() {
  const tex = useHazeTexture();
  const group = useRef<THREE.Group>(null);

  const sheets = useMemo(
    () => [
      { pos: [-2.6, 0.6, -3.2], scale: 7.5, color: "#2f6dff", opacity: 0.085, spin: 0.014 },
      { pos: [3.1, -0.9, -4.6], scale: 9, color: "#7b5cff", opacity: 0.06, spin: -0.009 },
      { pos: [0.4, 1.9, -6], scale: 11, color: "#1fb6d6", opacity: 0.05, spin: 0.006 },
      { pos: [-1.2, -2.2, -2.2], scale: 6, color: "#2f6dff", opacity: 0.04, spin: -0.017 },
    ],
    [],
  );

  useEffect(() => () => tex.dispose(), [tex]);

  useFrame((state, delta) => {
    if (!group.current || stage.reduced) return;
    const t = state.clock.elapsedTime;
    group.current.children.forEach((child, i) => {
      const s = sheets[i];
      child.rotation.z = t * s.spin;
      child.position.x = s.pos[0] + Math.sin(t * 0.07 + i) * 0.5;
      child.position.y = s.pos[1] + Math.cos(t * 0.05 + i * 1.7) * 0.4;
    });
    void delta;
  });

  return (
    <group ref={group}>
      {sheets.map((s, i) => (
        <mesh key={i} position={s.pos as [number, number, number]} scale={s.scale}>
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial
            map={tex}
            color={s.color}
            transparent
            opacity={s.opacity}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * Free particles. They drift on their own, and lean toward the pointer —
 * enough to feel like the air responds to you, not enough to notice as
 * an effect.
 */
function Motes() {
  const ref = useRef<THREE.Points>(null);
  const COUNT = 700;

  const geometry = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const seed = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 12;
      pos[i * 3 + 2] = -1 - Math.random() * 12;
      seed[i] = Math.random();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    return g;
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPixelRatio: { value: 1 },
      uOpacity: { value: 0 },
      uColor: { value: new THREE.Color("#7fb4ff") },
    }),
    [],
  );

  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state, delta) => {
    uniforms.uTime.value += stage.reduced ? 0 : Math.min(delta, 0.05);
    uniforms.uPixelRatio.value = state.gl.getPixelRatio();
    uniforms.uOpacity.value = damp(uniforms.uOpacity.value, 1, 2, Math.min(delta, 0.05));
    if (ref.current) {
      ref.current.position.x = damp(
        ref.current.position.x,
        stage.sx * -0.35,
        1.6,
        Math.min(delta, 0.05),
      );
      ref.current.position.y = damp(
        ref.current.position.y,
        stage.sy * 0.28,
        1.6,
        Math.min(delta, 0.05),
      );
    }
  });

  return (
    <points ref={ref} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={uniforms}
        vertexShader={
          /* glsl */ `
          uniform float uTime;
          uniform float uPixelRatio;
          attribute float aSeed;
          varying float vSeed;
          void main() {
            vec3 p = position;
            p.y += sin(uTime * 0.16 + aSeed * 30.0) * 0.55;
            p.x += cos(uTime * 0.11 + aSeed * 22.0) * 0.45;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = (0.6 + aSeed * 1.7) * uPixelRatio * (26.0 / max(-mv.z, 0.1));
            vSeed = aSeed;
          }
        `
        }
        fragmentShader={
          /* glsl */ `
          // highp, because uTime is shared with the vertex stage and GLSL
          // rejects a program whose two stages disagree on a uniform.
          precision highp float;
          uniform vec3 uColor;
          uniform float uOpacity;
          uniform float uTime;
          varying float vSeed;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            if (d > 0.5) discard;
            float twinkle = 0.55 + 0.45 * sin(uTime * 0.9 + vSeed * 40.0);
            gl_FragColor = vec4(uColor, smoothstep(0.5, 0.0, d) * uOpacity * twinkle * 0.4);
          }
        `
        }
      />
    </points>
  );
}

/**
 * Distant constellations: a sparse lattice of nodes far behind the face,
 * wired to their nearest neighbours. Gives the depth something to be
 * measured against when the camera moves.
 */
function Lattice() {
  const group = useRef<THREE.Group>(null);

  const { points, lines } = useMemo(() => {
    const N = 46;
    const nodes: THREE.Vector3[] = [];
    for (let i = 0; i < N; i++) {
      nodes.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 22,
          (Math.random() - 0.5) * 14,
          -7 - Math.random() * 11,
        ),
      );
    }
    const pos = new Float32Array(N * 3);
    nodes.forEach((n, i) => n.toArray(pos, i * 3));

    const seg: number[] = [];
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        if (nodes[i].distanceTo(nodes[j]) < 5.2) {
          seg.push(...nodes[i].toArray(), ...nodes[j].toArray());
        }
      }
    }

    const p = new THREE.BufferGeometry();
    p.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const l = new THREE.BufferGeometry();
    l.setAttribute("position", new THREE.BufferAttribute(new Float32Array(seg), 3));
    return { points: p, lines: l };
  }, []);

  useEffect(
    () => () => {
      points.dispose();
      lines.dispose();
    },
    [points, lines],
  );

  useFrame((state, delta) => {
    if (!group.current || stage.reduced) return;
    const t = state.clock.elapsedTime;
    group.current.rotation.y = Math.sin(t * 0.02) * 0.12;
    group.current.rotation.x = Math.cos(t * 0.015) * 0.06;
    void delta;
  });

  return (
    <group ref={group}>
      <points geometry={points}>
        <pointsMaterial
          size={0.05}
          color="#5fa0ff"
          transparent
          opacity={0.34}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <lineSegments geometry={lines}>
        <lineBasicMaterial
          color="#2c5fb8"
          transparent
          opacity={0.085}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}

export function Atmosphere() {
  return (
    <>
      <Lattice />
      <Haze />
      <Motes />
    </>
  );
}
