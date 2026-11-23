"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  poster?: string | null;
  className?: string;
  /** Load the file before it's on screen (hero). */
  eager?: boolean;
  label?: string;
};

/** Muted, looping, inline video that only plays while visible, so a page of reels costs one decoder. */
export function InViewVideo({ src, poster, className, eager, label }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (v.preload === "none") v.preload = "auto";
          v.play().catch(() => {});
        } else v.pause();
      },
      { rootMargin: "120px 0px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      className={cn("h-full w-full object-cover", className)}
      src={src}
      poster={poster ?? undefined}
      muted
      loop
      playsInline
      preload={eager ? "auto" : "none"}
      aria-label={label}
    />
  );
}
