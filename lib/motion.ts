"use client";

/**
 * Shared scroll and pointer state, deliberately kept outside React.
 *
 * The 3D scene samples these every frame. Routing them through component
 * state would re-render the tree sixty times a second to move a camera
 * that React does not own anyway.
 */

export const stage = {
  /** 0 → 1 across the whole document. */
  scroll: 0,
  /** 0 → 1 across the hero alone, which is what the face reacts to. */
  hero: 0,
  /** Pointer in normalised device coords, −1 → 1. */
  px: 0,
  py: 0,
  /** Smoothed pointer, so nothing snaps when the mouse jumps. */
  sx: 0,
  sy: 0,
  reduced: false,
  /** Raised while the intro is still playing. */
  intro: true,
};

let tracking = false;

export function startTracking() {
  if (tracking || typeof window === "undefined") return () => {};
  tracking = true;

  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  // `?motion=still` forces the reduced presentation on. It makes the
  // low-motion version reviewable without changing an OS setting, which
  // is the only practical way to check that everything still reads when
  // nothing is moving.
  const forced = new URLSearchParams(window.location.search).get("motion") === "still";
  stage.reduced = forced || motion.matches;
  const onMotion = () => (stage.reduced = forced || motion.matches);
  motion.addEventListener("change", onMotion);

  let frame = 0;
  const read = () => {
    frame = 0;
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    stage.scroll = max > 0 ? clamp(window.scrollY / max, 0, 1) : 0;
    stage.hero = clamp(window.scrollY / Math.max(window.innerHeight, 1), 0, 1);
  };
  const onScroll = () => {
    if (!frame) frame = requestAnimationFrame(read);
  };

  const onPointer = (e: PointerEvent) => {
    stage.px = (e.clientX / window.innerWidth) * 2 - 1;
    stage.py = (e.clientY / window.innerHeight) * 2 - 1;
  };

  read();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  window.addEventListener("pointermove", onPointer, { passive: true });

  return () => {
    tracking = false;
    motion.removeEventListener("change", onMotion);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
    window.removeEventListener("pointermove", onPointer);
    if (frame) cancelAnimationFrame(frame);
  };
}

export const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

/** Maps a value between ranges and clamps to the output. */
export function remap(v: number, a: number, b: number, c: number, d: number) {
  return c + clamp((v - a) / (b - a || 1), 0, 1) * (d - c);
}

/** Frame-rate independent smoothing. */
export function damp(current: number, target: number, lambda: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

export const smoothstep = (t: number) => {
  const x = clamp(t, 0, 1);
  return x * x * (3 - 2 * x);
};
