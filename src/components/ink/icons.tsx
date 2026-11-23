import { cn } from "@/lib/utils";

export type InkIconName = "cut" | "color" | "care" | "comb" | "mirror" | "spark";

const PATHS: Record<InkIconName, string[]> = {
  cut: [
    "M9 31a4.5 4.5 0 1 0 0.1 0z",
    "M18 35a4.5 4.5 0 1 0 0.1 0z",
    "M12.5 28.5 34 7",
    "M20 31 36 13.5",
    "M17 26.5l2.6 2.4",
  ],
  color: [
    "M5 25c0 6 7 10.5 15 10.5S35 31 35 25",
    "M4 25h32",
    "M23 22 33.5 5.5c.8-1.2 2.4-.6 2 .8L28.5 23",
    "M9.5 29.5c3 1.6 7 2.3 11 2.2",
  ],
  care: [
    "M20 4c5.5 8 10.5 13.8 10.5 20a10.5 10.5 0 0 1-21 0C9.5 17.8 14.5 12 20 4z",
    "M15 25.5c0 3.2 2.2 5.6 5.2 6",
  ],
  comb: ["M4 14.5h32v6.5H4z", "M7 21v12M11 21v12M15 21v12M19 21v12M23 21v12M27 21v9M31 21v9M35 21v7"],
  mirror: ["M20 3.5c6 0 10.5 5.2 10.5 11.6S26 26.7 20 26.7 9.5 21.5 9.5 15.1 14 3.5 20 3.5z", "M20 26.7V36.5", "M14.5 36.5h11", "M15 10c1.4-2 3.2-3 5.4-3.2"],
  spark: ["M20 4v32", "M4 20h32", "M9 9l22 22", "M31 9 9 31"],
};

/** Hand-inked icon set for service categories. Rough filter keeps the line from looking vector-perfect. */
export function InkIcon({ name, className, strokeWidth = 1.5 }: { name: InkIconName; className?: string; strokeWidth?: number }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={cn("size-10", className)} aria-hidden>
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" filter="url(#ink-rough)">
        {PATHS[name].map((d, i) => (
          <path key={i} data-draw d={d} />
        ))}
      </g>
    </svg>
  );
}

export const CATEGORY_ICON: Record<string, InkIconName> = {
  tunsori: "cut",
  culoare: "color",
  ingrijire: "care",
  pachete: "comb",
};
