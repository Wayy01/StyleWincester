import { getTranslations } from "next-intl/server";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import type { SiteSettings } from "@/db/schema";
import type { Locale } from "@/i18n/routing";
import { TransitionLink } from "@/components/motion/transition";
import { SplitReveal } from "@/components/motion/split-reveal";
import { DrawOnScroll } from "@/components/motion/draw";
import { InkUnderline } from "@/components/ink/strokes";
import { HairStrands } from "@/components/ink/strands";
import { NAV, dmUrl, instagramUrl, telegramUrl } from "./nav-items";
import { BackToTop } from "./back-to-top";
import { FooterCta } from "./footer-cta";
import { pick } from "@/lib/i18n";

export async function Footer({ settings, locale }: { settings: SiteSettings; locale: Locale }) {
  const t = await getTranslations("footer");
  const tn = await getTranslations("nav");
  const tc = await getTranslations("common");
  const th = await getTranslations("home");
  const year = new Date().getFullYear();

  return (
    <footer data-header="dark" className="relative overflow-hidden bg-ink text-bone">
      <HairStrands className="pointer-events-none absolute -left-16 -top-10 h-[130%] w-auto text-bone/10" seed={5} count={30} sway={90} />

      <FooterCta>
      <div className="relative px-gutter pt-24 sm:pt-32">
        <p className="label text-muted-2">{th("bookingKicker")}</p>
        <TransitionLink href="/book" label={tn("book")} className="group mt-6 inline-block">
          <SplitReveal as="span" className="display block text-[clamp(4.5rem,15vw,15rem)] italic">
            {tc("bookCta")}
          </SplitReveal>
          <DrawOnScroll className="-mt-2 text-oxblood-2 sm:-mt-6">
            <InkUnderline className="h-6 w-[min(80vw,52rem)] sm:h-10" strokeWidth={4} />
          </DrawOnScroll>
        </TransitionLink>
        <p className="mt-8 max-w-md text-bone/70">{th("bookingLead")}</p>
      </div>
      </FooterCta>

      <div className="relative mt-24 grid gap-12 border-t border-[var(--line-inv)] px-gutter py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="label mb-5 text-muted-2">{t("pages")}</p>
          <ul className="space-y-2">
            {[{ href: "/", key: "home" } as const, ...NAV, { href: "/book", key: "book" } as const].map((item) => (
              <li key={item.href}>
                <TransitionLink href={item.href} label={tn(item.key)} className="transition-colors hover:text-honey">
                  {tn(item.key)}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="label mb-5 text-muted-2">{tc("contact")}</p>
          <ul className="space-y-2">
            <li>
              <a href={dmUrl(settings.instagram)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:text-honey">
                {tc("dmCta")} <ArrowUpRight weight="light" />
              </a>
            </li>
            <li>
              <a href={instagramUrl(settings.instagram)} target="_blank" rel="noreferrer" className="hover:text-honey">
                @{settings.instagram}
              </a>
            </li>
            {settings.telegram && (
              <li>
                <a href={telegramUrl(settings.telegram)} target="_blank" rel="noreferrer" className="hover:text-honey">
                  Telegram @{settings.telegram.replace(/^@/, "")}
                </a>
              </li>
            )}
            {settings.phone && (
              <li>
                <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="hover:text-honey">
                  {settings.phone}
                </a>
              </li>
            )}
            {settings.email && (
              <li>
                <a href={`mailto:${settings.email}`} className="hover:text-honey">
                  {settings.email}
                </a>
              </li>
            )}
          </ul>
        </div>
        <div>
          <p className="label mb-5 text-muted-2">{tc("hours")}</p>
          <ul className="space-y-3">
            {settings.hours.map((h) => (
              <li key={h.daysRo}>
                <span className="block">{pick(h, "days", locale)}</span>
                <span className="label text-muted-2">{h.time}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="label mb-5 text-muted-2">{tc("where")}</p>
          <p className="max-w-xs text-bone/80">{pick(settings, "address", locale)}</p>
          {settings.mapUrl && (
            <a href={settings.mapUrl} target="_blank" rel="noreferrer" className="label mt-4 inline-flex items-center gap-1.5 hover:text-honey">
              Google Maps <ArrowUpRight weight="light" />
            </a>
          )}
        </div>
      </div>

      <div className="relative select-none px-gutter" aria-hidden>
        <p
          className="whitespace-nowrap font-mono font-semibold uppercase leading-[0.8] tracking-[-0.02em] text-bone"
          style={{ fontSize: "clamp(2.4rem, 9.4vw, 13rem)", fontVariationSettings: '"wdth" 75' }}
        >
          Style<span className="ml-[0.2em] inline-block bg-bone px-[0.12em] pt-[0.06em] text-ink">Wincester</span>
        </p>
      </div>

      <div className="relative flex flex-col gap-3 px-gutter py-6 text-xs text-bone/50 sm:flex-row sm:items-center sm:justify-between">
        <p>{t("rights", { year })}</p>
        <p className="label">{tc("specialties")}</p>
        <div className="flex items-center gap-6">
          <BackToTop label={t("top")} />
        </div>
      </div>
    </footer>
  );
}
