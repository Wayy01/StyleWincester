"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/components/motion/gsap";

/** Oxblood hairline across the top that fills as the article is read. */
export function ReadingProgress() {
  const bar = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    gsap.fromTo(
      bar.current,
      { scaleX: 0 },
      { scaleX: 1, ease: "none", scrollTrigger: { trigger: "[data-article]", start: "top top", end: "bottom bottom", scrub: 0.3 } },
    );
  });
  return <div ref={bar} aria-hidden className="fixed inset-x-0 top-0 z-[56] h-[3px] origin-left bg-oxblood-2" />;
}
