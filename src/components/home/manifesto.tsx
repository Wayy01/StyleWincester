import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { ScrubWords } from "@/components/motion/scrub-words";
import { DrawOnScroll } from "@/components/motion/draw";
import { Parallax } from "@/components/motion/reveal";
import { InkUnderline } from "@/components/ink/strokes";
import { HairStrands } from "@/components/ink/strands";

export async function Manifesto() {
  const t = await getTranslations("home");
  return (
    <section className="paper relative overflow-hidden px-gutter py-28 sm:py-40">
      <DrawOnScroll scrub start="top 80%" end="bottom 20%" className="pointer-events-none absolute -right-8 top-0 h-full text-ink/25 max-md:hidden">
        <HairStrands className="h-full w-auto" seed={12} count={40} sway={80} />
      </DrawOnScroll>

      <div className="relative mx-auto grid max-w-[88rem] gap-12 lg:grid-cols-[14rem_1fr]">
        <div className="flex gap-6 lg:flex-col">
          <p className="label text-muted">{t("manifestoLabel")}</p>
          <Parallax amount={10} className="hidden aspect-[3/4] w-40 rotate-[-3deg] lg:block">
            <Image src="/media/photo/film-sky.webp" alt="" width={400} height={530} className="h-full w-full object-cover" sizes="160px" />
          </Parallax>
        </div>
        <div>
          <ScrubWords className="display-wide text-[clamp(2.1rem,4.6vw,4.6rem)] leading-[1.04]">
            {t.rich("manifesto", {
              mark: (chunks) => (
                <span className="relative inline-block italic text-oxblood">
                  {chunks}
                  <DrawOnScroll as="span" start="top 70%" duration={1.2} className="absolute block -bottom-[0.12em] left-0 w-full text-oxblood-2">
                    <InkUnderline className="h-[0.3em] w-full" strokeWidth={4} />
                  </DrawOnScroll>
                </span>
              ),
            })}
          </ScrubWords>
          <p className="hand mt-10 text-3xl text-muted">{t("manifestoSign")}</p>
        </div>
      </div>
    </section>
  );
}
