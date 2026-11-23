import type { Locale } from "@/i18n/routing";

const CURRENCY: Record<Locale, string> = { ro: "lei", ru: "лей" };
const FROM: Record<Locale, string> = { ro: "de la", ru: "от" };
const FREE: Record<Locale, string> = { ro: "gratuit", ru: "бесплатно" };

/** 2800 → "2 800" with a narrow no-break space, the way printed price lists set it. */
export function groupDigits(n: number) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function formatPrice(s: { priceFrom: number; priceTo: number | null; isFrom: boolean }, locale: Locale) {
  if (s.priceFrom === 0 && !s.priceTo) return FREE[locale];
  const cur = CURRENCY[locale];
  if (s.priceTo) return `${groupDigits(s.priceFrom)}–${groupDigits(s.priceTo)} ${cur}`;
  return `${s.isFrom ? `${FROM[locale]} ` : ""}${groupDigits(s.priceFrom)} ${cur}`;
}

export function formatDuration(min: number, locale: Locale) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  const [hu, mu] = locale === "ru" ? ["ч", "мин"] : ["h", "min"];
  if (!h) return `${m} ${mu}`;
  return m ? `${h} ${hu} ${m} ${mu}` : `${h} ${hu}`;
}

export function formatDate(d: Date, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "ru" ? "ru-MD" : "ro-MD", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Chisinau",
  }).format(d);
}
