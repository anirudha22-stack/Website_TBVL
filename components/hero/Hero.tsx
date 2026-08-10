"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { alumni, groups, lab, publications, research } from "@/lib/tbvl";

/**
 * The lockup sits centred, in the order the identity reads: the full lab
 * name, the initials, then what the lab is for.
 *
 * It occupies the lower half of the frame while the face holds the
 * upper, and the two overlap through a soft scrim rather than being
 * kept apart — the type sitting *in* the scene is the point, and a
 * gradient is what keeps it legible while it does.
 *
 * Nothing here is hidden by a stylesheet. GSAP applies its own start
 * state at runtime, so a failure to animate leaves the hero readable
 * rather than blank.
 */

const memberCount = groups.reduce((n, g) => n + g.people.length, 0) + 1;
const alumniCount =
  alumni.graduate.length + alumni.undergraduate.length + alumni.associates.length;

const readout = [
  { k: "Papers", v: String(publications.length) },
  { k: "Areas", v: String(research.length) },
  { k: "Members", v: String(memberCount) },
  { k: "Alumni", v: String(alumniCount) },
];

/** Splits text into per-character spans so each can be animated. */
function Chars({ text, className }: { text: string; className?: string }) {
  return (
    <span className={className} aria-hidden="true">
      {text.split("").map((ch, i) => (
        <span key={i} className="char">
          {ch === " " ? " " : ch}
        </span>
      ))}
    </span>
  );
}

export function Hero({ ready }: { ready: boolean }) {
  const root = useRef<HTMLElement>(null);
  /** True once the entrance start-state has actually been applied. */
  const armed = useRef(false);

  /**
   * Hide the entrance elements before the first paint.
   *
   * Without this the hero is fully rendered underneath the intro, so the
   * moment the veil starts lifting you see this headline *through* the
   * intro line still fading out — two centred texts at once — and then
   * watch it snap back to hidden when the entrance finally runs.
   *
   * A layout effect, so it lands before paint. If script never runs, the
   * hero is simply visible, which is the right failure.
   */
  useLayoutEffect(() => {
    if (!root.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const q = gsap.utils.selector(root.current);
    gsap.set(q(".char"), { yPercent: 118, opacity: 0 });
    gsap.set(q("[data-hero='eyebrow']"), { opacity: 0, y: -12 });
    gsap.set(q("[data-hero='mark']"), { opacity: 0, scaleX: 0.4 });
    gsap.set(q("[data-hero='tagline']"), { opacity: 0, y: 16 });
    gsap.set(q("[data-hero='foot'] > *"), { opacity: 0, y: 14 });
    armed.current = true;
  }, []);

  /** Nothing may leave the hero hidden indefinitely. */
  useEffect(() => {
    if (!armed.current) return;
    const id = window.setTimeout(() => {
      if (!root.current) return;
      const q = gsap.utils.selector(root.current);
      gsap.set(q(".char"), { yPercent: 0, opacity: 1 });
      gsap.set(
        q(
          "[data-hero='eyebrow'], [data-hero='mark'], [data-hero='tagline'], [data-hero='foot'] > *",
        ),
        { opacity: 1, y: 0, scaleX: 1 },
      );
    }, 7000);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (!ready || !root.current || !armed.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "expo.out" } });

      // A background tab pauses rAF outright, so an entrance nobody is
      // present for is skipped to its end state. Timers still fire.
      const guard = window.setTimeout(() => {
        if (tl.progress() === 0) tl.progress(1);
      }, 2500);
      if (document.hidden) tl.progress(1);
      tl.eventCallback("onComplete", () => window.clearTimeout(guard));

      tl.to(".char", {
        yPercent: 0,
        opacity: 1,
        duration: 1.5,
        stagger: { each: 0.02, from: "center" },
      })
        .to("[data-hero='eyebrow']", { opacity: 1, y: 0, duration: 1.1 }, 0.1)
        .to("[data-hero='mark']", { opacity: 1, scaleX: 1, duration: 1.3 }, 0.85)
        .to("[data-hero='tagline']", { opacity: 1, y: 0, duration: 1.2 }, 1)
        .to("[data-hero='foot'] > *", { opacity: 1, y: 0, duration: 1, stagger: 0.1 }, 1.2);
    }, root);

    return () => ctx.revert();
  }, [ready]);

  return (
    <section
      id="top"
      ref={root}
      className="relative flex min-h-[100svh] flex-col justify-end pb-10 md:pb-12"
    >
      {/* Settles the type into the scene without erasing what is behind
          it. An earlier version of this was a near-opaque wall across the
          lower two thirds, which is precisely where the face sits — it
          blacked the whole thing out and left only the eye glow showing
          through. It is now a soft pool centred on the lockup, and the
          face stays readable underneath. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 55% at 50% 74%, rgba(5,7,11,0.72) 0%, rgba(5,7,11,0.45) 45%, transparent 78%)",
        }}
      />

      {/* Held at the top edge, clear of the face. Inside the centred
          stack it landed across the nose. */}
      <span
        data-hero="eyebrow"
        className="text-cyan absolute inset-x-0 top-8 text-center font-mono text-[11px] tracking-[0.24em] uppercase"
      >
        {lab.institution}
      </span>

      <div className="shell relative text-center">
        <h1 className="text-[clamp(2rem,6.6vw,5.4rem)] leading-[0.98] font-medium">
          <span className="sr-only">{lab.name}</span>
          <span className="block overflow-hidden pb-[0.09em]">
            <Chars text="Trustworthy" />
          </span>
          <span className="block overflow-hidden pb-[0.09em]">
            <Chars text="BiometraVision" />
            <Chars text=" Lab" className="text-beam" />
          </span>
        </h1>

        {/* The initials, given the weight of a wordmark. */}
        <div data-hero="mark" className="mt-9 flex items-center justify-center gap-5">
          <span className="to-line h-px w-12 bg-gradient-to-r from-transparent sm:w-20" />
          <span className="text-cyan font-mono text-[clamp(0.95rem,2vw,1.35rem)] tracking-[0.62em]">
            <span className="sr-only">{lab.short}</span>
            <span aria-hidden="true">TBVL</span>
          </span>
          <span className="to-line h-px w-12 bg-gradient-to-l from-transparent sm:w-20" />
        </div>

        <p
          data-hero="tagline"
          className="text-paper/75 mx-auto mt-6 max-w-lg text-[clamp(0.95rem,1.6vw,1.15rem)] leading-[1.6]"
        >
          {lab.tagline}
        </p>
      </div>

      <div
        data-hero="foot"
        className="shell relative mt-12 flex flex-col-reverse items-center gap-6 sm:flex-row sm:justify-between"
      >
        <div className="flex items-center gap-3" aria-hidden="true">
          <span className="bg-line relative h-8 w-px overflow-hidden">
            <span className="scroll-cue bg-cyan absolute inset-x-0 top-0 h-3" />
          </span>
          <span className="text-faint font-mono text-[10px] tracking-[0.28em] uppercase">
            Scroll
          </span>
        </div>

        <dl className="flex flex-wrap items-baseline justify-center gap-x-7 gap-y-2">
          {readout.map((r) => (
            <div key={r.k} className="flex items-baseline gap-2">
              <dt className="text-faint font-mono text-[9px] tracking-[0.16em] uppercase">
                {r.k}
              </dt>
              <dd className="text-paper/90 font-mono text-[15px] tabular-nums">{r.v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
