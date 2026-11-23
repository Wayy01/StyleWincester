"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { gsap, useGSAP, MOTION_OK } from "@/components/motion/gsap";
import { lenisRef } from "@/components/motion/lenis";
import { markIntroDone } from "@/components/motion/intro";
import { InkSplat } from "@/components/ink/splat";
import { Wordmark } from "./wordmark";

/** Runs the hand-off from bone paper to the inked hero once per tab session. */
export const INTRO_SCRIPT = `try{if(sessionStorage.getItem("sw-intro"))document.documentElement.classList.add("intro-seen")}catch(e){}`;

export function Preloader() {
  const t = useTranslations("intro");
  const tc = useTranslations("common");
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const html = document.documentElement;
      if (html.classList.contains("intro-seen") || !window.matchMedia(MOTION_OK).matches) {
        gsap.set(root.current, { display: "none" });
        markIntroDone();
        return;
      }
      lenisRef.current?.stop();
      const counter = { v: 0 };
      const num = root.current!.querySelector<HTMLElement>("[data-count]")!;
      const tl = gsap.timeline({
        onComplete: () => {
          try {
            sessionStorage.setItem("sw-intro", "1");
          } catch {}
          lenisRef.current?.start();
          gsap.set(root.current, { display: "none" });
        },
      });
      tl.from("[data-wm]", { yPercent: 120, duration: 1, ease: "inkOut" }, 0.15)
        .from("[data-fade]", { autoAlpha: 0, duration: 0.6, stagger: 0.08 }, 0.2)
        .fromTo("[data-blot]", { scale: 0, rotate: -40 }, { scale: 0.32, rotate: 0, duration: 1.7, ease: "power2.out" }, 0.1)
        .to(counter, { v: 100, duration: 1.7, ease: "power2.inOut", onUpdate: () => (num.textContent = String(Math.round(counter.v)).padStart(3, "0")) }, 0.1)
        .to("[data-blot]", { scale: 7, duration: 1, ease: "power3.in" }, 1.85)
        .to("[data-wm], [data-fade]", { autoAlpha: 0, duration: 0.3 }, 2.2)
        .add(markIntroDone, 2.75)
        .to(root.current, { autoAlpha: 0, duration: 0.5, ease: "power1.out" }, 2.8);
    },
    { scope: root },
  );

  return (
    <div ref={root} aria-hidden className="preloader paper fixed inset-0 z-[80] grid place-items-center overflow-hidden text-ink">
      <div data-blot className="absolute h-[60vmax] w-[60vmax] scale-0 text-ink">
        <InkSplat className="h-full w-full" seed={9} drops={9} />
      </div>
      <div className="relative overflow-hidden mix-blend-difference text-bone">
        <div data-wm>
          <Wordmark knockout="text-black" className="text-[clamp(1.1rem,3.4vw,2.2rem)]" />
        </div>
      </div>
      <p data-fade className="label absolute left-[var(--gutter)] top-6">
        {tc("role")} — {tc("city")}
      </p>
      <p data-fade className="label absolute right-[var(--gutter)] top-6">
        {t("loading")}
      </p>
      <p data-fade className="absolute bottom-5 left-[var(--gutter)] font-mono text-[clamp(3rem,9vw,7rem)] font-light leading-none tabular-nums">
        <span data-count>000</span>
      </p>
      <p data-fade className="label absolute bottom-6 right-[var(--gutter)]">
        {tc("specialties")}
      </p>
    </div>
  );
}
