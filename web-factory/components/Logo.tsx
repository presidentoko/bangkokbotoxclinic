// Inline SVG logo — Thai Supply Hub. Industrial roof + chimney + wordmark.

export function Logo({ accent = "#0f766e", height = 22 }: { accent?: string; height?: number }) {
  return (
    <svg
      width={height * (180 / 22)}
      height={height}
      viewBox="0 0 180 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Thai Supply Hub logo"
    >
      {/* Sawtooth factory roof */}
      <path
        d="M2 18 L2 11 L6 8 L6 11 L10 8 L10 11 L14 8 L14 18 Z"
        fill={accent}
      />
      {/* Chimney */}
      <rect x="11.5" y="4" width="1.6" height="5" fill={accent} />
      {/* Smoke puff */}
      <circle cx="12.3" cy="3" r="1.2" fill={accent} opacity="0.45" />
      {/* Ground line */}
      <ellipse cx="8" cy="19.6" rx="6.5" ry="0.6" fill={accent} opacity="0.18" />
      {/* Wordmark */}
      <text
        x="20" y="16" fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="800" fontSize="13" fill="currentColor" letterSpacing="-0.3"
      >
        thai<tspan fill={accent}>supply</tspan>hub
      </text>
    </svg>
  );
}
