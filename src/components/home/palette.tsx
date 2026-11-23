"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { gsap, useGSAP, MOTION_OK } from "@/components/motion/gsap";
import { BrushSwash, InkArrow } from "@/components/ink/strokes";
import { SplitReveal } from "@/components/motion/split-reveal";
import { cn } from "@/lib/utils";

export type Swatch = { id: number; name: string; note: string; color: string; photo: string; width: number; height: number };

/** Relative luminance of a #rrggbb colour, so the label on the colour badge stays readable. */
function isLight(hex: string) {
  const n = parseInt(hex.replace("#", "").padEnd(6, "0").slice(0, 6), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.4;
}

/** Hair colours painted as brush strokes; choosing one swaps the portrait beside it. Edited in Admin → Paletă. */
export function Palette({ swatches }: { swatches: Swatch[] }) {
  const th = useTranslations("home");
  const [active, setActive] = useState(0);
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from("[data-swatch-paint]", {
          clipPath: "inset(0% 100% 0% 0%)",
          duration: 1.3,
          stagger: 0.09,
          ease: "ink",
          scrollTrigger: { trigger: "[data-swatches]", start: "top 80%", once: true },
        });
      });
    },
    { scope: root },
  );

  if (!swatches.length) return null;

  const choose = (i: number) => {
    if (i === active) return;
    setActive(i);
    if (!window.matchMedia(MOTION_OK).matches) return;
    gsap.fromTo(
      root.current!.querySelector(`[data-photo="${i}"]`),
      { clipPath: "inset(0% 0% 100% 0%)", scale: 1.12 },
      { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: 1.1, ease: "ink" },
    );
  };

  const current = swatches[Math.min(active, swatches.length - 1)];
  const total = String(swatches.length).padStart(2, "0");

  return (
    <section ref={root} className="relative overflow-hidden bg-bone-2 px-gutter py-24 sm:py-36">
      <div className="mx-auto grid max-w-[88rem] items-center gap-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div className="min-w-0">
          <p className="label text-muted">{th("paletteLabel")}</p>
          <SplitReveal as="h2" className="display mt-5 max-w-3xl text-[clamp(3.4rem,7vw,7.2rem)]">
            {th("paletteTitle")}
          </SplitReveal>
          <p className="hand mt-4 flex items-center gap-2 text-2xl text-oxblood-2">
            {th("paletteHint")}
            <InkArrow className="h-10 w-14 rotate-[25deg]" />
          </p>

          <ul data-swatches className="mt-8 grid gap-1 sm:grid-cols-2 sm:gap-x-8" role="listbox" aria-label={th("paletteTitle")}>
            {swatches.map((s, i) => (
              <li key={s.id} className="min-w-0">
                <button
                  type="button"
                  role="option"
                  aria-selected={i === active}
                  onMouseEnter={() => choose(i)}
                  onFocus={() => choose(i)}
                  onClick={() => choose(i)}
                  className="group flex w-full items-center gap-4 py-2 text-left"
                >
                  <span data-swatch-paint className="relative block h-12 w-28 shrink-0 drop-shadow-[0_0_0.6px_rgba(21,17,14,0.55)] sm:w-36" style={{ color: s.color }}>
                    <BrushSwash className={cn("h-full w-full transition-transform duration-700 ease-[var(--ease-out-expo)]", i === active ? "scale-x-110" : "group-hover:scale-x-105")} />
                  </span>
                  <span className="min-w-0">
                    <span className={cn("display-wide block text-[1.45rem] leading-tight transition-colors", i === active ? "text-oxblood italic" : "")}>{s.name}</span>
                    {s.note && <span className="block text-sm text-muted">{s.note}</span>}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div className="relative aspect-[4/5] overflow-hidden bg-ink">
            {swatches.map((s, i) => (
              <div key={s.id} data-photo={i} className={cn("absolute inset-0 transition-opacity duration-300", i === active ? "z-10 opacity-100 delay-0" : "z-0 opacity-0 delay-1000")}>
                <Image src={s.photo} alt={s.name} width={s.width} height={s.height} sizes="(min-width: 1024px) 28rem, 90vw" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
          <div className="absolute -bottom-6 -left-2 z-20 flex size-28 items-center justify-center rounded-full text-center sm:-left-10 sm:size-32" style={{ background: current.color }}>
            <span className={cn("label px-3 text-[0.55rem]", isLight(current.color) ? "text-ink" : "text-bone")}>{current.name}</span>
          </div>
          <p className="label absolute -right-2 top-4 origin-top-right rotate-90 text-muted">
            № {String(active + 1).padStart(2, "0")} / {total}
          </p>
        </div>
      </div>
    </section>
  );
}
