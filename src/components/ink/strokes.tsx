import { cn } from "@/lib/utils";

type Props = { className?: string; strokeWidth?: number };

/** Hand-drawn marks. Each path carries `data-draw` so a parent can animate it with DrawSVG. */

export function InkUnderline({ className, strokeWidth = 3 }: Props) {
  return (
    <svg viewBox="0 0 300 24" fill="none" preserveAspectRatio="none" className={cn("overflow-visible", className)} aria-hidden>
      <path
        data-draw
        d="M3 15.5c38-5.6 88-9.8 141-9.4 47 .4 92 3.6 128 7.2 9 .9 17 1.9 24 2.9M48 19.8c46-3.1 106-3.9 166-1.4"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        filter="url(#ink-rough)"
      />
    </svg>
  );
}

export function InkCircle({ className, strokeWidth = 2 }: Props) {
  return (
    <svg viewBox="0 0 220 90" fill="none" preserveAspectRatio="none" className={cn("overflow-visible", className)} aria-hidden>
      <path
        data-draw
        d="M156 12c-30-8-84-6-118 8C10 31 1 49 14 63c18 19 82 25 132 18 40-6 70-22 68-41-2-17-31-29-72-32-25-2-50 0-68 4"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        filter="url(#ink-rough)"
      />
    </svg>
  );
}

export function InkArrow({ className, strokeWidth = 1.6 }: Props) {
  return (
    <svg viewBox="0 0 120 90" fill="none" className={cn("overflow-visible", className)} aria-hidden>
      <path
        data-draw
        d="M6 8c22 2 52 12 70 32 12 13 18 27 21 40M84 70l13 12 10-17"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#ink-rough)"
      />
    </svg>
  );
}

/** A thick dry-brush swash, filled rather than stroked so it has a tapered body. */
export function BrushSwash({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 80" preserveAspectRatio="none" className={className} aria-hidden>
      <path
        d="M6 46C70 26 160 14 262 13c104-1 200 6 292 17 18 2 34 6 40 12 4 5-2 10-14 11-96-6-198-8-296-6-96 2-190 8-270 13-10 1-14-3-4-14z"
        fill="currentColor"
        filter="url(#ink-brush)"
      />
    </svg>
  );
}
