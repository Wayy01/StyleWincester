/** Open shears in a single-weight pen line. Paths carry `data-draw`. */
export function Scissors({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 240" fill="none" className={className} aria-hidden>
      <g stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" filter="url(#ink-rough)">
        {/* upper blade */}
        <path data-draw d="M112 118 L226 34 C229 32 230 35 228 37 L124 128" />
        <path data-draw d="M118 121 L206 58" strokeOpacity=".45" />
        {/* lower blade */}
        <path data-draw d="M116 126 L232 92 C235 91 235 95 232 96 L126 136" />
        {/* pivot screw */}
        <circle data-draw cx="119" cy="126" r="5.5" />
        <path data-draw d="M116 126h6" />
        {/* shanks */}
        <path data-draw d="M112 118 C100 124 88 136 80 150" />
        <path data-draw d="M126 136 C120 152 114 168 110 182" />
        {/* finger rings */}
        <path data-draw d="M80 150 C58 146 34 158 30 176 C26 194 44 204 62 196 C80 188 88 168 80 150 Z" />
        <path data-draw d="M110 182 C96 182 78 196 80 214 C82 230 102 234 116 222 C130 210 126 186 110 182 Z" />
        {/* finger rest */}
        <path data-draw d="M44 198 C36 210 30 220 34 226" />
      </g>
    </svg>
  );
}
