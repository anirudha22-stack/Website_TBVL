import { startups } from "@/lib/tbvl";
import { Reveal, SectionHead } from "@/components/ui/Reveal";

/**
 * Research that left the building. Three entries only, so they are set
 * as a numbered ledger rather than a card grid — at this count a grid
 * just looks like it is waiting for a fourth.
 */
export function Startups() {
  return (
    <section id="startups" className="relative py-28 md:py-40">
      <div className="shell">
        <SectionHead
          eyebrow="Startups"
          title={<>Work that left the lab.</>}
          lead="Incubation and translation, where a result stops being a paper and starts being something someone has to support."
          count={`${startups.length} ventures`}
        />

        <ul className="border-line/70 mt-16 border-t">
          {startups.map((s, i) => (
            <Reveal as="li" key={s.name} delay={i * 0.08}>
              <article className="group border-line/70 hover:bg-beam/[0.035] relative grid gap-5 border-b py-9 transition-colors duration-500 md:grid-cols-[3rem_1fr_auto] md:items-start md:gap-10 md:py-11">
                <span className="text-faint font-mono text-[11px]">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div>
                  <h3 className="group-hover:text-cyan text-[clamp(1.35rem,3vw,2rem)] leading-tight font-medium transition-colors duration-400">
                    {s.name}
                  </h3>
                  <p className="text-mute mt-4 max-w-xl text-[15px] leading-[1.7]">{s.body}</p>
                  <p className="text-faint mt-4 font-mono text-[11.5px]">{s.people}</p>
                </div>

                <div className="flex flex-col items-start gap-2.5 md:items-end">
                  <span className="border-cyan/40 text-cyan rounded-full border px-3 py-1 font-mono text-[10px] tracking-[0.14em] uppercase">
                    {s.status}
                  </span>
                  <span className="text-faint font-mono text-[11px]">{s.support}</span>
                </div>
              </article>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
