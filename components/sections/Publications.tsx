"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { publications, type Publication } from "@/lib/tbvl";
import { Reveal, SectionHead } from "@/components/ui/Reveal";

/**
 * A publication list is a research lab's actual product, so it is
 * designed as a record rather than a card wall: titles in a serif
 * because that is what a paper title looks like, venue and year in mono
 * because those are data, and a year rail down the left so the shape of
 * the lab's output over time is visible without reading a word.
 *
 * The list starts truncated. Sixty rows of animation on entry is a
 * scroll-jank machine and nobody reads row fifty-two by accident.
 */

const KINDS = ["All", "Conference", "Journal", "Workshop", "Abstract"] as const;
type Kind = (typeof KINDS)[number];

const FEATURED = 3;
const PREVIEW = 12;

function Arrow() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="h-3.5 w-3.5 shrink-0 -translate-x-1 opacity-0 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:opacity-100"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 12 12 4M6 4h6v6" />
    </svg>
  );
}

function Row({ p, i }: { p: Publication; i: number }) {
  const Wrapper = p.link ? "a" : "div";
  return (
    <Wrapper
      {...(p.link ? { href: p.link, target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group border-line/60 hover:bg-beam/[0.035] grid grid-cols-[3.2rem_1fr] items-start gap-x-5 border-b py-6 transition-colors duration-500 last:border-b-0 sm:grid-cols-[4.5rem_1fr] sm:gap-x-8"
    >
      <span className="text-faint pt-1 font-mono text-[11px] tabular-nums">{p.year}</span>
      <div>
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-paper group-hover:text-cyan font-serif text-[1.08rem] leading-[1.35] font-normal transition-colors duration-400 sm:text-[1.2rem]">
            {p.title}
          </h3>
          {p.link && (
            <span className="text-cyan pt-1">
              <Arrow />
            </span>
          )}
        </div>
        <p className="text-mute mt-2.5 text-[13px] leading-relaxed">{p.authors}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
          {p.tier && (
            <span className="border-line text-cyan rounded border px-1.5 py-0.5 font-mono text-[10px] tracking-[0.1em]">
              {p.tier}
            </span>
          )}
          <span className="text-faint font-serif text-[12.5px] italic">{p.venue}</span>
          {p.note && (
            <span className="text-faint font-mono text-[10px] tracking-[0.1em] uppercase">
              · {p.note}
            </span>
          )}
        </div>
      </div>
      <span className="sr-only">{i}</span>
    </Wrapper>
  );
}

export function Publications() {
  const [kind, setKind] = useState<Kind>("All");
  const [year, setYear] = useState<number | "All">("All");
  const [expanded, setExpanded] = useState(false);
  const reduced = useReducedMotion();

  const years = useMemo(
    () => Array.from(new Set(publications.map((p) => p.year))).sort((a, b) => b - a),
    [],
  );

  const featured = publications.slice(0, FEATURED);
  const rest = publications.slice(FEATURED);

  const filtered = useMemo(
    () =>
      rest.filter(
        (p) => (kind === "All" || p.kind === kind) && (year === "All" || p.year === year),
      ),
    [kind, year, rest],
  );

  const shown = expanded ? filtered : filtered.slice(0, PREVIEW);

  const reset = (fn: () => void) => {
    fn();
    setExpanded(false);
  };

  return (
    <section id="publications" className="relative py-28 md:py-40">
      <div className="shell">
        <SectionHead
          eyebrow="Publications"
          title={<>The record.</>}
          lead="Peer-reviewed work from CVPR, ICCV, ICML, ECCV, AISTATS, AAAI, WACV and the IEEE Transactions, plus the workshops where the awkward results get argued about first."
          count={`${publications.length} papers · ${years[years.length - 1]}–${years[0]}`}
        />

        {/* ---------------- featured ---------------- */}
        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {featured.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.09}>
              <article className="pane pane-lift spec relative flex h-full flex-col overflow-hidden rounded-2xl p-7">
                <div className="flex items-center justify-between">
                  <span className="text-cyan font-mono text-[10px] tracking-[0.18em]">
                    {p.tier}
                  </span>
                  <span className="text-faint font-mono text-[10px] tabular-nums">
                    {p.year}
                  </span>
                </div>
                <h3 className="text-paper mt-6 font-serif text-[1.32rem] leading-[1.28] font-normal">
                  {p.title}
                </h3>
                <p className="text-mute mt-auto pt-7 text-[12.5px] leading-relaxed">
                  {p.authors}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        {/* ---------------- filters ---------------- */}
        <Reveal
          delay={0.1}
          className="border-line/70 mt-16 flex flex-col gap-4 border-y py-5 lg:flex-row lg:items-center lg:justify-between"
        >
          <div
            className="flex flex-wrap items-center gap-2"
            role="group"
            aria-label="Filter by type"
          >
            {KINDS.map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => reset(() => setKind(k))}
                aria-pressed={kind === k}
                className={`rounded-full border px-3.5 py-1.5 text-[12.5px] transition-all duration-400 ${
                  kind === k
                    ? "border-cyan/60 bg-cyan/10 text-paper"
                    : "border-line text-mute hover:border-beam/50 hover:text-paper"
                }`}
              >
                {k}
              </button>
            ))}
          </div>

          <div
            className="flex flex-wrap items-center gap-2"
            role="group"
            aria-label="Filter by year"
          >
            <button
              type="button"
              onClick={() => reset(() => setYear("All"))}
              aria-pressed={year === "All"}
              className={`font-mono text-[12px] transition-colors duration-400 ${
                year === "All" ? "text-paper" : "text-faint hover:text-mute"
              }`}
            >
              All years
            </button>
            {years.map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => reset(() => setYear(y))}
                aria-pressed={year === y}
                className={`font-mono text-[12px] tabular-nums transition-colors duration-400 ${
                  year === y ? "text-cyan" : "text-faint hover:text-mute"
                }`}
              >
                {y}
              </button>
            ))}
          </div>
        </Reveal>

        {/* ---------------- list ---------------- */}
        <div className="mt-2">
          <AnimatePresence mode="popLayout" initial={false}>
            {shown.map((p, i) => (
              <motion.div
                key={p.title}
                layout={!reduced}
                initial={reduced ? false : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? undefined : { opacity: 0 }}
                transition={{
                  duration: 0.4,
                  delay: Math.min(i, 8) * 0.025,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <Row p={p} i={i} />
              </motion.div>
            ))}
          </AnimatePresence>

          {!filtered.length && (
            <p className="text-faint py-14 text-center font-mono text-[13px]">
              No papers match that combination.
            </p>
          )}
        </div>

        {filtered.length > PREVIEW && (
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="group border-line text-mute hover:border-cyan/50 hover:text-paper flex items-center gap-3 rounded-full border px-6 py-3 text-[13px] transition-colors duration-500"
            >
              {expanded ? "Show fewer" : `Show all ${filtered.length}`}
              <span
                className={`bg-cyan h-1.5 w-1.5 rounded-full transition-transform duration-500 ${
                  expanded ? "scale-100" : "scale-75"
                }`}
              />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
