"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, advance, useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import * as THREE from "three";
import { FaceGraph } from "./FaceGraph";
import { Atmosphere } from "./Atmosphere";
import { clamp, damp, remap, smoothstep, stage } from "@/lib/motion";

/**
 * Scroll drives the camera through a short list of framings, each one a
 * held shot rather than a continuous drift. Between them we ease, then
 * damp toward the result, so a flung scrollbar never snaps the frame.
 */
type Shot = { at: number; pos: [number, number, number]; look: [number, number, number] };

const SHOTS: Shot[] = [
  // Framed on the raised face, leaving the lower half of the shot for
  // the lockup to sit in.
  { at: 0.0, pos: [0, 0.36, 3.95], look: [0, 0.4, 0] },
  { at: 0.1, pos: [0.4, 0.5, 4.6], look: [0, 0.36, 0] },
  { at: 0.33, pos: [-1.5, 0.6, 6.4], look: [0, 0, -1.2] },
  { at: 0.58, pos: [1.7, -0.5, 7.4], look: [0, 0, -2] },
  { at: 0.82, pos: [-1.0, 0.9, 6.2], look: [0, 0.1, -1.4] },
  { at: 1.0, pos: [0, 0.25, 5.0], look: [0, 0, -1] },
];

function Rig() {
  const { camera, size, gl } = useThree();
  // Starts where the entrance push begins — the first shot, pulled back
  // by the full push distance. Starting at the settled position instead
  // made the camera drift backwards before coming forward.
  const pos = useRef(new THREE.Vector3(0, 0.48, 5.1));
  const look = useRef(new THREE.Vector3(0, 0.4, 0));
  const opacity = useRef(1);
  const reveal = useRef(0);
  const tp = useMemo(() => new THREE.Vector3(), []);
  const tl = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const s = stage.scroll;

    let i = 0;
    while (i < SHOTS.length - 2 && s > SHOTS[i + 1].at) i++;
    const a = SHOTS[i];
    const b = SHOTS[i + 1];
    const e = smoothstep((s - a.at) / (b.at - a.at || 1));

    tp.set(
      a.pos[0] + (b.pos[0] - a.pos[0]) * e,
      a.pos[1] + (b.pos[1] - a.pos[1]) * e,
      a.pos[2] + (b.pos[2] - a.pos[2]) * e,
    );
    tl.set(
      a.look[0] + (b.look[0] - a.look[0]) * e,
      a.look[1] + (b.look[1] - a.look[1]) * e,
      a.look[2] + (b.look[2] - a.look[2]) * e,
    );

    // Narrow viewports need more distance to keep the head in frame.
    if (size.width < 1024) tp.z += 1.1;
    if (size.width < 640) tp.z += 0.9;

    /**
     * Entrance push. The camera keeps closing for well over a second
     * after the veil starts lifting, so the reveal is a shot still in
     * motion rather than a cut to a settled frame. Ramps once, from the
     * moment the intro releases the scene.
     */
    // Gated on the intro, unlike everything else — this only shifts the
    // camera, so a stuck flag costs a slightly wider framing rather than
    // an empty hero.
    if (!stage.intro) reveal.current = Math.min(1, reveal.current + dt / 1.5);
    tp.z += (1 - smoothstep(reveal.current)) * 1.15;
    tp.y += (1 - smoothstep(reveal.current)) * 0.12;

    if (!stage.reduced) {
      tp.x += stage.sx * 0.34;
      tp.y += -stage.sy * 0.22;
    }

    pos.current.set(
      damp(pos.current.x, tp.x, 2.4, dt),
      damp(pos.current.y, tp.y, 2.4, dt),
      damp(pos.current.z, tp.z, 2.4, dt),
    );
    look.current.set(
      damp(look.current.x, tl.x, 3, dt),
      damp(look.current.y, tl.y, 3, dt),
      damp(look.current.z, tl.z, 3, dt),
    );
    camera.position.copy(pos.current);
    camera.lookAt(look.current);

    // The canvas holds full strength through the hero, then settles to a
    // low ambient presence so no section is ever read through the scene.
    // Deliberately not gated on the intro: the overlay is opaque while it
    // plays, so gating here bought nothing and gave one flag the power to
    // blank the entire scene.
    const target = remap(stage.hero, 0.4, 1, 1, 0.42);
    opacity.current = damp(opacity.current, clamp(target, 0, 1), 3, dt);
    gl.domElement.style.opacity = opacity.current.toFixed(3);
  });

  return null;
}

/**
 * Manual frame stepping, for development only.
 *
 * Chrome suspends requestAnimationFrame in any tab that is not the
 * foreground tab, which makes a WebGL scene impossible to inspect or
 * screenshot from automation. `__advanceScene(n)` drives the loop by
 * hand so the scene can be checked frame by frame regardless.
 *
 * Installed at module scope rather than in an effect, because React's
 * passive effects are also deferred in a hidden tab.
 */
const STEPPING =
  process.env.NODE_ENV !== "production" &&
  typeof window !== "undefined" &&
  new URLSearchParams(window.location.search).get("step") === "1";

if (STEPPING) {
  let clock = performance.now();
  (window as unknown as { __advanceScene: (n?: number) => string }).__advanceScene = (
    n = 90,
  ) => {
    for (let i = 0; i < n; i++) {
      clock += 16.7;
      advance(clock);
    }
    return `advanced ${n} frames`;
  };
}

export default function Scene() {
  const faceRef = useRef<THREE.Group>(null);
  const [awake, setAwake] = useState(true);

  useEffect(() => {
    const onVisibility = () => setAwake(!document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  return (
    <Canvas
      // 1.6 rather than 2: this is a soft, additive scene at any size and
      // the extra pixels only cost frames.
      dpr={[1, 1.6]}
      frameloop={STEPPING ? "never" : awake ? "always" : "never"}
      gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.36, 3.95], fov: 42, near: 0.1, far: 60 }}
      // Starts fully opaque. The canvas is transparent until something is
      // drawn into it, so there is nothing to hide — and starting at zero
      // made the whole scene depend on the frame loop having run at least
      // once to become visible at all.
      style={{ background: "transparent" }}
      onCreated={
        STEPPING
          ? (state) => {
              (window as unknown as { __r3f: unknown }).__r3f = state;
            }
          : undefined
      }
    >
      <Suspense fallback={null}>
        <Atmosphere />
        <FaceGraph groupRef={faceRef} />
        <Rig />
        {/* Two passes. Everything in this scene is additive on black, so
            bloom does the lighting and a vignette closes the frame. */}
        <EffectComposer multisampling={0}>
          <Bloom
            intensity={0.85}
            luminanceThreshold={0.18}
            luminanceSmoothing={0.32}
            mipmapBlur
            radius={0.72}
          />
          <Vignette offset={0.2} darkness={0.78} eskil={false} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
