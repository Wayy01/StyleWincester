import { mulberry32, r2 } from "./random";

/** An ink blot with satellite droplets. Shape is generated from a seed so every blot differs. */
export function InkSplat({ className, seed = 3, drops = 7 }: { className?: string; seed?: number; drops?: number }) {
  const rand = mulberry32(seed);
  const points = 22;
  const body = Array.from({ length: points }, (_, i) => {
    const a = (i / points) * Math.PI * 2;
    const r = 58 + rand() * 18 + (i % 5 === 0 ? rand() * 22 : 0);
    return [100 + Math.cos(a) * r, 100 + Math.sin(a) * r] as const;
  });
  // Catmull-Rom → cubic Bézier for a smooth, blobby outline.
  let d = `M${r2(body[0][0])} ${r2(body[0][1])}`;
  for (let i = 0; i < points; i++) {
    const p0 = body[(i - 1 + points) % points];
    const p1 = body[i];
    const p2 = body[(i + 1) % points];
    const p3 = body[(i + 2) % points];
    d += ` C${r2(p1[0] + (p2[0] - p0[0]) / 6)} ${r2(p1[1] + (p2[1] - p0[1]) / 6)} ${r2(p2[0] - (p3[0] - p1[0]) / 6)} ${r2(p2[1] - (p3[1] - p1[1]) / 6)} ${r2(p2[0])} ${r2(p2[1])}`;
  }
  const dots = Array.from({ length: drops }, () => {
    const a = rand() * Math.PI * 2;
    const dist = 92 + rand() * 60;
    return { cx: r2(100 + Math.cos(a) * dist), cy: r2(100 + Math.sin(a) * dist), r: r2(2 + rand() * 7) };
  });
  return (
    <svg viewBox="-60 -60 320 320" className={className} aria-hidden>
      <g fill="currentColor" filter="url(#ink-bleed)">
        <path d={`${d} Z`} />
        {dots.map((c, i) => (
          <circle key={i} {...c} />
        ))}
      </g>
    </svg>
  );
}
