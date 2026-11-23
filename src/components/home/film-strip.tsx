"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/components/motion/gsap";
import { InViewVideo } from "@/components/motion/video";

export type FilmFrame = { id: number; src: string; poster: string | null; title: string; caption: string; ratio: string };

const SPROCKETS =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='26' height='14'><rect x='6' y='3' width='14' height='9' rx='2' fill='%23ece5d8' fill-opacity='.82'/></svg>\")";

/** Reels laid out as a strip of 35mm film that slides sideways while the section is pinned. */
export function FilmStrip({ frames, label, title, lead }: { frames: FilmFrame[]; label: string; title: string; lead: string }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
        const track = root.current!.querySelector<HTMLElement>("[data-track]")!;
        const distance = () => track.scrollWidth - window.innerWidth;
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current!.querySelector("[data-pin]"),
            start: "center center",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
        // Each frame's picture drifts against the strip, like a projector gate.
        gsap.utils.toArray<HTMLElement>("[data-gate]").forEach((gate) => {
          gsap.fromTo(
            gate,
            { xPercent: -8 },
            { xPercent: 8, ease: "none", scrollTrigger: { trigger: gate, containerAnimation: tween, start: "left right", end: "right left", scrub: true } },
          );
        });
        return () => ScrollTrigger.getAll().forEach((st) => st.vars.containerAnimation === tween && st.kill());
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} data-header="dark" className="relative overflow-hidden bg-ink py-24 text-bone sm:py-32">
      <div className="px-gutter">
        <p className="label text-muted-2">{label}</p>
        <div className="mt-5 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h2 className="display text-[clamp(3.6rem,8vw,8rem)] italic">{title}</h2>
          <p className="max-w-xs text-bone/60">{lead}</p>
        </div>
      </div>

      <div data-pin className="mt-14 flex items-center md:h-[min(86svh,52rem)]">
        <div data-track className="no-scrollbar flex w-full snap-x snap-mandatory gap-0 overflow-x-auto px-gutter md:w-max md:overflow-visible">
          <div className="flex bg-[#0b0908] pb-8 pt-6" style={{ backgroundImage: `${SPROCKETS}, ${SPROCKETS}`, backgroundRepeat: "repeat-x, repeat-x", backgroundPosition: "0 6px, 0 calc(100% - 6px)" }}>
            {frames.map((f, i) => (
              <figure key={f.id} className="relative shrink-0 snap-start px-3 md:px-4">
                <span className="label mb-2 block text-[0.55rem] text-honey/80" aria-hidden>
                  SW 400 ▸ {String(i + 1).padStart(2, "0")}A
                </span>
                <div className="relative h-[50svh] max-w-[84vw] overflow-hidden bg-ink-2 md:h-[min(58svh,34rem)] md:max-w-none" style={{ aspectRatio: f.ratio }}>
                  <div data-gate className="absolute inset-y-0 -left-[10%] -right-[10%]">
                    <InViewVideo src={f.src} poster={f.poster} label={f.title} />
                  </div>
                </div>
                <figcaption className="mt-3 max-w-[min(100%,22rem)]">
                  <p className="display-wide text-[1.3rem] italic leading-tight">{f.title}</p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-bone/50">{f.caption}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
