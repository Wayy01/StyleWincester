import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { getSettings } from "@/lib/data";
import { pick } from "@/lib/i18n";
import { fontVariables } from "../fonts";
import { InkDefs } from "@/components/ink/defs";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { TransitionProvider } from "@/components/motion/transition";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Announcement } from "@/components/site/announcement";
import { Preloader, INTRO_SCRIPT } from "@/components/site/preloader";
import "../globals.css";

// Nothing is prerendered at build time, so `next build` needs no database. Each page renders on its
// first visit, then is cached until the admin changes content (revalidatePath) or the hour runs out.
export function generateStaticParams() {
  return [];
}
export const revalidate = 3600;

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3260"),
    title: { default: t("title"), template: "%s — Style Wincester" },
    description: t("description"),
    openGraph: {
      siteName: "Style Wincester",
      type: "website",
      locale: locale === "ru" ? "ru_MD" : "ro_MD",
      images: ["/media/photo/dark-chocolate.webp"],
    },
    alternates: { languages: { ro: "/", ru: "/ru" } },
  };
}

export const viewport: Viewport = {
  themeColor: "#15110e",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const settings = await getSettings();
  const t = await getTranslations({ locale, namespace: "nav" });
  const announcement = pick(settings, "announcement", locale);
  const hours = settings.hours.map((h) => ({ days: pick(h, "days", locale), time: h.time }));

  return (
    <html
      lang={locale}
      className={fontVariables}
      style={announcement ? ({ "--announce-h": "2rem" } as React.CSSProperties) : undefined}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
      </head>
      <body className="min-h-dvh antialiased">
        <NextIntlClientProvider>
          <TransitionProvider>
            <InkDefs />
            <SmoothScroll />
            <a href="#main" className="label sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:bg-bone focus:p-3">
              {t("skip")}
            </a>
            <Preloader />
            <Announcement text={announcement} />
            <Header instagram={settings.instagram} hours={hours} />
            <main id="main">{children}</main>
            <Footer settings={settings} locale={locale} />
            <div className="grain" aria-hidden />
          </TransitionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
