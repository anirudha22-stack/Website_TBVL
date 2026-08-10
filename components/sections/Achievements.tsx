"use client";

import { useEffect, useRef, useState } from "react";
import { achievements, publications, startups } from "@/lib/tbvl";
import { Reveal, SectionHead } from "@/components/ui/Reveal";

/**
 * Milestones, with counters that count.
 *
 * Every figure is derived from the content arrays rather than typed in,
 * so a number on screen is a fact about this page. The counter runs once
 * when the row is first seen, and lands on the real value immediately
 * under reduced motion.
 */

const stats = [
  { label: "Recognitions", value: achievements.length, suffix: "" },
  {
    label: "Media features",
    value: achievements.filter((a) => a.tag === "Media").length,
    suffix: "",
  },
  { label: "Ventures", value: startups.length, suffix: "" },
  {
    label: "Papers since 2022",
    value: publications.length,
    suffix: "",
  },
];

/**
 * Counts up to a figure, but only ever counts *down* from the truth.
 *
 * The value starts at its real number and is reset to zero only at the
 * moment an animation is about to run. A stalled rAF — a background tab,
 * a throttled device — would otherwise leave a wrong number sitting on
 * screen indefinitely, and a wrong number is worse than a static one. A
 * timer guard snaps to the target if the frames never arrive.
 */
function useCountUp(target: number) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(target);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let guard = 0;
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        if (document.hidden) return;

        setValue(0);
        guard = window.setTimeout(() => setValue(target), 2200);

        const t0 = performance.now();
        const DURATION = 1400;
        const tick = (now: number) => {
          const t = Math.min(1, (now - t0) / DURATION);
          // Fast out of the gate, long settle — reads as a machine
          // arriving at a figure rather than a slot machine.
          const eased = 1 - Math.pow(1 - t, 4);
          setValue(Math.round(target * eased));
          if (t < 1) raf = requestAnimationFrame(tick);
          else window.clearTimeout(guard);
        };
        raf = requestAnimationFrame(tick);
      },
      { rootMargin: "-15% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
      if (guard) window.clearTimeout(guard);
    };
  }, [target]);

  return { ref, value };
}

function Counter({ value, label }: { value: number; label: string }) {
  const c = useCountUp(value);
  return (
    <div className="border-line/70 border-t pt-5">
      <span
        ref={c.ref}
        className="text-paper block font-mono text-[clamp(2.1rem,5vw,3.4rem)] leading-none tabular-nums"
      >
        {c.value}
      </span>
      <span className="text-faint mt-3 block font-mono text-[10px] tracking-[0.2em] uppercase">
        {label}
      </span>
    </div>
  );
}

const TAG_STYLE: Record<string, string> = {
  Award: "text-violet border-violet/40",
  Grant: "text-cyan border-cyan/40",
  Program: "text-beam border-beam/40",
  Media: "text-mute border-line",
  Invention: "text-cyan border-cyan/40",
};

export function Achievements() {
  return (
    <section id="achievements" className="relative py-28 md:py-40">
      <div className="shell">
        <SectionHead
          eyebrow="Achievements & Activities"
          title={<>Where the work landed.</>}
          lead="Awards, grants, inventions and the occasional appearance in the national press."
        />

        <div className="mt-16 grid grid-cols-2 gap-x-8 gap-y-10 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.07}>
              <Counter value={s.value} label={s.label} />
            </Reveal>
          ))}
        </div>

        <div className="mt-20 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {achievements.map((a, i) => (
            <Reveal key={a.title} delay={Math.min(i, 6) * 0.06}>
              <article
                className={`pane pane-lift spec relative flex h-full flex-col overflow-hidden rounded-2xl p-7 ${
                  i === 0 ? "md:col-span-2 md:p-9" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span
                    className={`rounded border px-2 py-0.5 font-mono text-[10px] tracking-[0.12em] uppercase ${
                      TAG_STYLE[a.tag] ?? TAG_STYLE.Media
                    }`}
                  >
                    {a.tag}
                  </span>
                  {"amount" in a && a.amount && (
                    <span className="text-cyan font-mono text-[15px]">{a.amount}</span>
                  )}
                </div>

                <h3
                  className={`mt-6 leading-[1.2] font-medium ${
                    i === 0 ? "text-[1.75rem]" : "text-[1.25rem]"
                  }`}
                >
                  {a.title}
                </h3>
                <p className="text-mute mt-3.5 max-w-md text-[14px] leading-[1.7]">{a.body}</p>
                <span className="text-faint mt-auto pt-6 font-mono text-[11px] tracking-[0.1em]">
                  {a.who}
                </span>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
