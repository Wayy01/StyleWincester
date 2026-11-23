"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { ArrowDown, ArrowUpRight } from "@phosphor-icons/react";
import { gsap, SplitText, useGSAP, MOTION_OK } from "@/components/motion/gsap";
import { whenIntroDone } from "@/components/motion/intro";
import { TransitionLink } from "@/components/motion/transition";
import { InkArrow } from "@/components/ink/strokes";
import { dmUrl } from "@/components/site/nav-items";

type Props = { video: string; poster: string; instagram: string };

/**
 * The reel sits in a portrait window cut out of the ink. Scrolling opens the window to full bleed while
 * the headline splits apart, so the first scroll feels like stepping into the studio.
 */
export function Hero({ video, poster, instagram }: Props) {
  const t = useTranslations("home");
  const tc = useTranslations("common");
  const root = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const frame = el.querySelector<HTMLElement>("[data-frame]")!;

      // Portrait window centred in the viewport, as clip-path insets (percent of the hero box).
      const windowInset = () => {
        const w = el.clientWidth;
        const h = el.clientHeight;
        const fh = Math.min(h * (w < 768 ? 0.5 : 0.62), w < 768 ? w * 1.05 : 820);
        const fw = fh * (9 / 16);
        const y = ((h - fh) / 2 / h) * 100;
        const x = ((w - fw) / 2 / w) * 100;
        const top = w < 768 ? y - 4 : y + 2;
        return `inset(${top}% ${x}% ${100 - top - (fh / h) * 100}% ${x}% round 2px)`;
      };

      const mm = gsap.matchMedia(el);
      mm.add(MOTION_OK, (ctx) => {
        const words = SplitText.create("[data-word]", { type: "chars", mask: "chars", charsClass: "sc" });
        gsap.set("[data-word]", { autoAlpha: 1 });
        gsap.set(words.chars, { yPercent: 110 });
        gsap.set("[data-fade]", { autoAlpha: 0, y: 18 });
        gsap.set("[data-note] [data-draw]", { drawSVG: "0%" });

        // The pin is created at mount so every ScrollTrigger below measures the page with its spacer.
        // The intro animates different layers (curtain, chars, [data-fade]) than the scrub ([data-out], words, clip).
        gsap
          .timeline({ scrollTrigger: { trigger: el, start: "top top", end: "+=110%", pin: true, scrub: 0.6, invalidateOnRefresh: true } })
          .fromTo(frame, { clipPath: windowInset }, { clipPath: "inset(0% 0% 0% 0% round 0px)", ease: "none" }, 0)
          .to("[data-split='left']", { xPercent: -60, autoAlpha: 0, ease: "none" }, 0)
          .to("[data-split='right']", { xPercent: 60, autoAlpha: 0, ease: "none" }, 0)
          .to("[data-split='mid']", { yPercent: -120, autoAlpha: 0, ease: "none" }, 0)
          .to("[data-out]", { autoAlpha: 0, ease: "none", duration: 0.35 }, 0)
          .to("[data-shade]", { opacity: 0.15, ease: "none" }, 0);

        // ctx.add keeps selectors scoped to the hero: the callback fires from inside the preloader's timeline.
        const cancel = whenIntroDone(ctx.add("intro", (): void => {
          videoRef.current?.play().catch(() => {});
          gsap
            .timeline()
            .fromTo("[data-curtain]", { scaleY: 1 }, { scaleY: 0, duration: 1.5, ease: "ink" }, 0)
            .fromTo(videoRef.current, { scale: 1.35 }, { scale: 1, duration: 2.2, ease: "inkOut" }, 0)
            .to(words.chars, { yPercent: 0, duration: 1.3, stagger: 0.035, ease: "inkOut" }, 0.15)
            .to("[data-fade]", { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.07 }, 0.7)
            .to("[data-note] [data-draw]", { drawSVG: "100%", duration: 1.1, ease: "power2.inOut" }, 1.1);
        }) as () => void);
        return () => {
          cancel();
          words.revert();
        };
      });
      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(frame, { clipPath: windowInset() });
        gsap.set("[data-word]", { autoAlpha: 1 });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} data-header="dark" className="relative h-svh min-h-[34rem] overflow-hidden bg-ink text-bone">
      <div data-frame className="absolute inset-0 overflow-hidden will-change-[clip-path]">
        <video ref={videoRef} className="h-full w-full object-cover" src={video} poster={poster} muted loop playsInline preload="auto" aria-hidden />
        <div data-shade className="absolute inset-0 bg-ink opacity-0" />
        <div data-curtain className="absolute inset-0 origin-top bg-ink motion-reduce:hidden" />
      </div>

      <div className="pointer-events-none relative flex h-full flex-col px-gutter pb-6 pt-[calc(var(--header-h)+1rem)]">
        <div data-out>
          <div data-fade className="label flex justify-between gap-4 text-bone/70">
            <span>
              {tc("role")} — {tc("city")}
            </span>
            <span className="hidden sm:block">{tc("edition", { year: 2026 })}</span>
            <span className="hidden md:block">{tc("specialties")}</span>
          </div>
        </div>

        <h1 className="relative flex flex-1 flex-col justify-center mix-blend-difference" aria-label={`${t("heroWord1")} ${t("heroWord2")} ${t("heroWord3")}`}>
          <span data-split="left" data-word className="display invisible block text-[clamp(6rem,24vw,26rem)] leading-[0.78]" aria-hidden>
            {t("heroWord1")}
          </span>
          <span data-split="mid" data-word className="display invisible block self-center pl-[18vw] text-[clamp(3rem,9vw,9rem)] italic text-honey" aria-hidden>
            {t("heroWord2")}
          </span>
          <span data-split="right" data-word className="display invisible block self-end text-right text-[clamp(4.6rem,17vw,19rem)] italic leading-[0.78]" aria-hidden>
            {t("heroWord3")}
          </span>
        </h1>

        <div data-out data-note className="absolute right-[6vw] top-[22%] hidden w-56 rotate-[-6deg] text-honey lg:block">
          <p className="hand text-[1.75rem]">{t("heroNote")}</p>
          <InkArrow className="ml-[-2.5rem] mt-1 h-20 w-24 -scale-x-100 rotate-[20deg]" />
        </div>

        <div data-out className="pointer-events-auto flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div data-fade className="max-w-sm">
            <p className="text-[0.98rem] leading-relaxed text-bone/80">{t("heroLead")}</p>
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
              <TransitionLink href="/book" label={tc("bookCta")} className="group inline-flex items-center gap-3 bg-bone px-5 py-3 text-ink transition-colors hover:bg-honey">
                <span className="label text-[0.68rem]">{tc("bookCta")}</span>
                <ArrowUpRight weight="light" className="transition-transform duration-500 group-hover:rotate-45" />
              </TransitionLink>
              <a href={dmUrl(instagram)} target="_blank" rel="noreferrer" className="label border-b border-bone/40 pb-1 text-[0.68rem] hover:border-bone">
                {tc("dmCta")}
              </a>
            </div>
          </div>
          <p data-fade className="label hidden items-center gap-3 text-bone/60 sm:flex">
            {t("scroll")} <ArrowDown weight="light" className="animate-bounce" />
          </p>
        </div>
      </div>
    </section>
  );
}
