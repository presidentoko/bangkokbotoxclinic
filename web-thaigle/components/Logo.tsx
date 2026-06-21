// 인라인 SVG 로고 — anti-SNS 컨셉. Stop sign + SNS 모티프.

export function Logo({ accent = "#dc2626", height = 22 }: { accent?: string; height?: number }) {
  return (
    <svg
      width={height * (110 / 22)}
      height={height}
      viewBox="0 0 110 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="SNS Stopper logo"
    >
      {/* Stop sign 8각형 */}
      <polygon
        points="11,1 17,1 21,5 21,11 17,15 11,15 7,11 7,5"
        transform="rotate(22.5 11 8)"
        fill={accent}
      />
      {/* "STOP" bar */}
      <rect x="3.5" y="6.5" width="15" height="3" rx="0.5" fill="white" />
      <text
        x="26" y="16" fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="800" fontSize="14" fill="currentColor"
      >
        sns<tspan fill={accent}>stopper</tspan>
      </text>
    </svg>
  );
}
