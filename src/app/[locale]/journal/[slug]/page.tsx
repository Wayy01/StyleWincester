import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { marked } from "marked";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import type { Locale } from "@/i18n/routing";
import { getPost } from "@/lib/data";
import { pick } from "@/lib/i18n";
import { formatDate } from "@/lib/format";
import { SplitReveal } from "@/components/motion/split-reveal";
import { ClipReveal, Reveal } from "@/components/motion/reveal";
import { InViewVideo } from "@/components/motion/video";
import { TransitionLink } from "@/components/motion/transition";
import { PostCard } from "@/components/journal/post-card";
import { ReadingProgress } from "@/components/journal/reading-progress";

export async function generateMetadata({ params }: PageProps<"/[locale]/journal/[slug]">): Promise<Metadata> {
  const { locale, slug } = (await params) as { locale: Locale; slug: string };
  const data = await getPost(slug);
  if (!data) return {};
  return {
    title: pick(data.post, "title", locale),
    description: pick(data.post, "excerpt", locale),
    openGraph: data.post.cover ? { images: [data.post.cover] } : undefined,
  };
}

export default async function ArticlePage({ params }: PageProps<"/[locale]/journal/[slug]">) {
  const { locale, slug } = (await params) as { locale: Locale; slug: string };
  setRequestLocale(locale);
  const data = await getPost(slug);
  if (!data) notFound();
  const { post, related } = data;
  const t = await getTranslations("journal");
  const tc = await getTranslations("common");
  // Bodies are written by the studio in the admin, so the markdown is trusted.
  const html = await marked.parse(pick(post, "body", locale));

  return (
    <article data-article>
      <ReadingProgress />
      <header className="paper px-gutter pb-14 pt-[calc(var(--header-h)+3.5rem)] sm:pt-[calc(var(--header-h)+5rem)]">
        <div className="mx-auto max-w-[62rem]">
          <TransitionLink href="/journal" label={t("title")} className="label inline-flex items-center gap-2 text-muted hover:text-ink">
            <ArrowLeft weight="light" /> {t("back")}
          </TransitionLink>
          <div className="mt-10 flex flex-wrap items-center gap-3 text-muted">
            <span className="label bg-ink px-2 py-1 text-bone">{pick(post, "topic", locale)}</span>
            <span className="label">{post.publishedAt ? formatDate(post.publishedAt, locale) : ""}</span>
            <span className="h-px w-6 bg-current opacity-40" />
            <span className="label">{tc("minutesRead", { n: post.readingMin })}</span>
          </div>
          <SplitReveal as="h1" immediate className="display-wide mt-6 text-[clamp(2.8rem,7vw,6.4rem)]">
            {pick(post, "title", locale)}
          </SplitReveal>
          <Reveal>
            <p data-reveal className="mt-8 max-w-2xl text-xl leading-relaxed text-ink-3">
              {pick(post, "excerpt", locale)}
            </p>
          </Reveal>
        </div>
      </header>

      {(post.video || post.cover) && (
        <div className="bg-bone px-gutter">
          <ClipReveal className="mx-auto aspect-[16/9] max-w-[88rem] bg-ink">
            {post.video ? (
              <InViewVideo src={post.video} poster={post.cover} eager />
            ) : (
              <Image src={post.cover!} alt="" width={1600} height={900} sizes="100vw" className="h-full w-full object-cover" priority />
            )}
          </ClipReveal>
        </div>
      )}

      <div className="bg-bone px-gutter py-20 sm:py-28">
        <div className="prose-ink mx-auto max-w-[40rem]" dangerouslySetInnerHTML={{ __html: html }} />
      </div>

      {related.length > 0 && (
        <section className="border-t border-[var(--line)] bg-bone px-gutter py-24">
          <div className="mx-auto max-w-[88rem]">
            <h2 className="display text-[clamp(3rem,6vw,5.5rem)]">{t("related")}</h2>
            <Reveal className="mt-12 grid gap-12 sm:grid-cols-2">
              {related.map((p) => (
                <div data-reveal key={p.id}>
                  <PostCard post={p} locale={locale} readLabel={tc("minutesRead", { n: p.readingMin })} />
                </div>
              ))}
            </Reveal>
          </div>
        </section>
      )}
    </article>
  );
}
