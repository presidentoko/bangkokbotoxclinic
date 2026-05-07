// 인라인 SVG 로고 — Thailand Golf Guide. 깃발 + 골프공 모티프.

export function Logo({ accent = "#15803d", height = 22 }: { accent?: string; height?: number }) {
  return (
    <svg
      width={height * (170 / 22)}
      height={height}
      viewBox="0 0 170 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Thailand Golf Guide logo"
    >
      {/* Flag pole */}
      <rect x="3.5" y="2" width="1.2" height="16" fill={accent} />
      {/* Flag */}
      <path d="M5 2 L14 4.5 L5 7.5 Z" fill={accent} />
      {/* Ball on green */}
      <circle cx="8" cy="18" r="2.2" fill="#fafafa" stroke={accent} strokeWidth="0.6" />
      <ellipse cx="8" cy="19.6" rx="3.5" ry="0.7" fill={accent} opacity="0.18" />
      {/* Wordmark */}
      <text
        x="20" y="16" fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="800" fontSize="13" fill="currentColor" letterSpacing="-0.3"
      >
        thailand<tspan fill={accent}>golf</tspan>
      </text>
    </svg>
  );
}
