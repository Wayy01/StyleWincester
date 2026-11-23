import type { Service } from "@/db/schema";
import type { Locale } from "@/i18n/routing";
import { formatDuration, formatPrice } from "@/lib/format";
import { pick } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** One line of the printed menu: name … dotted leader … price, with the note and duration underneath. */
export function PriceRow({ service, locale, featuredLabel, className }: { service: Service; locale: Locale; featuredLabel?: string; className?: string }) {
  const note = pick(service, "note", locale);
  return (
    <div className={cn("group py-4", className)}>
      <div className="flex items-baseline gap-3">
        <h4 className="text-[1.12rem] leading-snug transition-colors duration-300 group-hover:text-oxblood sm:text-[1.25rem]">
          {pick(service, "name", locale)}
          {featuredLabel && service.featured && (
            <span className="hand ml-2 inline-block -rotate-3 text-[1.05rem] text-oxblood-2">{featuredLabel}</span>
          )}
        </h4>
        <span className="leader" aria-hidden />
        <span className="shrink-0 whitespace-nowrap font-display text-[1.25rem] tabular-nums sm:text-[1.4rem]" style={{ fontVariationSettings: '"wdth" 80' }}>
          {formatPrice(service, locale)}
        </span>
      </div>
      <p className="mt-1 flex flex-wrap gap-x-3 text-sm text-muted">
        {note && <span>{note}</span>}
        <span className="label self-center text-muted-2">{formatDuration(service.durationMin, locale)}</span>
      </p>
    </div>
  );
}
