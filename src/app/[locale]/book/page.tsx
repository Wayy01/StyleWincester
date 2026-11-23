import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowUpRight, InstagramLogo, Phone, TelegramLogo } from "@phosphor-icons/react/dist/ssr";
import type { Locale } from "@/i18n/routing";
import { getMenu, getSettings } from "@/lib/data";
import { pick } from "@/lib/i18n";
import { formatPrice } from "@/lib/format";
import { SplitReveal } from "@/components/motion/split-reveal";
import { Reveal } from "@/components/motion/reveal";
import { BookingForm } from "@/components/book/booking-form";
import { dmUrl, telegramUrl } from "@/components/site/nav-items";

// Reads ?service= to preselect a service, so it renders per request.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/[locale]/book">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("book"), description: t("bookDescription") };
}

export default async function BookPage({ params, searchParams }: PageProps<"/[locale]/book">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const { service } = await searchParams;
  const t = await getTranslations("book");
  const tc = await getTranslations("common");
  const [menu, settings] = await Promise.all([getMenu(), getSettings()]);

  const groups = menu.map((c) => ({
    label: pick(c, "name", locale),
    options: c.services.map((s) => ({ id: s.id, label: pick(s, "name", locale), price: formatPrice(s, locale) })),
  }));
  const preselect = Number(Array.isArray(service) ? service[0] : service) || undefined;
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Chisinau" }).format(new Date());

  return (
    <section className="paper px-gutter pb-28 pt-[calc(var(--header-h)+4rem)] sm:pt-[calc(var(--header-h)+6rem)]">
      <div className="mx-auto grid max-w-[88rem] gap-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
        <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
          <p className="label text-muted">{t("kicker")}</p>
          <SplitReveal as="h1" immediate className="display mt-5 text-[clamp(4.2rem,9vw,9rem)]">
            {t("title")}
          </SplitReveal>
          <Reveal>
            <p data-reveal className="mt-8 max-w-md text-lg leading-relaxed text-ink-3">
              {t("lead")}
            </p>

            <div data-reveal className="mt-12 border-t border-ink pt-6">
              <p className="display-wide text-2xl italic">{t("direct")}</p>
              <p className="mt-1 text-sm text-muted">{t("directLead")}</p>
              <ul className="mt-5 space-y-3">
                <li>
                  <a href={dmUrl(settings.instagram)} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-3">
                    <InstagramLogo weight="light" className="size-5" />
                    <span className="border-b border-transparent group-hover:border-ink">{tc("dmCta")} · @{settings.instagram}</span>
                    <ArrowUpRight weight="light" />
                  </a>
                </li>
                {settings.telegram && (
                  <li>
                    <a href={telegramUrl(settings.telegram)} target="_blank" rel="noreferrer" className="group inline-flex items-center gap-3">
                      <TelegramLogo weight="light" className="size-5" />
                      <span className="border-b border-transparent group-hover:border-ink">@{settings.telegram.replace(/^@/, "")}</span>
                    </a>
                  </li>
                )}
                {settings.phone && (
                  <li>
                    <a href={`tel:${settings.phone.replace(/\s/g, "")}`} className="group inline-flex items-center gap-3">
                      <Phone weight="light" className="size-5" />
                      <span className="border-b border-transparent group-hover:border-ink">{settings.phone}</span>
                    </a>
                  </li>
                )}
              </ul>
            </div>

            <div data-reveal className="mt-10 grid gap-8 border-t border-[var(--line-strong)] pt-6 sm:grid-cols-2">
              <div>
                <p className="label text-muted">{tc("hours")}</p>
                <ul className="mt-3 space-y-2">
                  {settings.hours.map((h) => (
                    <li key={h.daysRo}>
                      <span className="block">{pick(h, "days", locale)}</span>
                      <span className="label text-muted">{h.time}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="label text-muted">{tc("where")}</p>
                <p className="mt-3 text-ink-3">{pick(settings, "address", locale)}</p>
              </div>
            </div>

            <div data-reveal className="mt-12 hidden w-48 rotate-3 bg-bone p-2 shadow-[0_24px_50px_-24px_rgba(21,17,14,0.6)] lg:block">
              <Image src="/media/photo/bob-polo.webp" alt="" width={720} height={1280} sizes="192px" className="aspect-[3/4] w-full object-cover" />
            </div>
          </Reveal>
        </div>

        <BookingForm groups={groups} preselect={preselect} today={today} />
      </div>
    </section>
  );
}
