/** Four line-drawn portraits showing where each hair length ends: chin, shoulders, shoulder blades, below. */
const LENGTHS = [52, 72, 96, 118];

function hairSides(end: number) {
  // Longer hair falls slightly outward over the shoulders; short hair tucks in at the jaw.
  const flare = end > 66 ? 7 : 0;
  const mid = 40 + (end - 40) * 0.5;
  const right = `M55 38 C57 ${mid} ${58 + flare} ${end - 10} ${56 + flare} ${end}`;
  const left = `M25 38 C23 ${mid} ${22 - flare} ${end - 10} ${24 - flare} ${end}`;
  const tipR = end > 66 ? `M${56 + flare} ${end} C${53 + flare} ${end + 2} ${51 + flare} ${end} ${50 + flare} ${end - 3}` : `M56 ${end} C53 ${end + 1} 51 ${end - 1} 50 ${end - 4}`;
  const tipL = end > 66 ? `M${24 - flare} ${end} C${27 - flare} ${end + 2} ${29 - flare} ${end} ${30 - flare} ${end - 3}` : `M24 ${end} C27 ${end + 1} 29 ${end - 1} 30 ${end - 4}`;
  // Two inner strands per side give the line some texture.
  const strandR = `M52 30 C55 ${mid} ${55 + flare / 2} ${end - 14} ${53 + flare} ${end - 4}`;
  const strandL = `M28 30 C25 ${mid} ${25 - flare / 2} ${end - 14} ${27 - flare} ${end - 4}`;
  return [right, left, tipR, tipL, strandR, strandL];
}

export function LengthFigures({ labels }: { labels: { name: string; note: string }[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-4">
      {LENGTHS.map((end, i) => (
        <figure key={end} className="flex flex-col items-center text-center">
          <svg viewBox="0 0 80 130" fill="none" className="h-40 w-auto overflow-visible" aria-hidden>
            <g strokeLinecap="round" strokeLinejoin="round" filter="url(#ink-rough)">
              <g stroke="var(--color-ink)" strokeWidth="1.1">
                {/* face, neck, shoulders */}
                <path data-draw d="M40 19c-7.5 0-13 7-13 16.5C27 46 33 54 40 54s13-8 13-18.5C53 26 47.5 19 40 19z" />
                <path data-draw d="M35.5 53.5V64M44.5 53.5V64" />
                <path data-draw d="M35.5 64C24 66 13 71 8 86M44.5 64C56 66 67 71 72 86" />
              </g>
              <g stroke="var(--color-oxblood)" strokeWidth="1.3">
                {/* crown and parting */}
                <path data-draw d="M25 38C23 22 31 11 40 11s17 11 15 27" />
                <path data-draw d="M40 11c-3 5-8 9-13 12M40 11c4 5 9 8 13 11" />
                {hairSides(end).map((d, k) => (
                  <path key={k} data-draw d={d} strokeWidth={k > 3 ? 0.7 : 1.3} strokeOpacity={k > 3 ? 0.6 : 1} />
                ))}
              </g>
              {/* where this length ends */}
              <path data-draw d={`M4 ${end + 4}H76`} stroke="var(--color-muted)" strokeWidth="0.8" strokeDasharray="1.5 3.5" />
            </g>
          </svg>
          <figcaption className="mt-4">
            <span className="display-wide block text-xl italic">{labels[i].name}</span>
            <span className="label text-muted">{labels[i].note}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
