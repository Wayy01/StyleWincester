"use client";

import type Lenis from "lenis";

/** The single Lenis instance, shared so page transitions can jump to the top without a smooth scroll. */
export const lenisRef: { current: Lenis | null } = { current: null };

export function scrollToTop() {
  if (lenisRef.current) lenisRef.current.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo(0, 0);
}
