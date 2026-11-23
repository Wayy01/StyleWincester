import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getCollabs } from "@/lib/data";
import { pick } from "@/lib/i18n";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { SplitReveal } from "@/components/motion/split-reveal";
import { ClipReveal, Parallax, Reveal } from "@/components/motion/reveal";
import { InViewVideo } from "@/components/motion/video";
import { DrawOnScroll } from "@/components/motion/draw";
import { InkIcon, type InkIconName } from "@/components/ink/icons";
import { InkUnderline } from "@/components/ink/strokes";
import { InkSplat } from "@/components/ink/splat";
import { HairStrands } from "@/components/ink/strands";

export async function generateMetadata({ params }: PageProps<"/[locale]/about">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("about"), description: t("aboutDescription") };
}

const PILLARS: { n: 1 | 2 | 3; icon: InkIconName }[] = [
  { n: 1, icon: "cut" },
  { n: 2, icon: "color" },
  { n: 3, icon: "mirror" },
];

export default async function AboutPage({ params }: PageProps<"/[locale]/about">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const tc = await getTranslations("common");

  const collabs = await getCollabs();

  return (
    <>
      <header className="paper relative overflow-hidden px-gutter pb-20 pt-[calc(var(--header-h)+4rem)] sm:pt-[calc(var(--header-h)+6rem)]">
        <div className="mx-auto grid max-w-[88rem] items-end gap-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div>
            <p className="label text-muted">{t("kicker")}</p>
            <SplitReveal as="h1" immediate className="display mt-5 text-[clamp(4rem,10vw,10.5rem)]">
              {t("title")}
            </SplitReveal>
            <Reveal>
              <p data-reveal className="mt-10 max-w-xl text-xl leading-relaxed text-ink-3">
                {t("lead")}
              </p>
              <p data-reveal className="label mt-8 text-muted">
                {tc("role")} · {tc("city")} · {tc("specialties")}
              </p>
            </Reveal>
          </div>
          <div className="relative">
            <InkSplat className="absolute -right-24 -top-24 size-80 text-oxblood/80" seed={44} />
            <ClipReveal className="relative aspect-[3/4] bg-ink">
              <Image src="/media/photo/wash-ritual.webp" alt="" width={1080} height={1920} sizes="(min-width: 1024px) 38vw, 92vw" className="h-full w-full object-cover" priority />
            </ClipReveal>
            <p className="hand absolute -bottom-10 right-2 -rotate-6 text-4xl text-oxblood-2">{tc("role")}</p>
          </div>
        </div>
      </header>

      <section className="bg-bone px-gutter py-24 sm:py-32">
        <div className="mx-auto max-w-[88rem]">
          <p className="label text-muted">{t("approachLabel")}</p>
          <Reveal className="mt-10 grid gap-14 md:grid-cols-3 md:gap-10">
            {PILLARS.map((p) => (
              <article data-reveal key={p.n} className="border-t border-ink pt-6">
                <div className="flex items-start justify-between">
                  <span className="display text-7xl leading-none">{String(p.n).padStart(2, "0")}</span>
                  <DrawOnScroll className="text-oxblood">
                    <InkIcon name={p.icon} className="size-14" strokeWidth={1.2} />
                  </DrawOnScroll>
                </div>
                <h2 className="display-wide mt-8 text-[2rem] italic leading-tight">{t(`p${p.n}Title`)}</h2>
                <p className="mt-4 leading-relaxed text-muted">{t(`p${p.n}Text`)}</p>
              </article>
            ))}
          </Reveal>
        </div>
      </section>

      <section data-header="dark" className="relative bg-ink text-bone">
        <Parallax amount={8} className="h-[70svh] sm:h-[88svh]">
          <div className="h-[120%] w-full">
            <InViewVideo src="/media/video/film.mp4" poster="/media/poster/film.webp" label={t("filmCaption")} />
          </div>
        </Parallax>
        <p className="label absolute bottom-6 left-[var(--gutter)] max-w-xs text-bone/80">{t("filmCaption")}</p>
      </section>

      <section className="paper relative overflow-hidden px-gutter py-28 sm:py-40">
        <DrawOnScroll scrub start="top 85%" end="bottom 30%" className="pointer-events-none absolute -left-10 top-0 h-full text-ink/20 max-md:hidden">
          <HairStrands className="h-full w-auto" seed={77} count={30} />
        </DrawOnScroll>
        <blockquote className="relative mx-auto max-w-5xl text-center">
          <span className="display block text-[8rem] leading-[0.5] text-oxblood" aria-hidden>
            “
          </span>
          <SplitReveal as="p" by="words" className="display-wide text-[clamp(2.2rem,5vw,4.6rem)] italic leading-[1.05]">
            {t("quote")}
          </SplitReveal>
          <DrawOnScroll className="mx-auto mt-6 w-64 text-oxblood-2">
            <InkUnderline className="h-5 w-full" />
          </DrawOnScroll>
          <footer className="hand mt-4 text-3xl text-muted">Style Wincester</footer>
        </blockquote>
      </section>

      {collabs.length > 0 && (
      <section className="bg-bone px-gutter py-24 sm:py-32">
          <div className="mx-auto grid max-w-[88rem] gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <div>
              <SplitReveal as="h2" className="display text-[clamp(3.4rem,7vw,7rem)]">
                {t("collabTitle")}
              </SplitReveal>
              <p className="mt-6 max-w-sm text-muted">{t("collabLead")}</p>
              <div className="mt-10 hidden w-56 rotate-[-4deg] bg-bone p-2 shadow-[0_24px_50px_-24px_rgba(21,17,14,0.6)] lg:block">
                <Image src="/media/photo/scroll-dress.webp" alt="Yulia Efros — Scroll Dress" width={480} height={640} sizes="224px" className="w-full" />
              </div>
            </div>
            <Reveal stagger={0.05}>
              <ul className="border-t border-ink">
                {collabs.map((c, i) => {
                  const name = (
                    <span className="flex min-w-0 items-baseline gap-5">
                      <span className="label text-muted">{String(i + 1).padStart(2, "0")}</span>
                      <span className="display-wide text-[clamp(1.8rem,3.4vw,3rem)] transition-colors group-hover:text-oxblood">{c.name}</span>
                      {c.url && <ArrowUpRight weight="light" className="size-5 shrink-0 self-center opacity-0 transition-opacity group-hover:opacity-100" />}
                    </span>
                  );
                  return (
                    <li data-reveal key={c.id} className="border-b border-[var(--line-strong)]">
                      {c.url ? (
                        <a href={c.url} target="_blank" rel="noreferrer" className="group flex flex-col gap-2 py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                          {name}
                          <span className="label text-muted sm:text-right">{pick(c, "role", locale)}</span>
                        </a>
                      ) : (
                        <div className="group flex flex-col gap-2 py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                          {name}
                          <span className="label text-muted sm:text-right">{pick(c, "role", locale)}</span>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          </div>
        </section>
      )}
    </>
  );
}
