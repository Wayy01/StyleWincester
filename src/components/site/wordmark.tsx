import { cn } from "@/lib/utils";

/**
 * The studio's lockup: STYLE set plain, WINCESTER knocked out of a solid bar.
 * `knockout` is the text colour inside the bar; inside a mix-blend-difference header use black so
 * the page shows through.
 */
export function Wordmark({ className, knockout = "text-bone" }: { className?: string; knockout?: string }) {
  return (
    <span
      className={cn("inline-flex items-center gap-[0.4em] font-mono font-semibold uppercase leading-none tracking-[0.04em]", className)}
      style={{ fontVariationSettings: '"wdth" 75' }}
    >
      <span>Style</span>
      <span className="bg-current px-[0.42em] pb-[0.26em] pt-[0.3em]">
        <span className={knockout}>Wincester</span>
      </span>
    </span>
  );
}
