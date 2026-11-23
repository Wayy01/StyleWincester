import { getLocale, getTranslations } from "next-intl/server";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import type { MenuCategory } from "@/lib/data";
import type { Locale } from "@/i18n/routing";
import { pick } from "@/lib/i18n";
import { SplitReveal } from "@/components/motion/split-reveal";
import { DrawOnScroll } from "@/components/motion/draw";
import { Reveal } from "@/components/motion/reveal";
import { TransitionLink } from "@/components/motion/transition";
import { Scissors } from "@/components/ink/scissors";
import { CATEGORY_ICON, InkIcon } from "@/components/ink/icons";
import { PriceRow } from "@/components/site/price-row";

const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

export async function ServicesTeaser({ menu }: { menu: MenuCategory[] }) {
  const t = await getTranslations("home");
  const tc = await getTranslations("common");
  const ts = await getTranslations("services");
  const locale = (await getLocale()) as Locale;

  return (
    <section className="relative border-t border-[var(--line)] bg-bone px-gutter py-24 sm:py-36">
      <div className="mx-auto grid max-w-[88rem] gap-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="label text-muted">{t("servicesLabel")}</p>
          <SplitReveal as="h2" className="display mt-5 text-[clamp(4rem,9vw,9rem)]">
            {t("servicesTitle")}
          </SplitReveal>
          <p className="mt-6 max-w-sm text-muted">{t("servicesLead")}</p>
          <TransitionLink href="/services" label={ts("title")} className="group mt-8 inline-flex items-center gap-3 border-b border-ink pb-1.5">
            <span className="label">{tc("seePrices")}</span>
            <ArrowUpRight weight="light" className="transition-transform duration-500 group-hover:rotate-45" />
          </TransitionLink>
          <DrawOnScroll className="mt-12 hidden w-72 text-ink/70 lg:block" duration={2.4} stagger={0.12}>
            <Scissors className="h-auto w-full" />
          </DrawOnScroll>
        </div>

        <div className="space-y-16">
          {menu.map((cat, i) => {
            const featured = cat.services.filter((s) => s.featured);
            const rows = (featured.length ? featured : cat.services).slice(0, 4);
            if (!rows.length) return null;
            return (
              <Reveal key={cat.id}>
                <div data-reveal className="flex items-end justify-between gap-6 border-b border-ink pb-4">
                  <div className="flex items-end gap-4">
                    <DrawOnScroll className="text-oxblood">
                      <InkIcon name={CATEGORY_ICON[cat.slug] ?? "cut"} className="size-12" />
                    </DrawOnScroll>
                    <h3 className="display-wide text-[clamp(2rem,3.4vw,3rem)]">
                      <span className="mr-3 font-mono text-sm align-top text-muted">{ROMAN[i]}.</span>
                      {pick(cat, "name", locale)}
                    </h3>
                  </div>
                  <span className="label hidden text-muted sm:block">{cat.services.length} ×</span>
                </div>
                <p data-reveal className="mt-4 max-w-xl text-[0.95rem] text-muted">
                  {pick(cat, "intro", locale)}
                </p>
                <div className="mt-2 divide-y divide-[var(--line)]">
                  {rows.map((s) => (
                    <div data-reveal key={s.id}>
                      <PriceRow service={s} locale={locale} />
                    </div>
                  ))}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
