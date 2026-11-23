"use client";

import { ArrowUp } from "@phosphor-icons/react";
import { lenisRef } from "@/components/motion/lenis";

export function BackToTop({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => (lenisRef.current ? lenisRef.current.scrollTo(0, { duration: 2 }) : window.scrollTo({ top: 0, behavior: "smooth" }))}
      className="label inline-flex items-center gap-1.5 hover:text-bone"
    >
      {label} <ArrowUp weight="light" />
    </button>
  );
}
