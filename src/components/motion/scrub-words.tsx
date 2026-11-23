"use client";

import { useRef, type ReactNode } from "react";
import { gsap, SplitText, useGSAP, MOTION_OK } from "./gsap";
import { cn } from "@/lib/utils";

/** Long statement whose words ink in as you read down the page. */
export function ScrubWords({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        let split: SplitText | undefined;
        document.fonts.ready.then(() => {
          split = SplitText.create(ref.current, { type: "words", autoSplit: true, onSplit: (self) =>
            gsap.fromTo(
              self.words,
              { opacity: 0.14 },
              { opacity: 1, stagger: 0.1, ease: "none", scrollTrigger: { trigger: ref.current, start: "top 78%", end: "bottom 45%", scrub: 0.5 } },
            ),
          });
        });
        return () => split?.revert();
      });
    },
    { scope: ref },
  );
  return (
    <p ref={ref} className={cn(className)}>
      {children}
    </p>
  );
}
