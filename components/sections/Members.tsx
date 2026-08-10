"use client";

import { useMemo, useState } from "react";
import { alumni, faculty, groups } from "@/lib/tbvl";
import { glyphFor } from "@/lib/glyph";
import { Reveal, SectionHead } from "@/components/ui/Reveal";

/**
 * People, with generated identity glyphs instead of portraits.
 *
 * There is no photo set to work from, and a stock headshot would be a
 * fabrication. Each person instead gets a small landmark graph derived
 * from their own name — the same structure the hero face is built out
 * of, at reading size.
 */

function GlyphMark({ name, size = 56 }: { name: string; size?: number }) {
  const g = useMemo(() => glyphFor(name), [name]);
  const stroke = `hsl(${g.hue} 82% 68%)`;

  return (
    <svg
      viewBox="0 0 1 1"
      width={size}
      height={size}
      className="shrink-0 overflow-visible"
      aria-hidden="true"
    >
      <g className="origin-center transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-[24deg]">
        {g.edges.map(([a, b], i) => (
          <line
            key={i}
            x1={g.nodes[a].x}
            y1={g.nodes[a].y}
            x2={g.nodes[b].x}
            y2={g.nodes[b].y}
            stroke={stroke}
            strokeWidth={0.012}
            opacity={0.42}
          />
        ))}
        {g.nodes.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r={n.r} fill={stroke} opacity={0.9} />
        ))}
      </g>
    </svg>
  );
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function Members() {
  const [showAlumni, setShowAlumni] = useState(false);
  const total = groups.reduce((n, g) => n + g.people.length, 0) + 1;
  const alumniAll = [...alumni.graduate, ...alumni.undergraduate, ...alumni.associates];

  return (
    <section id="members" className="relative py-28 md:py-40">
      <div className="shell">
        <SectionHead
          eyebrow="Members"
          title={<>Who does the work.</>}
          count={`${total} current · ${alumniAll.length} alumni`}
        />

        {/* ---------------- principal investigator ---------------- */}
        <Reveal delay={0.05} className="mt-16">
          <article className="pane spec relative overflow-hidden rounded-3xl p-8 md:p-12">
            <div className="grid gap-9 md:grid-cols-[auto_1fr] md:items-start md:gap-12">
              <div className="group border-line/80 bg-ink/60 relative grid h-28 w-28 place-items-center rounded-2xl border">
                <GlyphMark name={faculty.name} size={78} />
                <span className="text-faint absolute right-2 bottom-2 font-mono text-[9px] tracking-[0.14em]">
                  {initials(faculty.name)}
                </span>
              </div>

              <div>
                <span className="text-cyan font-mono text-[10px] tracking-[0.22em] uppercase">
                  {faculty.role}
                </span>
                <h3 className="mt-4 text-[clamp(1.7rem,3.4vw,2.5rem)] leading-tight font-medium">
                  {faculty.name}
                </h3>
                <p className="text-mute mt-3 max-w-lg text-[15px] leading-[1.65]">
                  {faculty.affiliation}
                </p>

                <ul className="mt-7 flex flex-wrap gap-2">
                  {faculty.interests.map((t) => (
                    <li
                      key={t}
                      className="border-line text-mute rounded-full border px-3 py-1.5 text-[12px]"
                    >
                      {t}
                    </li>
                  ))}
                </ul>

                <div className="border-line/70 mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 border-t pt-6 font-mono text-[12px]">
                  <a
                    href={`mailto:${faculty.email}`}
                    className="text-mute hover:text-cyan transition-colors duration-400"
                  >
                    {faculty.email}
                  </a>
                  <span className="text-faint">{faculty.office}</span>
                  <span className="text-faint">{faculty.note}</span>
                </div>
              </div>
            </div>
          </article>
        </Reveal>

        {/* ---------------- the group ---------------- */}
        <div className="mt-14 space-y-12">
          {groups.map((group, gi) => (
            <div key={group.label}>
              <Reveal className="border-line/70 flex items-baseline justify-between gap-4 border-b pb-4">
                <h3 className="text-paper text-[1.05rem] font-medium">{group.label}</h3>
                <span className="text-faint font-mono text-[11px]">
                  {group.note} · {String(group.people.length).padStart(2, "0")}
                </span>
              </Reveal>

              {/* Three across at most: a fourth column narrows the card
                  past the width an institutional email needs. */}
              <ul className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {group.people.map((person, i) => (
                  <Reveal
                    as="li"
                    key={person.name}
                    delay={Math.min(i, 6) * 0.05 + gi * 0.02}
                    className="group"
                  >
                    <div className="pane pane-lift flex h-full items-center gap-4 rounded-xl p-4">
                      <div className="border-line/70 bg-ink/50 grid h-12 w-12 shrink-0 place-items-center rounded-lg border">
                        <GlyphMark name={person.name} size={34} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-paper truncate text-[14px]">{person.name}</p>
                        {person.email && (
                          <a
                            href={`mailto:${person.email}`}
                            className="text-faint hover:text-cyan block truncate font-mono text-[11px] transition-colors duration-400"
                          >
                            {person.email}
                          </a>
                        )}
                      </div>
                    </div>
                  </Reveal>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ---------------- alumni ---------------- */}
        <Reveal delay={0.08} className="border-line/70 mt-16 border-t pt-8">
          <button
            type="button"
            onClick={() => setShowAlumni((v) => !v)}
            aria-expanded={showAlumni}
            className="group flex w-full items-center justify-between gap-6 text-left"
          >
            <span>
              <span className="text-paper text-[1.05rem] font-medium">Alumni</span>
              <span className="text-faint ml-3 font-mono text-[11px]">
                {alumniAll.length} people have passed through
              </span>
            </span>
            <span className="border-line text-mute group-hover:border-cyan/50 group-hover:text-cyan grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-colors duration-500">
              <span
                className={`text-[15px] leading-none transition-transform duration-500 ${
                  showAlumni ? "rotate-45" : ""
                }`}
              >
                +
              </span>
            </span>
          </button>

          {showAlumni && (
            <ul className="mt-7 flex flex-wrap gap-x-2 gap-y-2">
              {alumniAll.map((name) => (
                <li
                  key={name}
                  className="border-line/70 text-mute hover:border-beam/40 hover:text-paper rounded-full border px-3.5 py-1.5 text-[12.5px] transition-colors duration-400"
                >
                  {name}
                </li>
              ))}
            </ul>
          )}
        </Reveal>
      </div>
    </section>
  );
}
