"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "./gsap";
import { cn } from "@/lib/utils";

/** An endless ribbon that speeds up and leans with scroll velocity, then settles back. */
export function Marquee({ children, className, speed = 40, reverse }: { children: ReactNode; className?: string; speed?: number; reverse?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const track = ref.current!.querySelector<HTMLElement>("[data-track]")!;
        const loop = gsap.fromTo(
          track,
          { xPercent: reverse ? -50 : 0 },
          { xPercent: reverse ? 0 : -50, duration: speed, ease: "none", repeat: -1 },
        );
        const skew = gsap.quickTo(track, "skewX", { duration: 0.6, ease: "power3.out" });
        const st = ScrollTrigger.create({
          trigger: ref.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate(self) {
            const v = self.getVelocity();
            loop.timeScale(1 + Math.min(Math.abs(v) / 300, 5));
            skew(gsap.utils.clamp(-8, 8, v / -220));
            gsap.to(loop, { timeScale: 1, duration: 1.2, overwrite: true, delay: 0.1 });
          },
        });
        return () => st.kill();
      });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={cn("overflow-hidden", className)}>
      <div data-track className="flex w-max will-change-transform">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
