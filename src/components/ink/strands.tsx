import { mulberry32, r2 } from "./random";

type Props = {
  className?: string;
  seed?: number;
  count?: number;
  /** Sideways sway of the lock, in viewBox units. */
  sway?: number;
};

/**
 * A lock of hair drawn as dozens of pen strokes. Each strand is a cubic S-curve that fans out from a
 * shared root, so the whole thing reads as one flowing lock. Paths carry `data-strand` for DrawSVG.
 */
export function HairStrands({ className, seed = 7, count = 34, sway = 70 }: Props) {
  const rand = mulberry32(seed);
  const strands = Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1);
    const x0 = 120 + (t - 0.5) * 34 + (rand() - 0.5) * 6;
    const spread = (t - 0.5) * 120;
    const c1x = x0 + sway * 0.9 + spread * 0.25 + (rand() - 0.5) * 20;
    const c1y = 170 + rand() * 40;
    const c2x = x0 - sway * 0.8 + spread * 0.6 + (rand() - 0.5) * 24;
    const c2y = 330 + rand() * 50;
    const x1 = x0 + spread * 0.9 + (rand() - 0.5) * 18;
    const y1 = 470 + rand() * 30;
    const c3x = x1 + sway * 0.7 + spread * 0.4 + (rand() - 0.5) * 30;
    const c3y = 590 + rand() * 40;
    const x2 = x1 + sway * 0.25 + spread * 0.5 + (rand() - 0.5) * 40;
    const y2 = 660 + rand() * 90;
    const d = `M${r2(x0)} 0 C${r2(c1x)} ${r2(c1y)} ${r2(c2x)} ${r2(c2y)} ${r2(x1)} ${r2(y1)} S${r2(c3x)} ${r2(c3y)} ${r2(x2)} ${r2(y2)}`;
    return { d, w: r2(0.5 + rand() * 1.3), o: r2(0.45 + rand() * 0.55) };
  });
  return (
    <svg viewBox="0 0 240 760" fill="none" className={className} aria-hidden>
      <g stroke="currentColor" strokeLinecap="round" filter="url(#ink-rough)">
        {strands.map((s, i) => (
          <path key={i} data-strand d={s.d} strokeWidth={s.w} strokeOpacity={s.o} />
        ))}
      </g>
    </svg>
  );
}
