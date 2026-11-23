"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, Play, X } from "@phosphor-icons/react";
import { gsap, Flip, ScrollTrigger, useGSAP, MOTION_OK } from "@/components/motion/gsap";
import { lenisRef } from "@/components/motion/lenis";
import { InViewVideo } from "@/components/motion/video";
import { cn } from "@/lib/utils";

export type GalleryItem = {
  id: number;
  tag: "cut" | "color" | "styling" | "men" | "editorial";
  kind: "photo" | "video";
  src: string;
  poster: string | null;
  width: number;
  height: number;
  title: string;
  caption: string;
  credit: string;
};

const FILTERS = ["all", "cut", "color", "styling", "men", "editorial"] as const;
type Filter = (typeof FILTERS)[number];

export function Gallery({ items }: { items: GalleryItem[] }) {
  const t = useTranslations("work");
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<number | null>(null);
  const grid = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  const visible = items.filter((i) => filter === "all" || i.tag === filter);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        ScrollTrigger.batch("[data-card]", {
          start: "top 92%",
          once: true,
          onEnter: (batch) =>
            gsap.fromTo(batch, { y: 60, autoAlpha: 0, clipPath: "inset(12% 0% 0% 0%)" }, { y: 0, autoAlpha: 1, clipPath: "inset(0% 0% 0% 0%)", stagger: 0.08, duration: 1.2 }),
        });
      });
    },
    { scope: grid },
  );

  // Re-flow the masonry with FLIP so cards glide to their new columns instead of jumping.
  useGSAP(
    () => {
      if (!flipState.current) return;
      Flip.from(flipState.current, {
        duration: 0.9,
        ease: "ink",
        absolute: true,
        stagger: 0.03,
        onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.9 }, { autoAlpha: 1, scale: 1, duration: 0.8, clipPath: "inset(0% 0% 0% 0%)" }),
        onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.9, duration: 0.5 }),
        onComplete: () => ScrollTrigger.refresh(),
      });
      flipState.current = null;
    },
    { dependencies: [filter], scope: grid },
  );

  const choose = (f: Filter) => {
    if (f === filter) return;
    flipState.current = Flip.getState(grid.current!.querySelectorAll("[data-card]"));
    setFilter(f);
  };

  const counts = Object.fromEntries(FILTERS.map((f) => [f, f === "all" ? items.length : items.filter((i) => i.tag === f).length]));

  return (
    <>
      <div className="-mx-[var(--gutter)] mb-10 border-y border-[var(--line)] px-gutter py-4">
        <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
          {FILTERS.filter((f) => counts[f] > 0).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => choose(f)}
              aria-pressed={filter === f}
              className={cn(
                "label flex shrink-0 items-center gap-2 border px-4 py-2.5 transition-colors duration-300",
                filter === f ? "border-ink bg-ink text-bone" : "border-[var(--line-strong)] hover:border-ink",
              )}
            >
              {t(f)} <span className="opacity-50">{counts[f]}</span>
            </button>
          ))}
        </div>
      </div>

      <div ref={grid} className="columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-10">
        {visible.map((item, i) => (
          <button
            key={item.id}
            type="button"
            data-card
            data-flip-id={item.id}
            onClick={() => setOpen(items.indexOf(item))}
            className="group block w-full break-inside-avoid text-left"
            aria-label={`${t("open")}: ${item.title}`}
          >
            <div className="relative overflow-hidden bg-ink" style={{ aspectRatio: `${item.width} / ${item.height}` }}>
              {item.kind === "video" ? (
                <InViewVideo src={item.src} poster={item.poster} label={item.title} className="transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]" />
              ) : (
                <Image
                  src={item.src}
                  alt={item.title}
                  width={item.width}
                  height={item.height}
                  sizes="(min-width: 1024px) 31vw, (min-width: 640px) 47vw, 92vw"
                  className="h-full w-full object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.04]"
                  priority={i < 3}
                />
              )}
              {item.kind === "video" && (
                <span className="label absolute right-3 top-3 flex items-center gap-1.5 bg-bone/90 px-2 py-1 text-ink">
                  <Play weight="fill" className="size-2.5" /> {t("video")}
                </span>
              )}
              <span className="absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/10" />
            </div>
            <div className="mt-3 flex items-baseline justify-between gap-4">
              <h3 className="display-wide text-[1.45rem] italic leading-tight transition-colors group-hover:text-oxblood">{item.title}</h3>
              <span className="label shrink-0 text-muted">{t(item.tag)}</span>
            </div>
            {item.caption && <p className="mt-1 text-sm text-muted">{item.caption}</p>}
          </button>
        ))}
      </div>
      {visible.length === 0 && <p className="py-20 text-center text-muted">{t("empty")}</p>}

      {open !== null && <Lightbox items={items} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </>
  );
}

function Lightbox({ items, index, onIndex, onClose }: { items: GalleryItem[]; index: number; onIndex: (i: number) => void; onClose: () => void }) {
  const t = useTranslations("work");
  const root = useRef<HTMLDivElement>(null);
  const item = items[index];

  const close = useCallback(() => {
    gsap.to(root.current, { autoAlpha: 0, duration: 0.4, onComplete: onClose });
  }, [onClose]);
  const step = useCallback((d: number) => onIndex((index + d + items.length) % items.length), [index, items.length, onIndex]);

  useEffect(() => {
    lenisRef.current?.stop();
    gsap.fromTo(root.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45 });
    return () => lenisRef.current?.start();
  }, []);

  useEffect(() => {
    gsap.fromTo("[data-lb-media]", { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "ink" });
    gsap.fromTo("[data-lb-text] > *", { y: 20, autoAlpha: 0 }, { y: 0, autoAlpha: 1, stagger: 0.06, duration: 0.7, delay: 0.2 });
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close, step]);

  return (
    <div ref={root} role="dialog" aria-modal="true" aria-label={item.title} className="invisible fixed inset-0 z-[65] flex flex-col bg-ink text-bone" data-lenis-prevent>
      <div className="flex h-[var(--header-h)] items-center justify-between px-gutter">
        <span className="label text-muted-2">
          {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </span>
        <button type="button" onClick={close} className="label flex items-center gap-2 py-2" autoFocus>
          {t("close")} <X weight="light" className="size-4" />
        </button>
      </div>
      <div className="grid min-h-0 flex-1 gap-6 px-gutter pb-6 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12">
        <div data-lb-media className="relative min-h-0 overflow-hidden">
          {item.kind === "video" ? (
            <video key={item.src} src={item.src} poster={item.poster ?? undefined} className="h-full w-full object-contain" autoPlay muted loop playsInline controls />
          ) : (
            <Image key={item.src} src={item.src} alt={item.title} fill sizes="(min-width: 1024px) 70vw, 100vw" className="object-contain" />
          )}
        </div>
        <div data-lb-text className="flex flex-col justify-end gap-3 lg:pb-6">
          <span className="label text-honey">{t(item.tag)}</span>
          <h2 className="display text-[clamp(2.8rem,5vw,4.6rem)] italic">{item.title}</h2>
          {item.caption && <p className="text-bone/70">{item.caption}</p>}
          {item.credit && (
            <p className="text-sm text-bone/50">
              <span className="label mr-2 text-muted-2">{t("credit")}</span>
              {item.credit}
            </p>
          )}
          <div className="mt-6 flex gap-2">
            <button type="button" onClick={() => step(-1)} aria-label={t("prev")} className="grid size-12 place-items-center border border-[var(--line-inv)] transition-colors hover:bg-bone hover:text-ink">
              <ArrowLeft weight="light" />
            </button>
            <button type="button" onClick={() => step(1)} aria-label={t("next")} className="grid size-12 place-items-center border border-[var(--line-inv)] transition-colors hover:bg-bone hover:text-ink">
              <ArrowRight weight="light" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
