"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, useGSAP, MOTION_OK } from "./gsap";
import { whenIntroDone } from "./intro";
import { cn } from "@/lib/utils";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delay?: number;
  /** "lines" for headings, "words" for long-form statements. */
  by?: "lines" | "words" | "chars";
  /** Play on mount (after the intro) instead of on scroll. */
  immediate?: boolean;
  stagger?: number;
};

/** Text that rises out of a mask line by line. Splitting waits for fonts so line breaks are final. */
export function SplitReveal({ as: Tag = "div", children, className, delay = 0, by = "lines", immediate, stagger }: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia(el);
      mm.add(MOTION_OK, (ctx) => {
        let split: SplitText | undefined;
        let cancel = () => {};
        const run = ctx.add("run", () => {
          split = SplitText.create(el, {
            type: by === "chars" ? "lines,chars" : by === "words" ? "lines,words" : "lines",
            mask: "lines",
            linesClass: "sl",
            wordsClass: "sw",
            charsClass: "sc",
            autoSplit: true,
            onSplit(self) {
              const targets = by === "chars" ? self.chars : by === "words" ? self.words : self.lines;
              return gsap.from(targets, {
                yPercent: 115,
                rotate: by === "lines" ? 2.5 : 0,
                duration: by === "chars" ? 1 : 1.25,
                stagger: stagger ?? (by === "chars" ? 0.025 : by === "words" ? 0.018 : 0.09),
                delay,
                ease: "inkOut",
                scrollTrigger: immediate ? undefined : { trigger: el, start: "top 88%", once: true },
              });
            },
          });
          gsap.set(el, { autoAlpha: 1 });
        }) as () => void;
        if (immediate) cancel = whenIntroDone(() => document.fonts.ready.then(() => run()));
        else document.fonts.ready.then(() => run());
        return () => {
          cancel();
          split?.revert();
        };
      });
      mm.add("(prefers-reduced-motion: reduce)", () => gsap.set(el, { autoAlpha: 1 }));
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={cn("invisible", className)}>
      {children}
    </Tag>
  );
}
