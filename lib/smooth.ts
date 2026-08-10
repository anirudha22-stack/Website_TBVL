"use client";

import Lenis from "lenis";

/**
 * One Lenis instance for the document, owned here rather than by a
 * component, so navigation can drive it from anywhere without prop
 * drilling or context.
 *
 * Smooth scrolling is skipped entirely under reduced motion — hijacking
 * the scroll of someone who asked for less motion is the wrong trade.
 */

let lenis: Lenis | null = null;

export function startSmoothScroll() {
  if (typeof window === "undefined") return () => {};
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  if (lenis) return () => {};

  lenis = new Lenis({
    duration: 1.15,
    // Heavy at the start, long glide out — reads as weight, not lag.
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.6,
  });

  let raf = 0;
  const tick = (time: number) => {
    lenis?.raf(time);
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(raf);
    lenis?.destroy();
    lenis = null;
  };
}

/** Breathing room left above a section heading after jumping to it. */
const LANDING = 28;

/**
 * Scrolls a section's *heading* to the top of the viewport, not its box.
 *
 * Sections carry a large top padding so they breathe when you scroll
 * past them normally. Aligning to the element itself parks all of that
 * padding on screen and the heading starts well down the page, which
 * reads as arriving in the wrong place. The padding is measured and
 * skipped, leaving a small margin above the text.
 */
export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;

  const padTop = parseFloat(getComputedStyle(el).paddingTop) || 0;
  const skip = Math.max(0, padTop - LANDING);

  if (lenis) {
    lenis.scrollTo(el, { offset: skip });
    return;
  }
  const top = el.getBoundingClientRect().top + window.scrollY + skip;
  window.scrollTo({ top, behavior: "smooth" });
}
