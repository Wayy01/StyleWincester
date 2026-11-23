import { getTranslations } from "next-intl/server";
import type { Testimonial } from "@/db/schema";
import type { Locale } from "@/i18n/routing";
import { pick } from "@/lib/i18n";
import { SplitReveal } from "@/components/motion/split-reveal";
import { Reveal } from "@/components/motion/reveal";

/** Client words, rendered only once the studio has published real ones in the admin. */
export async function Reviews({ items, locale }: { items: Testimonial[]; locale: Locale }) {
  if (!items.length) return null;
  const t = await getTranslations("home");
  return (
    <section className="border-t border-[var(--line)] bg-bone-2 px-gutter py-24 sm:py-32">
      <div className="mx-auto max-w-[88rem]">
        <p className="label text-muted">{t("reviewsLabel")}</p>
        <SplitReveal as="h2" className="display mt-5 text-[clamp(3.4rem,7vw,7rem)]">
          {t("reviewsTitle")}
        </SplitReveal>
        <Reveal className="mt-14 grid gap-x-10 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {items.map((r, i) => (
            <figure data-reveal key={r.id} className={i % 2 ? "lg:mt-16" : undefined}>
              <span className="display block text-7xl leading-[0.6] text-oxblood" aria-hidden>
                “
              </span>
              <blockquote className="display-wide mt-2 text-[clamp(1.4rem,2.2vw,1.9rem)] italic leading-snug">{pick(r, "text", locale)}</blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-[var(--line-strong)] pt-4">
                <span className="hand text-2xl">{r.name}</span>
                {pick(r, "service", locale) && <span className="label ml-auto text-muted">{pick(r, "service", locale)}</span>}
              </figcaption>
            </figure>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
