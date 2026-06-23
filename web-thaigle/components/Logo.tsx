export function Logo({ accent = "#f97316", height = 22 }: { accent?: string; height?: number }) {
  return (
    <svg
      width={height * (86 / 22)}
      height={height}
      viewBox="0 0 86 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Thaigle"
    >
      {/* Thai temple spire mark */}
      <polygon points="14,4 17,14 11,14" fill={accent} />
      <rect x="9" y="14" width="10" height="2.5" rx="0.5" fill={accent} />
      {/* Brand name */}
      <text
        x="24" y="16"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="800" fontSize="14" fill="currentColor"
      >
        thai<tspan fill={accent}>gle</tspan>
      </text>
    </svg>
  );
}
