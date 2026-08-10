"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { news } from "@/lib/tbvl";
import { Reveal, SectionHead } from "@/components/ui/Reveal";

/**
 * News as a timeline with a beam that fills as you read down it.
 *
 * The source site lists these without dates, so the rail is marked by
 * period rather than pretending to a precision the content does not
 * have. The beam is scrubbed by ScrollTrigger — it is the one place a
 * scroll-linked animation earns its cost, because it doubles as a
 * reading-progress indicator for a long list.
 */

const KIND_COLOR: Record<string, string> = {
  Grant: "text-cyan border-cyan/45",
  Paper: "text-beam border-beam/45",
  Award: "text-violet border-violet/45",
  Program: "text-violet border-violet/45",
  Event: "text-mute border-line",
};

export function News() {
  const root = useRef<HTMLDivElement>(null);
  const beam = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!root.current || !beam.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(beam.current, { scaleY: 1 });
      return;
    }
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        beam.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top 72%",
            end: "bottom 82%",
            scrub: 0.6,
          },
        },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  // Period changes become rail headings, so the list reads in blocks.
  let lastPeriod = "";

  return (
    <section id="news" className="relative py-28 md:py-40">
      <div className="shell">
        <SectionHead
          eyebrow="News"
          title={<>What has been happening.</>}
          count={`${news.length} entries`}
        />

        {/* The indent lives on each row rather than on this container, so
            the rail and the nodes share one origin and cannot drift out
            of alignment at different breakpoints. */}
        <div ref={root} className="relative mt-16">
          <span
            aria-hidden="true"
            className="bg-line absolute top-2 bottom-2 left-[3px] w-px"
          />
          <span
            ref={beam}
            aria-hidden="true"
            className="from-cyan via-beam to-violet absolute top-2 bottom-2 left-[3px] w-px origin-top bg-gradient-to-b"
            style={{ transform: "scaleY(0)" }}
          />

          <ol className="space-y-9">
            {news.map((item, i) => {
              const newPeriod = item.period !== lastPeriod;
              lastPeriod = item.period;
              return (
                <Reveal
                  as="li"
                  key={i}
                  delay={Math.min(i, 8) * 0.04}
                  className="relative pl-9 sm:pl-14"
                >
                  {/* Node on the rail. `left-0` is the row's own left edge,
                      which padding does not move — so it lands on the rail. */}
                  <span
                    aria-hidden="true"
                    className="bg-cyan/80 ring-ink absolute top-[0.62rem] left-0 h-[7px] w-[7px] rounded-full ring-2"
                  />

                  {newPeriod && (
                    <span className="text-faint mb-3 block font-mono text-[10px] tracking-[0.24em] uppercase">
                      {item.period}
                    </span>
                  )}

                  <div className="group flex flex-col gap-2.5 sm:flex-row sm:items-start sm:gap-5">
                    {/* Fixed width so a longer label like PROGRAM cannot
                        push its row's text out of line with the others. */}
                    <span
                      className={`w-fit shrink-0 rounded border px-2 py-0.5 text-center font-mono text-[10px] tracking-[0.12em] uppercase sm:w-[5.75rem] ${
                        KIND_COLOR[item.kind] ?? KIND_COLOR.Event
                      }`}
                    >
                      {item.kind}
                    </span>
                    <p className="text-paper/85 group-hover:text-paper max-w-2xl text-[15px] leading-[1.7] transition-colors duration-400">
                      {item.text}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
