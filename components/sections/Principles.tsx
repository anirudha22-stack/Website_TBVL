import { funding, lab } from "@/lib/tbvl";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The four properties the lab says its work is grounded in, set as a
 * manifesto rather than a feature grid. Each one gets an index because
 * the lab itself numbers them — that ordering is the content, not a
 * decorative device.
 */
export function Principles() {
  return (
    <section id="about" className="relative py-28 md:py-40">
      <div className="shell">
        <Reveal className="max-w-3xl">
          <span className="eyebrow">The premise</span>
          <p className="text-paper mt-8 text-[clamp(1.4rem,3vw,2.15rem)] leading-[1.35] font-medium">
            {lab.intro}
          </p>
          <p className="text-mute mt-7 max-w-xl text-[16px] leading-[1.75]">{lab.mission}</p>
        </Reveal>

        <ul className="border-line/70 bg-line/60 mt-20 grid gap-px overflow-hidden rounded-2xl border sm:grid-cols-2 lg:grid-cols-4">
          {lab.principles.map((p, i) => (
            <Reveal
              as="li"
              key={p.key}
              delay={i * 0.08}
              className="group bg-carbon/70 relative p-7 backdrop-blur-sm lg:p-8"
            >
              <span
                aria-hidden="true"
                className="from-cyan absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gradient-to-r to-transparent transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
              />
              <span className="text-faint font-mono text-[10px] tracking-[0.2em]">
                0{i + 1}
              </span>
              <h3 className="mt-5 text-[1.5rem] font-medium">{p.key}</h3>
              <p className="text-mute mt-3.5 text-[14px] leading-[1.7]">{p.body}</p>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.1} className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-4">
          <span className="text-faint font-mono text-[10px] tracking-[0.24em] uppercase">
            Supported by
          </span>
          {funding.map((f) => (
            <div key={f.short} className="flex items-baseline gap-3">
              <span className="text-paper font-mono text-[15px] tracking-[0.08em]">
                {f.short}
              </span>
              <span className="text-faint max-w-[15rem] text-[12px] leading-snug">
                {f.award}
              </span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
