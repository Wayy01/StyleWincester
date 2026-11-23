"use client";

import { useRef, useState } from "react";
import { Plus } from "@phosphor-icons/react";
import { gsap, ScrollTrigger } from "@/components/motion/gsap";
import { cn } from "@/lib/utils";

export function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const refs = useRef<(HTMLDivElement | null)[]>([]);

  const toggle = (i: number) => {
    const next = open === i ? null : i;
    refs.current.forEach((el, k) => {
      if (!el) return;
      gsap.to(el, {
        height: k === next ? "auto" : 0,
        duration: 0.6,
        ease: "ink",
        onComplete: () => ScrollTrigger.refresh(),
      });
    });
    setOpen(next);
  };

  return (
    <div className="divide-y divide-[var(--line-strong)] border-y border-[var(--line-strong)]">
      {items.map((item, i) => (
        <div key={i}>
          <h3>
            <button
              type="button"
              onClick={() => toggle(i)}
              aria-expanded={open === i}
              aria-controls={`faq-${i}`}
              className="group flex w-full items-center justify-between gap-6 py-6 text-left"
            >
              <span className="display-wide text-[clamp(1.4rem,2.4vw,2rem)] transition-colors group-hover:text-oxblood">{item.q}</span>
              <Plus weight="light" className={cn("size-6 shrink-0 transition-transform duration-500", open === i && "rotate-45")} />
            </button>
          </h3>
          <div
            id={`faq-${i}`}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className="overflow-hidden"
            style={{ height: i === 0 ? "auto" : 0 }}
          >
            <p className="max-w-2xl pb-7 text-[1.02rem] leading-relaxed text-ink-3">{item.a}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
