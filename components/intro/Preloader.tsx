"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { stage } from "@/lib/motion";

/**
 * The opening shot: black, the line fades up, the line fades out, the
 * black lifts to reveal the face.
 *
 * The sequence runs exactly once, from an effect with no dependencies.
 * That is deliberate. It calls back into the page part-way through, and
 * those callbacks arrive as fresh function identities on every parent
 * render — with them in the dependency list the effect tore itself down
 * and started over mid-flight, replaying the fade-in, so the line
 * appeared twice. The callbacks are read through a ref instead, which is
 * always current without ever being a dependency.
 *
 * Only `opacity` animates, on two independent layers. Nothing moves and
 * nothing scales — scaling text re-rasterises the glyphs every frame,
 * which is exactly the per-frame cost a fade cannot absorb.
 */

const LINE = "Welcome to the Future of Trustworthy AI";

/** Timings in ms. The failsafe is derived, so it cannot undercut them. */
const T = {
  /** Pure black. Also the longest we wait for the webfont. */
  black: 380,
  fadeIn: 800,
  /** Full opacity, holding still. This is the part you actually read. */
  hold: 1200,
  fadeOut: 700,
  /**
   * The veil waits for the line to be *gone* before it starts lifting.
   * Overlapping the two put the hero's headline on screen underneath the
   * line still fading over it. Never shorter than `fadeOut`.
   */
  veilDelay: 700,
  veilDur: 750,
  /** How long after the veil starts before the hero types itself in. */
  wake: 250,
  /** Kept mounted past the end of the veil so it can never snap away. */
  buffer: 160,
};

/**
 * Longest the whole sequence can take, plus headroom. Derived rather
 * than written down: a hardcoded failsafe silently truncates the intro
 * the moment any timing above it grows past it.
 */
const FAILSAFE = T.black + T.fadeIn + T.hold + T.veilDelay + T.veilDur + T.buffer + 2500;

const EASE = "cubic-bezier(0.4, 0, 0.2, 1)";

export function Preloader({
  onPrepare,
  onDone,
}: {
  /** Fired when the intro is still and the 3D can safely be built. */
  onPrepare: () => void;
  /** Fired as the veil starts lifting, to wake the hero. */
  onDone: () => void;
}) {
  const [phase, setPhase] = useState<"black" | "in" | "out" | "gone">("black");

  /** Always the latest callbacks, never a dependency. */
  const cb = useRef({ onPrepare, onDone });
  cb.current = { onPrepare, onDone };

  const prepared = useRef(false);
  const handed = useRef(false);
  const settled = useRef(false);

  const prepare = useCallback(() => {
    if (prepared.current) return;
    prepared.current = true;
    cb.current.onPrepare();
  }, []);

  const release = useCallback(() => {
    if (handed.current) return;
    handed.current = true;
    stage.intro = false;
    cb.current.onDone();
  }, []);

  /** Collapses the sequence — used by the skip and the failsafe. */
  const finish = useCallback(() => {
    if (settled.current) return;
    settled.current = true;
    prepare();
    release();
    setPhase("gone");
  }, [prepare, release]);

  /** `?intro=0` goes straight to the site, for deep links and review. */
  useLayoutEffect(() => {
    if (new URLSearchParams(window.location.search).get("intro") !== "0") return;
    finish();
  }, [finish]);

  /**
   * Last resort. The intro owns the viewport and locks scrolling, so it
   * must never be able to outlive its own sequence.
   */
  useEffect(() => {
    const id = window.setTimeout(finish, FAILSAFE);
    return () => window.clearTimeout(id);
  }, [finish]);

  useEffect(() => {
    if (phase === "gone") return;
    const skip = () => finish();
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, [phase, finish]);

  /* --- the sequence, once ---------------------------------------------- */
  useEffect(() => {
    if (settled.current) return;
    document.body.style.overflow = "hidden";
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers: number[] = [];
    const at = (fn: () => void, ms: number) => timers.push(window.setTimeout(fn, ms));

    // Hold on black until the real face has loaded, so the line never
    // swaps typeface mid-fade. Raced against a deadline, because
    // `fonts.ready` occasionally never settles.
    void Promise.race([
      document.fonts?.ready ?? Promise.resolve(),
      new Promise((r) => window.setTimeout(r, T.black)),
    ]).then(() => {
      if (settled.current) return;
      if (reduced) {
        prepare();
        at(finish, 600);
        return;
      }

      // Two frames before starting, so the browser has certainly painted
      // the opacity-0 state — a transition with no painted start value
      // does not interpolate, it snaps. Raced against a short timer,
      // because a backgrounded tab pauses rAF outright and the sequence
      // would otherwise sit on black until the failsafe fired.
      let began = false;
      const begin = () => {
        if (began || settled.current) return;
        began = true;
        setPhase("in");

        // The still window. Everything expensive happens here.
        at(prepare, T.fadeIn + 40);
        at(() => setPhase("out"), T.fadeIn + T.hold);
        at(release, T.fadeIn + T.hold + T.veilDelay + T.wake);
        at(
          () => {
            settled.current = true;
            setPhase("gone");
          },
          T.fadeIn + T.hold + T.veilDelay + T.veilDur + T.buffer,
        );
      };
      requestAnimationFrame(() => requestAnimationFrame(begin));
      at(begin, 120);
    });

    return () => timers.forEach(window.clearTimeout);
    // Runs once. See the note at the top of the file.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (phase === "gone") document.body.style.overflow = "";
  }, [phase]);

  useEffect(() => () => void (document.body.style.overflow = ""), []);

  if (phase === "gone") return null;

  const lit = phase === "in";
  const leaving = phase === "out";

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100]"
      role="status"
      aria-label="Loading"
    >
      {/* The dark, on its own layer so the two fades stay independent
          instead of multiplying into one another. */}
      <div
        className="bg-ink absolute inset-0"
        style={{
          opacity: leaving ? 0 : 1,
          transition: `opacity ${T.veilDur}ms ${EASE} ${leaving ? T.veilDelay : 0}ms`,
          willChange: "opacity",
        }}
      />

      <div className="absolute inset-0 grid place-items-center px-6">
        <p
          // Sized in vw so the sentence holds one line at every width,
          // capped so it stops growing on large displays.
          className="text-paper text-center text-[clamp(0.85rem,4.1vw,3.2rem)] leading-none font-medium tracking-[-0.03em] whitespace-nowrap"
          style={{
            opacity: lit ? 1 : 0,
            transition: `opacity ${lit ? T.fadeIn : T.fadeOut}ms ${EASE}`,
            willChange: "opacity",
          }}
        >
          {LINE}
        </p>
      </div>
    </div>
  );
}
