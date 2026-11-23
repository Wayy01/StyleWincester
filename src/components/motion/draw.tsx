"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP, MOTION_OK } from "./gsap";
import { cn } from "@/lib/utils";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  /** Tie the stroke to scroll position instead of playing once. */
  scrub?: boolean;
  start?: string;
  end?: string;
  duration?: number;
  stagger?: number;
  delay?: number;
};

/** Draws every `[data-draw]` / `[data-strand]` path inside, like a pen tracing the illustration. */
export function DrawOnScroll({ as: Tag = "div", children, className, scrub, start = "top 85%", end = "bottom 40%", duration = 1.6, stagger = 0.08, delay = 0 }: Props) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const paths = ref.current?.querySelectorAll("[data-draw],[data-strand]");
        if (!paths?.length) return;
        gsap.fromTo(
          paths,
          { drawSVG: "0%" },
          {
            drawSVG: "100%",
            duration,
            delay,
            stagger: scrub ? stagger / 4 : stagger,
            ease: scrub ? "none" : "power2.inOut",
            scrollTrigger: scrub ? { trigger: ref.current, start, end, scrub: 0.8 } : { trigger: ref.current, start, once: true },
          },
        );
      });
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  );
}
