"use client";

/**
 * The preloader runs once per tab session. Hero animations wait for it so they play on a clean stage.
 * `whenIntroDone` resolves immediately on client-side navigations and on repeat visits.
 */
const EVENT = "sw:intro-done";

export function markIntroDone() {
  document.documentElement.dataset.intro = "done";
  window.dispatchEvent(new Event(EVENT));
}

export function whenIntroDone(cb: () => void) {
  const root = document.documentElement;
  if (root.dataset.intro === "done" || root.classList.contains("intro-seen")) {
    cb();
    return () => {};
  }
  window.addEventListener(EVENT, cb, { once: true });
  return () => window.removeEventListener(EVENT, cb);
}
