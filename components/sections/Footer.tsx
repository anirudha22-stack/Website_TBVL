"use client";

import { contact, lab, navLeft, navRight } from "@/lib/tbvl";
import { scrollToId } from "@/lib/smooth";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Contact and colophon. The lab recruits, so the invitation is the
 * loudest thing here rather than the address.
 */
export function Footer() {
  return (
    <footer id="contact" className="border-line/70 bg-carbon/40 relative border-t">
      <div className="shell py-24 md:py-32">
        <Reveal className="max-w-3xl">
          <span className="eyebrow">Contact</span>
          <h2 className="mt-8 text-[clamp(2rem,5vw,3.4rem)] font-medium">
            If you work on the parts
            <br />
            that break, come and find us.
          </h2>
          <p className="text-mute mt-6 max-w-lg text-[16px] leading-[1.7]">
            We take students, interns and collaborators across all eight areas. Write to the lab
            with what you have built and what you want to break next.
          </p>
          <a
            href={`mailto:${contact.email}`}
            className="group bg-paper text-ink mt-9 inline-flex items-center gap-4 rounded-full px-7 py-3.5 text-[14px] font-medium transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5"
          >
            {contact.email}
            <span className="transition-transform duration-500 group-hover:translate-x-1">
              →
            </span>
          </a>
        </Reveal>

        <div className="border-line/70 mt-20 grid gap-12 border-t pt-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-faint font-mono text-[10px] tracking-[0.2em] uppercase">
              Where
            </h3>
            <p className="text-mute mt-4 text-[14px] leading-[1.7]">
              {contact.lab}
              <br />
              {contact.address}
            </p>
          </div>

          <div>
            <h3 className="text-faint font-mono text-[10px] tracking-[0.2em] uppercase">
              Call
            </h3>
            <p className="text-mute mt-4 font-mono text-[13px] leading-[1.8]">
              Office {contact.office}
              <br />
              Lab {contact.labPhone}
            </p>
          </div>

          <div>
            <h3 className="text-faint font-mono text-[10px] tracking-[0.2em] uppercase">
              Sections
            </h3>
            <ul className="mt-4 space-y-2">
              {[...navLeft, ...navRight].map((n) => (
                <li key={n.id}>
                  <a
                    href={`#${n.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToId(n.id);
                    }}
                    className="text-mute hover:text-paper text-[14px] transition-colors duration-400"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-faint font-mono text-[10px] tracking-[0.2em] uppercase">
              Elsewhere
            </h3>
            <ul className="mt-4 space-y-2">
              {contact.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-mute hover:text-paper text-[14px] transition-colors duration-400"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-line/70 mt-16 flex flex-col gap-3 border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-faint font-mono text-[11px]">
            © {new Date().getFullYear()} {lab.name} · {lab.institution}
          </p>
          <p className="text-faint font-mono text-[11px]">
            The face above is a landmark graph, not a photograph.
          </p>
        </div>
      </div>
    </footer>
  );
}
