import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import type { Locale } from "@/i18n/routing";
import { getFaqs, getMenu } from "@/lib/data";
import { pick } from "@/lib/i18n";
import { PageHeader } from "@/components/site/page-header";
import { PriceRow } from "@/components/site/price-row";
import { CategoryIndex } from "@/components/site/category-index";
import { Faq } from "@/components/site/faq";
import { InViewVideo } from "@/components/motion/video";
import { Reveal } from "@/components/motion/reveal";
import { DrawOnScroll } from "@/components/motion/draw";
import { SplitReveal } from "@/components/motion/split-reveal";
import { TransitionLink } from "@/components/motion/transition";
import { CATEGORY_ICON, InkIcon } from "@/components/ink/icons";
import { LengthFigures } from "@/components/ink/length-guide";

export async function generateMetadata({ params }: PageProps<"/[locale]/services">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("services"), description: t("servicesDescription") };
}

export default async function ServicesPage({ params }: PageProps<"/[locale]/services">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const t = await getTranslations("services");
  const [menu, faqs] = await Promise.all([getMenu(), getFaqs()]);

  return (
    <>
      <PageHeader
        kicker={t("kicker")}
        title={t("title")}
        lead={t("lead")}
        aside={
          <div className="relative mx-auto hidden lg:block">
            <div className="h-[26rem] w-[17rem] rounded-t-full border border-[var(--line-strong)] p-2">
              <div className="h-full w-full overflow-hidden rounded-t-full">
                <InViewVideo src="/media/video/chocolate.mp4" poster="/media/poster/chocolate.webp" eager />
              </div>
            </div>
            <p className="hand absolute -left-20 bottom-10 -rotate-6 text-2xl text-oxblood-2">Dark Chocolate</p>
          </div>
        }
      />

      <section className="bg-bone px-gutter pb-24 sm:pb-36">
        <div className="mx-auto grid max-w-[88rem] gap-12 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-20">
          <aside className="sticky top-[var(--hdr-offset)] z-20 -mx-[var(--gutter)] min-w-0 border-b border-[var(--line)] bg-bone px-gutter py-3 transition-[top] duration-500 lg:top-28 lg:mx-0 lg:self-start lg:border-0 lg:bg-transparent lg:p-0">
            <CategoryIndex items={menu.map((c) => ({ slug: c.slug, name: pick(c, "name", locale), count: c.services.length }))} />
            <p className="label mt-8 hidden text-muted lg:block">{t("note")}</p>
          </aside>

          <div className="min-w-0 space-y-24">
            {menu.map((cat, i) => (
              <section key={cat.id} id={cat.slug} className="scroll-mt-32">
                <div className="flex items-end gap-3 border-b-2 border-ink pb-5 sm:gap-5">
                  <DrawOnScroll className="shrink-0 text-oxblood">
                    <InkIcon name={CATEGORY_ICON[cat.slug] ?? "cut"} className="size-12 sm:size-16" strokeWidth={1.2} />
                  </DrawOnScroll>
                  <h2 className="display min-w-0 text-[clamp(2.4rem,10vw,6rem)]">
                    <span className="mr-3 align-top font-mono text-base text-muted">{["I", "II", "III", "IV", "V", "VI"][i]}.</span>
                    {pick(cat, "name", locale)}
                  </h2>
                </div>
                {pick(cat, "intro", locale) && <p className="mt-5 max-w-2xl text-ink-3">{pick(cat, "intro", locale)}</p>}
                <Reveal className="mt-4 divide-y divide-[var(--line)]" y={20} stagger={0.04}>
                  {cat.services.map((s) => (
                    <TransitionLink key={s.id} href={`/book?service=${s.id}`} label={t("book")} data-reveal className="group relative block pr-10">
                      <PriceRow service={s} locale={locale} featuredLabel={t("featured")} />
                      <ArrowUpRight weight="light" className="absolute right-0 top-5 size-5 -translate-x-2 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100" />
                    </TransitionLink>
                  ))}
                </Reveal>
              </section>
            ))}
            <p className="label text-muted lg:hidden">{t("note")}</p>
          </div>
        </div>
      </section>

      <section className="paper border-t border-[var(--line)] px-gutter py-24 sm:py-32">
        <div className="mx-auto max-w-[88rem]">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-end">
            <SplitReveal as="h2" className="display text-[clamp(3.4rem,7vw,7rem)]">
              {t("lengthTitle")}
            </SplitReveal>
            <p className="max-w-md text-ink-3 lg:justify-self-end">{t("lengthLead")}</p>
          </div>
          <DrawOnScroll className="mt-16" stagger={0.05} duration={1.4}>
            <LengthFigures
              labels={[
                { name: t("lengthShort"), note: t("lengthShortNote") },
                { name: t("lengthMedium"), note: t("lengthMediumNote") },
                { name: t("lengthLong"), note: t("lengthLongNote") },
                { name: t("lengthXLong"), note: t("lengthXLongNote") },
              ]}
            />
          </DrawOnScroll>
        </div>
      </section>

      {faqs.length > 0 && (
        <section className="bg-bone px-gutter py-24 sm:py-32">
          <div className="mx-auto grid max-w-[88rem] gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <SplitReveal as="h2" className="display text-[clamp(3.4rem,7vw,7rem)]">
              {t("faqTitle")}
            </SplitReveal>
            <Faq items={faqs.map((f) => ({ q: pick(f, "question", locale), a: pick(f, "answer", locale) }))} />
          </div>
        </section>
      )}
    </>
  );
}
