import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getCollabs, getMenu, getPalette, getPosts, getSettings, getTestimonials, getWorks } from "@/lib/data";
import { pick } from "@/lib/i18n";
import { Hero } from "@/components/home/hero";
import { Manifesto } from "@/components/home/manifesto";
import { ServicesTeaser } from "@/components/home/services-teaser";
import { FilmStrip } from "@/components/home/film-strip";
import { Palette } from "@/components/home/palette";
import { Press } from "@/components/home/press";
import { Process } from "@/components/home/process";
import { JournalTeaser } from "@/components/home/journal-teaser";
import { Reviews } from "@/components/home/reviews";
import { StructuredData } from "@/components/site/structured-data";
import { Marquee } from "@/components/motion/marquee";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tc = await getTranslations("common");
  const [settings, menu, works, posts, reviews, collabs, palette] = await Promise.all([
    getSettings(),
    getMenu(),
    getWorks(),
    getPosts(),
    getTestimonials(),
    getCollabs(),
    getPalette(),
  ]);

  // Featured videos fill the film strip; with none featured, every video does.
  const videos = works.filter((w) => w.kind === "video");
  const featuredVideos = videos.filter((w) => w.featured);
  const frames = (featuredVideos.length ? featuredVideos : videos).map((w) => ({
      id: w.id,
      src: w.src,
      poster: w.poster,
      title: pick(w, "title", locale),
      caption: pick(w, "caption", locale),
      ratio: w.width && w.height ? `${w.width} / ${w.height}` : "9 / 16",
    }));

  return (
    <>
      <StructuredData settings={settings} menu={menu} locale={locale} />
      <Hero video={settings.heroVideo} poster={settings.heroPoster} instagram={settings.instagram} />
      <Manifesto />
      <Marquee className="border-y border-[var(--line)] bg-bone py-6" speed={60}>
        {tc("specialties")
          .split("·")
          .concat(["Shag", "Bob & Pixie", "Dark Chocolate", "Men Blonde"])
          .map((w) => (
            <span key={w} className="display flex items-center gap-10 pr-10 text-[clamp(3rem,7vw,6.5rem)] italic">
              {w.trim()} <span className="text-[0.4em] not-italic text-oxblood">✶</span>
            </span>
          ))}
      </Marquee>
      <ServicesTeaser menu={menu} />
      {frames.length > 0 && <FilmStrip frames={frames} label={t("filmLabel")} title={t("filmTitle")} lead={t("filmLead")} />}
      <Palette
        swatches={palette.map((p) => ({
          id: p.id,
          name: pick(p, "name", locale),
          note: pick(p, "note", locale),
          color: p.color,
          photo: p.photo,
          width: p.photoWidth,
          height: p.photoHeight,
        }))}
      />
      <Press credits={collabs.map((c) => c.name)} />
      <Process />
      <Reviews items={reviews} locale={locale} />
      <JournalTeaser posts={posts} />
    </>
  );
}
