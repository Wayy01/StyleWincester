import { getTranslations } from "next-intl/server";
import { SplitReveal } from "@/components/motion/split-reveal";
import { DrawOnScroll } from "@/components/motion/draw";
import { Reveal } from "@/components/motion/reveal";
import { InkIcon, type InkIconName } from "@/components/ink/icons";

const STEPS: { n: 1 | 2 | 3 | 4; icon: InkIconName }[] = [
  { n: 1, icon: "mirror" },
  { n: 2, icon: "care" },
  { n: 3, icon: "cut" },
  { n: 4, icon: "comb" },
];

export async function Process() {
  const t = await getTranslations("home");
  const tp = await getTranslations("process");
  return (
    <section className="relative bg-bone px-gutter py-24 sm:py-36">
      <div className="mx-auto max-w-[88rem]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label text-muted">{t("processLabel")}</p>
            <SplitReveal as="h2" className="display mt-5 text-[clamp(3.4rem,7vw,7rem)]">
              {t("processTitle")}
            </SplitReveal>
          </div>
        </div>

        <DrawOnScroll scrub start="top 75%" end="bottom 60%" className="relative mt-16 hidden h-6 text-ink/40 lg:block">
          <svg viewBox="0 0 1000 24" preserveAspectRatio="none" className="h-full w-full overflow-visible" aria-hidden>
            <path data-draw d="M0 12 C 120 2, 240 22, 360 12 S 600 2, 720 12 S 900 22, 1000 10" fill="none" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 6" />
          </svg>
        </DrawOnScroll>

        <Reveal className="mt-10 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:mt-6 lg:grid-cols-4">
          {STEPS.map((s) => (
            <article data-reveal key={s.n} className="relative">
              <div className="flex items-start justify-between border-t border-ink pt-5">
                <span className="display text-[5.5rem] leading-[0.8] text-ink/90">{String(s.n).padStart(2, "0")}</span>
                <DrawOnScroll className="text-oxblood" duration={1.4}>
                  <InkIcon name={s.icon} className="size-14" strokeWidth={1.3} />
                </DrawOnScroll>
              </div>
              <h3 className="display-wide mt-6 text-[1.8rem] italic">{tp(`s${s.n}Title`)}</h3>
              <p className="mt-3 text-[0.98rem] leading-relaxed text-muted">{tp(`s${s.n}Text`)}</p>
            </article>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
