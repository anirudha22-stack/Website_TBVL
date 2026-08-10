"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { startTracking } from "@/lib/motion";

/**
 * The GL scene is client-only and sits behind everything, never taking
 * pointer events.
 *
 * `start` decides *when* three.js is allowed to touch the main thread.
 * Creating the WebGL context, compiling four shader programs and
 * allocating the post-processing targets is a long synchronous block —
 * dropped in the middle of the intro's fade it stalls the compositor and
 * the fade visibly stutters. The intro therefore holds it until it has a
 * still moment to spend, and the scene is ready well before the veil
 * lifts.
 */
const Scene = dynamic(() => import("./Scene"), { ssr: false });

export function SceneHost({ start }: { start: boolean }) {
  // Scroll and pointer tracking is cheap and everything else reads it,
  // so it runs immediately regardless of when the scene is allowed up.
  useEffect(() => startTracking(), []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
      style={{ contain: "strict" }}
    >
      {start && <Scene />}
    </div>
  );
}
