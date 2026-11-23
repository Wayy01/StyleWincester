"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, MOTION_OK } from "./gsap";
import { cn } from "@/lib/utils";

/** Children marked `data-reveal` fade up in sequence as the block enters the viewport. */
export function Reveal({ children, className, y = 36, stagger = 0.08 }: { children: ReactNode; className?: string; y?: number; stagger?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const items = ref.current?.querySelectorAll("[data-reveal]");
        if (!items?.length) return;
        gsap.from(items, {
          y,
          autoAlpha: 0,
          duration: 1.1,
          stagger,
          scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
        });
      });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/** Media that unveils from the bottom edge while settling from a slight zoom. */
export function ClipReveal({ children, className, from = "bottom" }: { children: ReactNode; className?: string; from?: "bottom" | "left" | "center" }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const inset = from === "left" ? "inset(0% 100% 0% 0%)" : from === "center" ? "inset(18% 18% 18% 18%)" : "inset(100% 0% 0% 0%)";
        const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top 88%", once: true } });
        tl.fromTo(ref.current, { clipPath: inset }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "ink" }).from(
          ref.current!.firstElementChild,
          { scale: 1.25, duration: 1.8, ease: "inkOut" },
          0,
        );
      });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      {children}
    </div>
  );
}

/** Drifts its child against the scroll for depth. */
export function Parallax({ children, className, amount = 12 }: { children: ReactNode; className?: string; amount?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          ref.current!.firstElementChild,
          { yPercent: -amount },
          { yPercent: amount, ease: "none", scrollTrigger: { trigger: ref.current, start: "top bottom", end: "bottom top", scrub: true } },
        );
      });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      {children}
    </div>
  );
}
