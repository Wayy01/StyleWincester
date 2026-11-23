import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { SplitReveal } from "@/components/motion/split-reveal";
import { Reveal } from "@/components/motion/reveal";
import { Marquee } from "@/components/motion/marquee";
import { InkSplat } from "@/components/ink/splat";

export async function Press({ credits }: { credits: string[] }) {
  const t = await getTranslations("home");
  return (
    <section className="paper relative overflow-hidden py-24 sm:py-36">
      <div className="mx-auto grid max-w-[88rem] items-center gap-16 px-gutter lg:grid-cols-2">
        <div className="relative mx-auto w-full max-w-[26rem]">
          <InkSplat className="absolute -left-24 -top-20 size-72 text-oxblood/90" seed={17} />
          <Reveal>
            <figure data-reveal className="relative rotate-[-4deg] bg-bone p-3 shadow-[0_30px_60px_-25px_rgba(21,17,14,0.55)]">
              <Image src="/media/photo/selin-cover.webp" alt="Selin Magazine — Joan of Arc" width={491} height={640} sizes="(min-width: 1024px) 26rem, 80vw" className="w-full" />
              <span className="absolute -top-3 left-1/2 h-7 w-24 -translate-x-1/2 rotate-2 bg-bone-3/80" aria-hidden />
              <figcaption className="label mt-3 flex justify-between text-muted">
                <span>Selin Magazine</span>
                <span>Amsterdam</span>
              </figcaption>
            </figure>
          </Reveal>
          <p className="hand absolute -bottom-10 right-0 rotate-[-8deg] text-3xl text-oxblood-2 sm:-right-16">Joan of Arc</p>
        </div>

        <div>
          <p className="label text-muted">{t("pressLabel")}</p>
          <SplitReveal as="h2" className="display mt-5 text-[clamp(4rem,9vw,9rem)] italic">
            {t("pressTitle")}
          </SplitReveal>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ink-3">{t("pressBody")}</p>
          {credits.length > 0 && <p className="label mt-10 text-muted">{t("pressCredits")}</p>}
        </div>
      </div>
      {credits.length > 0 && (
      <Marquee className="mt-6 border-y border-[var(--line)] py-5" speed={50}>
        {credits.map((c) => (
          <span key={c} className="display-wide flex items-center gap-8 pr-8 text-[clamp(1.8rem,3.4vw,3rem)] italic text-ink/80">
            {c} <span className="text-base not-italic text-oxblood">✶</span>
          </span>
        ))}
      </Marquee>
      )}
    </section>
  );
}
