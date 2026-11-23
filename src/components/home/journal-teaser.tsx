import { getLocale, getTranslations } from "next-intl/server";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import type { Post } from "@/db/schema";
import type { Locale } from "@/i18n/routing";
import { SplitReveal } from "@/components/motion/split-reveal";
import { Reveal } from "@/components/motion/reveal";
import { TransitionLink } from "@/components/motion/transition";
import { PostCard } from "@/components/journal/post-card";

export async function JournalTeaser({ posts }: { posts: Post[] }) {
  if (!posts.length) return null;
  const t = await getTranslations("home");
  const tc = await getTranslations("common");
  const tj = await getTranslations("journal");
  const locale = (await getLocale()) as Locale;
  const [lead, ...rest] = posts.slice(0, 3);

  return (
    <section className="border-t border-[var(--line)] bg-bone px-gutter py-24 sm:py-36">
      <div className="mx-auto max-w-[88rem]">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="label text-muted">{t("journalLabel")}</p>
            <SplitReveal as="h2" className="display mt-5 text-[clamp(3.4rem,7vw,7rem)]">
              {t("journalTitle")}
            </SplitReveal>
          </div>
          <TransitionLink href="/journal" label={tj("title")} className="group hidden items-center gap-3 border-b border-ink pb-1.5 sm:inline-flex">
            <span className="label">{tc("seeAll")}</span>
            <ArrowUpRight weight="light" className="transition-transform duration-500 group-hover:rotate-45" />
          </TransitionLink>
        </div>
        <Reveal className="mt-14 grid gap-14 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-10">
          <div data-reveal>
            <PostCard post={lead} locale={locale} size="lg" readLabel={tc("minutesRead", { n: lead.readingMin })} />
          </div>
          <div className="grid gap-14 sm:grid-cols-2 lg:grid-cols-1 lg:gap-10">
            {rest.map((p) => (
              <div data-reveal key={p.id} className="lg:[&_.aspect-\[4\/5\]]:aspect-[16/10]">
                <PostCard post={p} locale={locale} readLabel={tc("minutesRead", { n: p.readingMin })} />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
