import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getPosts } from "@/lib/data";
import { PageHeader } from "@/components/site/page-header";
import { PostCard } from "@/components/journal/post-card";
import { Reveal } from "@/components/motion/reveal";

export async function generateMetadata({ params }: PageProps<"/[locale]/journal">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("journal"), description: t("journalDescription") };
}

export default async function JournalPage({ params }: PageProps<"/[locale]/journal">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const t = await getTranslations("journal");
  const tc = await getTranslations("common");
  const posts = await getPosts();
  const [lead, ...rest] = posts;

  return (
    <>
      <PageHeader kicker={t("kicker")} title={t("title")} lead={t("lead")} />
      <section className="bg-bone px-gutter pb-28 pt-4">
        <div className="mx-auto max-w-[88rem]">
          {!lead && <p className="py-20 text-center text-muted">{t("empty")}</p>}
          {lead && (
            <Reveal>
              <p data-reveal className="label mb-5 text-muted">
                {t("latest")}
              </p>
              <div data-reveal>
                <PostCard post={lead} locale={locale} size="lg" readLabel={tc("minutesRead", { n: lead.readingMin })} />
              </div>
            </Reveal>
          )}
          {rest.length > 0 && (
            <Reveal className="mt-24 grid gap-x-8 gap-y-16 border-t border-[var(--line)] pt-16 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((p) => (
                <div data-reveal key={p.id}>
                  <PostCard post={p} locale={locale} readLabel={tc("minutesRead", { n: p.readingMin })} />
                </div>
              ))}
            </Reveal>
          )}
        </div>
      </section>
    </>
  );
}
