"use client";

import { useEffect, useState } from "react";
import { ScrollTrigger } from "@/components/motion/gsap";
import { lenisRef } from "@/components/motion/lenis";
import { cn } from "@/lib/utils";

/** Sticky table of contents for the price list; highlights the category in view. */
export function CategoryIndex({ items }: { items: { slug: string; name: string; count: number }[] }) {
  const [active, setActive] = useState(items[0]?.slug);

  useEffect(() => {
    const triggers = items.map((it) =>
      ScrollTrigger.create({
        trigger: `#${it.slug}`,
        start: "top 45%",
        end: "bottom 45%",
        onToggle: (self) => self.isActive && setActive(it.slug),
      }),
    );
    return () => triggers.forEach((t) => t.kill());
  }, [items]);

  const go = (slug: string) => {
    const el = document.getElementById(slug);
    if (!el) return;
    if (lenisRef.current) lenisRef.current.scrollTo(el, { offset: -100, duration: 1.4 });
    else el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav aria-label="Categorii" className="no-scrollbar -mx-[var(--gutter)] flex gap-2 overflow-x-auto px-gutter lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:px-0">
      {items.map((it, i) => (
        <button
          key={it.slug}
          type="button"
          onClick={() => go(it.slug)}
          className={cn(
            "group flex shrink-0 items-baseline gap-3 border px-4 py-2 text-left transition-colors lg:border-0 lg:border-b lg:border-[var(--line)] lg:px-0 lg:py-4",
            active === it.slug ? "border-ink bg-ink text-bone lg:bg-transparent lg:text-oxblood" : "border-[var(--line-strong)] text-ink",
          )}
        >
          <span className="label opacity-60">{["I", "II", "III", "IV", "V", "VI"][i]}.</span>
          <span className="display-wide text-lg lg:text-[1.65rem]">{it.name}</span>
          <span className="label ml-auto hidden opacity-50 lg:inline">{it.count}</span>
        </button>
      ))}
    </nav>
  );
}
