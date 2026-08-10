"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";

/**
 * Scroll reveal, driven by an IntersectionObserver toggling a CSS
 * transition rather than a JS ticker.
 *
 * The resting state in the stylesheet is *visible*. The hidden state is
 * only ever applied by script that has already confirmed it can animate,
 * so if anything upstream fails — no JS, a throttled tab, a browser that
 * pauses timers — the page degrades to readable, never to blank.
 */
export function useReveal<T extends HTMLElement>(rootMargin = "-8% 0px -8% 0px") {
  const ref = useRef<T>(null);
  const [state, setState] = useState<"idle" | "hidden" | "shown">("idle");

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setState("hidden");
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || state !== "hidden") return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setState("shown");
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [state, rootMargin]);

  return { ref, state: state === "idle" ? undefined : state };
}

export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article";
}) {
  const { ref, state } = useReveal<HTMLElement>();
  return (
    <Tag
      // Tag is a union of intrinsic elements, so the ref has to be
      // narrowed here rather than inferred.
      ref={ref as React.RefObject<never>}
      className={className}
      data-reveal={state}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </Tag>
  );
}

/** Section heading block, used by every section so the rhythm is shared. */
export function SectionHead({
  eyebrow,
  title,
  lead,
  count,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  count?: string;
}) {
  return (
    <Reveal className="max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <span className="eyebrow">{eyebrow}</span>
        {count && <span className="text-faint font-mono text-[11px]">{count}</span>}
      </div>
      <h2 className="mt-7 text-[clamp(2.1rem,5vw,3.6rem)] font-medium">{title}</h2>
      {lead && <p className="text-mute mt-6 max-w-xl text-[17px] leading-[1.7]">{lead}</p>}
    </Reveal>
  );
}
