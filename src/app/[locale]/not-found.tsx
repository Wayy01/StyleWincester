import { getTranslations } from "next-intl/server";
import { TransitionLink } from "@/components/motion/transition";
import { InkSplat } from "@/components/ink/splat";
import { Scissors } from "@/components/ink/scissors";
import { DrawOnScroll } from "@/components/motion/draw";

export default async function NotFound() {
  const t = await getTranslations("notFound");
  return (
    <section className="paper relative grid min-h-svh place-items-center overflow-hidden px-gutter py-32 text-center">
      <InkSplat className="absolute left-1/2 top-1/2 size-[70vmin] -translate-x-1/2 -translate-y-1/2 text-oxblood/15" seed={404} />
      <div className="relative">
        <DrawOnScroll className="mx-auto w-40 text-ink" start="top 100%">
          <Scissors className="h-auto w-full" />
        </DrawOnScroll>
        <p className="label mt-6 text-muted">404</p>
        <h1 className="display mt-4 text-[clamp(5rem,16vw,14rem)] italic">{t("title")}</h1>
        <p className="mx-auto mt-6 max-w-sm text-muted">{t("body")}</p>
        <TransitionLink href="/" className="label mt-10 inline-block border-b border-ink pb-1">
          {t("cta")}
        </TransitionLink>
      </div>
    </section>
  );
}
