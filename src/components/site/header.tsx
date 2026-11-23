"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowUpRight, InstagramLogo } from "@phosphor-icons/react";
import { usePathname } from "@/i18n/navigation";
import { TransitionLink } from "@/components/motion/transition";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK } from "@/components/motion/gsap";
import { lenisRef } from "@/components/motion/lenis";
import { InkCircle } from "@/components/ink/strokes";
import { HairStrands } from "@/components/ink/strands";
import { Wordmark } from "./wordmark";
import { LocaleSwitch } from "./locale-switch";
import { NAV, dmUrl } from "./nav-items";
import { cn } from "@/lib/utils";

type Props = { instagram: string; hours: { days: string; time: string }[] };

export function Header({ instagram, hours }: Props) {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const bar = useRef<HTMLElement>(null);

  const [solid, setSolid] = useState(false);
  const [dark, setDark] = useState(false);

  // Hide on the way down, return on the way up. Sticky page elements follow via --hdr-offset.
  useGSAP(() => {
    const root = document.documentElement;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const show = gsap.quickTo(bar.current, "yPercent", { duration: 0.5, ease: "power3.out" });
      const set = (visible: boolean) => {
        show(visible ? 0 : -110);
        root.style.setProperty("--hdr-offset", visible ? "var(--header-h)" : "0px");
      };
      ScrollTrigger.create({
        start: 160,
        end: "max",
        onUpdate: (self) => set(self.direction !== 1),
        onLeaveBack: () => set(true),
      });
    });
  });

  // The bar takes the colour of whatever section sits under it: sections opt in with data-header="dark".
  useEffect(() => {
    let frame = 0;
    const sample = () => {
      frame = 0;
      const h = bar.current?.offsetHeight ?? 64;
      setSolid(window.scrollY > 24);
      const under = document
        .elementsFromPoint(window.innerWidth / 2, h + 2)
        .find((el) => !bar.current?.contains(el));
      setDark(!!under?.closest('[data-header="dark"]'));
    };
    const queue = () => {
      if (!frame) frame = requestAnimationFrame(sample);
    };
    queue();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);
    // Route changes swap the sections under the bar without a scroll event.
    const late = window.setTimeout(queue, 700);
    return () => {
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      window.clearTimeout(late);
      cancelAnimationFrame(frame);
    };
  }, [pathname]);

  // Close the menu whenever the route changes (the curtain covers the swap).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header
        ref={bar}
        style={{ top: "var(--announce-h, 0px)" }}
        className={cn(
          "fixed inset-x-0 z-50 border-b transition-[background-color,color,border-color,backdrop-filter] duration-500",
          dark ? "text-bone" : "text-ink",
          solid
            ? dark
              ? "border-bone/10 bg-ink/90 backdrop-blur-md"
              : "border-ink/10 bg-bone/90 backdrop-blur-md"
            : "border-transparent bg-transparent",
        )}
      >
        <div className="flex h-[var(--header-h)] items-center justify-between gap-6 px-gutter">
          <TransitionLink href="/" label="Style Wincester" aria-label="Style Wincester" className="shrink-0">
            <Wordmark knockout={cn("transition-colors duration-500", dark ? "text-ink" : "text-bone")} className="text-[0.7rem] sm:text-[0.78rem]" />
          </TransitionLink>

          <nav aria-label="Main" className="hidden items-center gap-9 lg:flex">
            {NAV.map((item) => (
              <TransitionLink
                key={item.href}
                href={item.href}
                label={t(item.key)}
                aria-current={isActive(item.href) ? "page" : undefined}
                className="label group relative py-2"
              >
                {t(item.key)}
                <span
                  className={cn(
                    "absolute -bottom-0.5 left-0 h-px w-full origin-left bg-current transition-transform duration-500 ease-[var(--ease-ink)]",
                    isActive(item.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                  )}
                />
              </TransitionLink>
            ))}
          </nav>

          <div className="flex items-center gap-5 sm:gap-7">
            <LocaleSwitch className="hidden sm:flex" />
            <TransitionLink href="/book" label={t("book")} className="label group relative hidden px-1 py-2 sm:block">
              <span className="relative z-10">{tc("bookCta")}</span>
              <InkCircle className="absolute -inset-x-4 -inset-y-2 h-[calc(100%+1rem)] w-[calc(100%+2rem)] opacity-80 transition-transform duration-700 group-hover:rotate-[-4deg] group-hover:scale-110" />
            </TransitionLink>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="site-menu"
              className="label flex items-center gap-2 py-2 lg:hidden"
            >
              <span className="flex flex-col gap-[5px]" aria-hidden>
                <span className="block h-px w-6 bg-current" />
                <span className="block h-px w-4 bg-current" />
              </span>
              {t("menu")}
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={open} onClose={() => setOpen(false)} instagram={instagram} hours={hours} />
    </>
  );
}

function MobileMenu({ open, onClose, instagram, hours }: { open: boolean; onClose: () => void } & Props) {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline>(null);

  useGSAP(
    () => {
      tl.current = gsap
        .timeline({ paused: true })
        .set(root.current, { visibility: "visible" })
        .fromTo(root.current, { clipPath: "circle(0% at 92% 4%)" }, { clipPath: "circle(150% at 92% 4%)", duration: 0.9, ease: "ink" })
        .from("[data-menu-link]", { yPercent: 110, duration: 0.9, stagger: 0.06 }, 0.25)
        .from("[data-menu-fade]", { autoAlpha: 0, y: 16, duration: 0.6, stagger: 0.05 }, 0.45)
        .fromTo("[data-strand]", { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.6, stagger: 0.01, ease: "power2.out" }, 0.3);
    },
    { scope: root },
  );

  useEffect(() => {
    if (open) {
      lenisRef.current?.stop();
      tl.current?.timeScale(1).play();
    } else {
      lenisRef.current?.start();
      tl.current?.timeScale(1.6).reverse();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      ref={root}
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      inert={!open}
      className="invisible fixed inset-0 z-[55] flex flex-col overflow-hidden bg-ink text-bone"
    >
      <HairStrands className="pointer-events-none absolute -right-10 top-0 h-full w-auto text-oxblood-2/70" seed={21} count={26} />
      <div className="flex h-[var(--header-h)] items-center justify-between px-gutter">
        <Wordmark className="text-[0.7rem]" knockout="text-ink" />
        <button type="button" onClick={onClose} className="label py-2" data-menu-fade>
          {t("close")}
        </button>
      </div>
      <nav className="relative flex flex-1 flex-col justify-center gap-1 px-gutter">
        {[{ href: "/", key: "home" } as const, ...NAV, { href: "/book", key: "book" } as const].map((item, i) => (
          <div key={item.href} className="-mb-2 overflow-hidden pb-2">
            <TransitionLink href={item.href} label={t(item.key)} data-menu-link className="flex items-baseline gap-4">
              <span className="label w-6 text-muted-2">{String(i + 1).padStart(2, "0")}</span>
              <span className="display text-[clamp(3.2rem,15vw,6rem)]">{t(item.key)}</span>
            </TransitionLink>
          </div>
        ))}
      </nav>
      <div className="relative grid gap-6 border-t border-[var(--line-inv)] px-gutter py-6 sm:grid-cols-3">
        <div data-menu-fade className="space-y-1">
          <p className="label text-muted-2">{tc("hours")}</p>
          {hours.map((h) => (
            <p key={h.days} className="text-sm">
              {h.days} <span className="text-muted-2">· {h.time}</span>
            </p>
          ))}
        </div>
        <a data-menu-fade href={dmUrl(instagram)} target="_blank" rel="noreferrer" className="flex items-center gap-2 self-end text-sm">
          <InstagramLogo weight="light" className="size-5" /> {tc("dmCta")} <ArrowUpRight weight="light" />
        </a>
        <LocaleSwitch className="self-end sm:justify-self-end" />
      </div>
    </div>
  );
}
