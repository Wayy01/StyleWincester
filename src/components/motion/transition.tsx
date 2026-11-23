"use client";

import { createContext, use, useCallback, useEffect, useRef, useState, type ComponentProps, type MouseEvent } from "react";
import { useLocale } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { gsap, ScrollTrigger, MOTION_OK } from "./gsap";
import { scrollToTop } from "./lenis";

// The curtain is one SVG path: a bottom-anchored shape rises with a bulging crest, then the top-anchored
// shape drains away with a sagging edge. Same command structure everywhere so GSAP can tween the numbers.
const RISE = ["M0 100 L100 100 L100 100 Q50 100 0 100 Z", "M0 100 L100 100 L100 55 Q50 5 0 55 Z", "M0 100 L100 100 L100 0 Q50 0 0 0 Z"];
const DRAIN = ["M0 0 L100 0 L100 100 Q50 100 0 100 Z", "M0 0 L100 0 L100 45 Q50 95 0 45 Z", "M0 0 L100 0 L100 0 Q50 0 0 0 Z"];

type Navigate = (href: string, opts?: { label?: string; locale?: Locale }) => void;

const TransitionContext = createContext<Navigate | null>(null);

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const pathRef = useRef<SVGPathElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const pending = useRef<{ from: string; locale: string } | null>(null);
  const [label, setLabel] = useState("");

  const reveal = useCallback(() => {
    pending.current = null;
    scrollToTop();
    requestAnimationFrame(() => ScrollTrigger.refresh());
    const tl = gsap.timeline({
      onComplete: () => {
        busy.current = false;
        gsap.set(pathRef.current, { attr: { d: RISE[0] } });
      },
    });
    tl.to(labelRef.current, { autoAlpha: 0, y: -40, duration: 0.45, ease: "ink" })
      .set(pathRef.current, { attr: { d: DRAIN[0] } })
      .to(pathRef.current, { attr: { d: DRAIN[1] }, duration: 0.45, ease: "power2.in" }, "-=0.1")
      .to(pathRef.current, { attr: { d: DRAIN[2] }, duration: 0.45, ease: "power2.out" });
  }, []);

  // A pathname or locale change means the new page has committed: drain the curtain.
  useEffect(() => {
    if (pending.current && (pending.current.from !== pathname || pending.current.locale !== locale)) reveal();
  }, [pathname, locale, reveal]);

  const navigate = useCallback<Navigate>(
    (href, opts) => {
      const go = () => (opts?.locale ? router.replace(href, { locale: opts.locale, scroll: false }) : router.push(href, { scroll: false }));
      if (busy.current) return;
      if (!window.matchMedia(MOTION_OK).matches) {
        go();
        return;
      }
      busy.current = true;
      setLabel(opts?.label ?? "");
      pending.current = { from: pathname, locale };
      const tl = gsap.timeline();
      tl.set(labelRef.current, { autoAlpha: 0, y: 40 })
        .to(pathRef.current, { attr: { d: RISE[1] }, duration: 0.42, ease: "power2.in" })
        .to(pathRef.current, { attr: { d: RISE[2] }, duration: 0.42, ease: "power2.out" })
        .to(labelRef.current, { autoAlpha: 1, y: 0, duration: 0.6 }, "-=0.35")
        .add(() => {
          go();
          // Same-URL navigations never change the pathname; don't leave the curtain down.
          gsap.delayedCall(2.5, () => pending.current && reveal());
        });
    },
    [router, pathname, locale, reveal],
  );

  return (
    <TransitionContext value={navigate}>
      {children}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-[70]">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
          <path ref={pathRef} d={RISE[0]} fill="var(--color-ink)" />
        </svg>
        <div ref={labelRef} className="invisible absolute inset-0 grid place-items-center text-bone opacity-0">
          <span className="display italic text-[clamp(4rem,16vw,14rem)]">{label}</span>
        </div>
      </div>
    </TransitionContext>
  );
}

export function useNavigate() {
  const ctx = use(TransitionContext);
  if (!ctx) throw new Error("useNavigate must be used inside TransitionProvider");
  return ctx;
}

type TLinkProps = ComponentProps<typeof Link> & { label?: string };

/** A next-intl Link that plays the ink curtain. Modified clicks and new tabs fall through to the browser. */
export function TransitionLink({ label, onClick, href, locale, ...props }: TLinkProps) {
  const navigate = useNavigate();
  const pathname = usePathname();
  const current = useLocale();
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0 || props.target === "_blank") return;
    const target = typeof href === "string" ? href : href.pathname ?? "/";
    if (target === pathname && (!locale || locale === current)) return;
    e.preventDefault();
    navigate(target, { label, locale: locale as Locale | undefined });
  };
  return <Link href={href} locale={locale} onClick={handle} {...props} />;
}
