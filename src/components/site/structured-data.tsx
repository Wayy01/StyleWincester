import type { SiteSettings } from "@/db/schema";
import type { MenuCategory } from "@/lib/data";
import type { Locale } from "@/i18n/routing";
import { pick } from "@/lib/i18n";
import { instagramUrl } from "./nav-items";

/** schema.org HairSalon so search engines can show the studio, its prices and its Instagram. */
export function StructuredData({ settings, menu, locale }: { settings: SiteSettings; menu: MenuCategory[]; locale: Locale }) {
  const base = process.env.SITE_URL ?? "";
  const prices = menu.flatMap((c) => c.services.map((s) => s.priceFrom)).filter((p) => p > 0);
  const data = {
    "@context": "https://schema.org",
    "@type": "HairSalon",
    name: "Style Wincester",
    url: `${base}${locale === "ru" ? "/ru" : "/"}`,
    image: `${base}/media/photo/dark-chocolate.webp`,
    logo: `${base}/icon.png`,
    address: { "@type": "PostalAddress", addressLocality: "Chișinău", addressCountry: "MD", streetAddress: pick(settings, "address", locale) },
    ...(settings.phone && { telephone: settings.phone }),
    ...(settings.email && { email: settings.email }),
    ...(prices.length && { priceRange: `${Math.min(...prices)}–${Math.max(...prices)} MDL` }),
    sameAs: [instagramUrl(settings.instagram)],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servicii",
      itemListElement: menu.map((c) => ({
        "@type": "OfferCatalog",
        name: pick(c, "name", locale),
        itemListElement: c.services.map((s) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: pick(s, "name", locale) },
          price: s.priceFrom,
          priceCurrency: "MDL",
        })),
      })),
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
