import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getWorks } from "@/lib/data";
import { pick } from "@/lib/i18n";
import { PageHeader } from "@/components/site/page-header";
import { Gallery } from "@/components/work/gallery";
import { HairStrands } from "@/components/ink/strands";
import { DrawOnScroll } from "@/components/motion/draw";

export async function generateMetadata({ params }: PageProps<"/[locale]/work">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("work"), description: t("workDescription") };
}

export default async function WorkPage({ params }: PageProps<"/[locale]/work">) {
  const { locale } = (await params) as { locale: Locale };
  setRequestLocale(locale);
  const t = await getTranslations("work");
  const works = await getWorks();

  const items = works.map((w) => ({
    id: w.id,
    tag: w.tag,
    kind: w.kind,
    src: w.src,
    poster: w.poster,
    width: w.width ?? 4,
    height: w.height ?? 5,
    title: pick(w, "title", locale),
    caption: pick(w, "caption", locale),
    credit: w.credit,
  }));

  return (
    <>
      <PageHeader
        kicker={t("kicker")}
        title={t("title")}
        lead={t("lead")}
        aside={
          <div className="flex items-end gap-6">
            <p className="label text-muted">{t("count", { n: items.length })}</p>
            <DrawOnScroll className="hidden h-56 text-oxblood/70 lg:block" stagger={0.02} duration={2}>
              <HairStrands className="h-full w-auto" seed={31} count={22} sway={50} />
            </DrawOnScroll>
          </div>
        }
      />
      <section className="bg-bone px-gutter pb-28">
        <div className="mx-auto max-w-[88rem]">
          <Gallery items={items} />
        </div>
      </section>
    </>
  );
}
