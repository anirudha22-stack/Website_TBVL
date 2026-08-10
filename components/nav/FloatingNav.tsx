"use client";

import { useEffect, useRef, useState } from "react";
import { navLeft, navRight } from "@/lib/tbvl";
import { scrollToId } from "@/lib/smooth";

/**
 * Navigation as two floating rails rather than a bar across the top.
 *
 * Each item is magnetic: within range, it leans toward the cursor and
 * releases when the pointer leaves. The offset is written straight to
 * the element's transform, never to React state, so tracking the mouse
 * costs no renders.
 *
 * Below the large breakpoint the rails would sit on top of the content,
 * so they collapse into a single floating bar at the bottom of the
 * viewport with the labels dropped.
 */

const ICONS: Record<string, React.ReactNode> = {
  // A three-node graph — the lab's own primitive.
  research: (
    <>
      <circle cx="10" cy="4.6" r="1.7" />
      <circle cx="4.6" cy="14.4" r="1.7" />
      <circle cx="15.4" cy="14.4" r="1.7" />
      <path d="M8.9 6.2 5.7 12.8M11.1 6.2l3.2 6.6M6.3 14.4h7.4" />
    </>
  ),
  // Stacked sheets.
  publications: (
    <>
      <path d="M6 3.4h8.2a1.4 1.4 0 0 1 1.4 1.4v11.8H6a1.4 1.4 0 0 1-1.4-1.4V4.8A1.4 1.4 0 0 1 6 3.4Z" />
      <path d="M7.6 7.2h6.2M7.6 10h6.2M7.6 12.8h3.8" />
    </>
  ),
  // A vector leaving a bracket.
  startups: (
    <>
      <path d="M4 12.2V16h11.8" />
      <path d="M6.6 12.4 10 8.4l2.6 2.4 3.4-4.6" />
      <path d="M12.6 6.2h3.4v3.4" />
    </>
  ),
  // A small constellation of people.
  members: (
    <>
      <circle cx="10" cy="6.4" r="2.4" />
      <circle cx="4.8" cy="12.6" r="1.8" />
      <circle cx="15.2" cy="12.6" r="1.8" />
      <path d="M6.4 15.8a4 4 0 0 1 7.2 0" />
    </>
  ),
  // A signal trace.
  news: (
    <>
      <path d="M3 10.4h3l2-4.6 3.2 9.2 2-4.6h3.8" />
    </>
  ),
  // A faceted marker.
  achievements: (
    <>
      <path d="M10 3.2 16 7v6l-6 3.8L4 13V7Z" />
      <path d="M10 7.4 12.6 9v3l-2.6 1.6L7.4 12V9Z" />
    </>
  ),
};

const ALL = [...navLeft, ...navRight];

function Icon({ id }: { id: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-[18px] w-[18px] shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[id]}
    </svg>
  );
}

function Rail({
  items,
  side,
  active,
}: {
  items: { id: string; label: string }[];
  side: "left" | "right";
  active: string;
}) {
  const ref = useRef<HTMLElement>(null);

  /** Magnetic lean, applied directly to each link's transform. */
  useEffect(() => {
    const rail = ref.current;
    if (!rail) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const links = Array.from(rail.querySelectorAll<HTMLElement>("a"));
    const RANGE = 130;

    const onMove = (e: PointerEvent) => {
      for (const link of links) {
        const r = link.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        const dist = Math.hypot(dx, dy);
        if (dist > RANGE) {
          link.style.transform = "";
          link.style.setProperty("--pull", "0");
          continue;
        }
        const pull = 1 - dist / RANGE;
        link.style.transform = `translate(${dx * pull * 0.28}px, ${dy * pull * 0.22}px)`;
        link.style.setProperty("--pull", pull.toFixed(3));
      }
    };
    const onLeave = () => {
      for (const link of links) {
        link.style.transform = "";
        link.style.setProperty("--pull", "0");
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <nav
      ref={ref}
      aria-label={side === "left" ? "Research navigation" : "Lab navigation"}
      className={`fixed top-1/2 z-40 hidden -translate-y-1/2 lg:block ${
        side === "left" ? "left-5 xl:left-8" : "right-5 xl:right-8"
      }`}
    >
      <ul className={`flex flex-col gap-1.5 ${side === "right" ? "items-end" : "items-start"}`}>
        {items.map((item) => {
          const on = active === item.id;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  scrollToId(item.id);
                }}
                aria-current={on ? "true" : undefined}
                className={`group relative flex items-center gap-3 rounded-full px-3.5 py-2.5 transition-[color,background-color,box-shadow] duration-500 ${
                  side === "right" ? "flex-row-reverse" : ""
                } ${
                  on
                    ? "bg-beam/10 text-paper shadow-[0_0_30px_-10px_rgb(76_141_255/0.7)]"
                    : "text-mute hover:text-paper"
                }`}
                style={{ transition: "transform .45s cubic-bezier(0.22,1,0.36,1)" }}
              >
                {/* The halo strengthens with the magnetic pull. */}
                <span
                  aria-hidden="true"
                  className="border-beam/0 group-hover:border-beam/30 pointer-events-none absolute inset-0 rounded-full border transition-colors duration-500"
                  style={{ opacity: "calc(0.35 + var(--pull, 0) * 0.65)" }}
                />
                <span
                  className={`relative grid h-7 w-7 place-items-center rounded-full transition-colors duration-500 ${
                    on ? "text-cyan" : "text-mute group-hover:text-cyan"
                  }`}
                >
                  <Icon id={item.id} />
                </span>
                <span className="relative text-[13px] whitespace-nowrap">
                  {item.label}
                  {/* Underline grows from the side the rail is anchored to. */}
                  <span
                    aria-hidden="true"
                    className={`bg-cyan absolute -bottom-0.5 h-px w-full origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 ${
                      side === "right" ? "origin-right" : "origin-left"
                    } ${on ? "scale-x-100" : ""} left-0`}
                  />
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function FloatingNav() {
  const [active, setActive] = useState("");

  /** Tracks which section owns the middle of the viewport. */
  useEffect(() => {
    const sections = ALL.map((i) => document.getElementById(i.id)).filter(
      (el): el is HTMLElement => !!el,
    );
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.2, 0.6] },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <Rail items={navLeft} side="left" active={active} />
      <Rail items={navRight} side="right" active={active} />

      {/* Compact bar for anything narrower than the rails can clear. */}
      <nav
        aria-label="Sections"
        className="pane fixed bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-full px-2 py-1.5 lg:hidden"
      >
        {ALL.map((item) => {
          const on = active === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToId(item.id);
              }}
              aria-label={item.label}
              aria-current={on ? "true" : undefined}
              className={`grid h-10 w-10 place-items-center rounded-full transition-colors duration-400 ${
                on ? "bg-beam/15 text-cyan" : "text-mute"
              }`}
            >
              <Icon id={item.id} />
            </a>
          );
        })}
      </nav>
    </>
  );
}
