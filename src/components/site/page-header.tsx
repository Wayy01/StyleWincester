import type { ReactNode } from "react";
import { SplitReveal } from "@/components/motion/split-reveal";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

type Props = { kicker: string; title: string; lead?: string; aside?: ReactNode; className?: string; dark?: boolean };

/** Opening block shared by inner pages: tiny mono kicker, huge condensed title, short lead. */
export function PageHeader({ kicker, title, lead, aside, className, dark }: Props) {
  return (
    <header data-header={dark ? "dark" : undefined} className={cn("relative px-gutter pb-16 pt-[calc(var(--header-h)+4rem)] sm:pb-24 sm:pt-[calc(var(--header-h)+6rem)]", dark ? "bg-ink text-bone" : "paper", className)}>
      <div className="mx-auto grid max-w-[88rem] items-end gap-10 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div>
          <p className={cn("label", dark ? "text-muted-2" : "text-muted")}>{kicker}</p>
          <SplitReveal as="h1" immediate className="display mt-5 text-[clamp(4.6rem,14vw,14rem)]">
            {title}
          </SplitReveal>
          {lead && (
            <Reveal>
              <p data-reveal className={cn("mt-8 max-w-xl text-lg leading-relaxed", dark ? "text-bone/70" : "text-ink-3")}>
                {lead}
              </p>
            </Reveal>
          )}
        </div>
        {aside}
      </div>
    </header>
  );
}
