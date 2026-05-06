// 인라인 SVG 로고 — themeAccent 색깔 활용. 가벼움 (no image).

export function Logo({ accent = "#7c3aed", height = 22 }: { accent?: string; height?: number }) {
  return (
    <svg
      width={height * (40 / 22)}
      height={height}
      viewBox="0 0 80 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Bangkok Clinics logo"
    >
      <circle cx="11" cy="11" r="10" fill={accent} />
      <path
        d="M11 5v6m0 0h6m-6 0v6m0-6H5"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <text
        x="26" y="16" fontFamily="system-ui, -apple-system, sans-serif"
        fontWeight="800" fontSize="14" fill="currentColor"
      >
        bkk<tspan fill={accent}>clinics</tspan>
      </text>
    </svg>
  );
}
