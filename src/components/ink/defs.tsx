/**
 * Global SVG filters, rendered once in the layout. Anything drawn with `filter="url(#ink-…)"` gets an
 * irregular, absorbed-into-paper edge instead of a vector-perfect one.
 */
export function InkDefs() {
  return (
    <svg aria-hidden width="0" height="0" className="absolute">
      <defs>
        {/* Slight wobble: pen lines and hand-drawn icons. */}
        <filter id="ink-rough" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="4" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="2.4" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        {/* Wet ink soaking into paper: rough edge plus a soft halo. */}
        <filter id="ink-bleed" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed="11" result="n" />
          <feDisplacementMap in="SourceGraphic" in2="n" scale="9" xChannelSelector="R" yChannelSelector="G" result="d" />
          <feGaussianBlur in="d" stdDeviation="0.6" result="b" />
          <feComponentTransfer in="b">
            <feFuncA type="table" tableValues="0 0.2 1 1" />
          </feComponentTransfer>
        </filter>
        {/* Dry brush: torn edges and streaks for painted swatches. */}
        <filter id="ink-brush" x="-5%" y="-15%" width="110%" height="130%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.18" numOctaves="3" seed="7" result="streak" />
          <feDisplacementMap in="SourceGraphic" in2="streak" scale="14" xChannelSelector="R" yChannelSelector="G" result="torn" />
          <feTurbulence type="fractalNoise" baseFrequency="0.9 0.02" numOctaves="1" seed="3" result="hair" />
          <feColorMatrix in="hair" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.4 1.35" result="mask" />
          <feComposite in="torn" in2="mask" operator="in" />
        </filter>
      </defs>
    </svg>
  );
}
