"use client";

import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { TransitionLink } from "@/components/motion/transition";
import { cn } from "@/lib/utils";

export function LocaleSwitch({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  return (
    <div className={cn("label flex items-center gap-1.5", className)}>
      {routing.locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1.5">
          {i > 0 && <span className="opacity-40">/</span>}
          <TransitionLink
            href={pathname}
            locale={l}
            label={l === "ro" ? "Română" : "Русский"}
            aria-current={l === locale ? "true" : undefined}
            className={cn("transition-opacity hover:opacity-100", l === locale ? "opacity-100 underline underline-offset-4" : "opacity-50")}
          >
            {l.toUpperCase()}
          </TransitionLink>
        </span>
      ))}
    </div>
  );
}
