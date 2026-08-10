"use client";

import { useMemo, useState } from "react";
import { research } from "@/lib/tbvl";
import { Reveal, SectionHead } from "@/components/ui/Reveal";

/**
 * Research areas as a constellation, not a grid.
 *
 * Edges are drawn from each area's `links`, which name the other areas
 * it shares methods with — so the diagram encodes how the lab's work
 * actually connects. Selecting a node dims everything it is not wired
 * to, which is the fastest way to read a graph.
 *
 * Positions are hand-placed for composition. On narrow screens the
 * diagram is replaced by an ordered list rather than being squeezed:
 * a constellation you cannot hit with a finger is decoration.
 */

const AT: Record<string, [number, number]> = {
  trust: [50, 11],
  biometrics: [17, 30],
  explainable: [83, 27],
  generative: [31, 57],
  architectures: [70, 55],
  efficient: [89, 74],
  threed: [11, 71],
  vision: [50, 88],
};

/** Unique undirected pairs, so an edge is never drawn twice. */
function useEdges() {
  return useMemo(() => {
    const seen = new Set<string>();
    const out: { a: string; b: string }[] = [];
    for (const area of research) {
      for (const b of area.links) {
        if (!AT[b]) continue;
        const key = [area.id, b].sort().join("|");
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({ a: area.id, b });
      }
    }
    return out;
  }, []);
}

export function Research() {
  const edges = useEdges();
  const [active, setActive] = useState(research[0].id);
  const current = research.find((r) => r.id === active) ?? research[0];
  const related = new Set(current.links);

  return (
    <section id="research" className="relative py-28 md:py-40">
      <div className="shell">
        <SectionHead
          eyebrow="Research"
          title={
            <>
              Eight problems that keep
              <br />
              turning out to be one problem.
            </>
          }
          lead="Recognition, generation, explanation and efficiency all fail in the same place — the moment the input stops being clean. Select an area to see what it is wired to."
          count={`${research.length} areas`}
        />

        <div className="mt-16 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16">
          {/* ---------------- the diagram ---------------- */}
          <Reveal className="hidden lg:block">
            <div className="relative aspect-[5/4] w-full">
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="absolute inset-0 h-full w-full"
                aria-hidden="true"
              >
                {edges.map(({ a, b }) => {
                  const lit = a === active || b === active;
                  return (
                    <line
                      key={`${a}-${b}`}
                      x1={AT[a][0]}
                      y1={AT[a][1]}
                      x2={AT[b][0]}
                      y2={AT[b][1]}
                      stroke={lit ? "#46e5f5" : "#26324a"}
                      strokeWidth={lit ? 0.32 : 0.18}
                      vectorEffect="non-scaling-stroke"
                      className="transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                      opacity={lit ? 0.85 : 0.5}
                    />
                  );
                })}
              </svg>

              {research.map((area) => {
                const on = area.id === active;
                const near = related.has(area.id);
                const [x, y] = AT[area.id];
                return (
                  <button
                    key={area.id}
                    type="button"
                    onMouseEnter={() => setActive(area.id)}
                    onFocus={() => setActive(area.id)}
                    onClick={() => setActive(area.id)}
                    aria-pressed={on}
                    className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{ left: `${x}%`, top: `${y}%` }}
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        className={`grid place-items-center rounded-full border transition-all duration-500 ${
                          on
                            ? "border-cyan bg-cyan h-4 w-4 shadow-[0_0_22px_4px_rgb(70_229_245/0.45)]"
                            : near
                              ? "border-beam/80 bg-beam/40 h-3 w-3"
                              : "border-line bg-slate h-2.5 w-2.5"
                        }`}
                      />
                      <span
                        className={`text-[12.5px] whitespace-nowrap transition-colors duration-500 ${
                          on ? "text-paper" : near ? "text-mute" : "text-faint"
                        }`}
                      >
                        {area.short}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* ---------------- the read-out ---------------- */}
          <Reveal delay={0.1} className="hidden lg:block">
            <div className="pane grain relative overflow-hidden rounded-2xl p-9">
              <span className="text-cyan font-mono text-[10px] tracking-[0.22em] uppercase">
                {String(research.indexOf(current) + 1).padStart(2, "0")} /{" "}
                {String(research.length).padStart(2, "0")}
              </span>
              <h3 className="mt-5 text-[1.85rem] leading-[1.12] font-medium">
                {current.title}
              </h3>
              <p className="text-mute mt-5 text-[15px] leading-[1.75]">{current.body}</p>
              <div className="border-line/70 mt-8 border-t pt-5">
                <span className="text-faint font-mono text-[10px] tracking-[0.2em] uppercase">
                  Shares methods with
                </span>
                <div className="mt-3 flex flex-wrap gap-2">
                  {current.links.map((id) => {
                    const other = research.find((r) => r.id === id);
                    if (!other) return null;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setActive(id)}
                        className="border-line text-mute hover:border-cyan/50 hover:text-paper rounded-full border px-3 py-1.5 text-[12px] transition-colors duration-400"
                      >
                        {other.short}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </Reveal>

          {/* ---------------- narrow screens ---------------- */}
          <ol className="border-line/70 bg-line/60 flex flex-col gap-px overflow-hidden rounded-2xl border lg:hidden">
            {research.map((area, i) => (
              <Reveal as="li" key={area.id} delay={i * 0.04} className="bg-carbon/70 p-6">
                <div className="flex items-baseline gap-4">
                  <span className="text-cyan font-mono text-[10px]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-[1.2rem] leading-tight font-medium">{area.title}</h3>
                </div>
                <p className="text-mute mt-3 pl-9 text-[14px] leading-[1.7]">{area.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
