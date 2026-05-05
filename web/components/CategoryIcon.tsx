// 시술 카테고리 SVG 아이콘 — 시각 차별화.

const ICONS: Record<string, string> = {
  botox: "💉",
  filler: "💧",
  hifu: "⚡",
  facial: "🌸",
  laser: "✨",
  dental: "🦷",
  hair_transplant: "💇",
  eye: "👁",
};

export function CategoryIcon({ category, size = 16 }: { category: string; size?: number }) {
  const icon = ICONS[category] ?? "🏥";
  return (
    <span style={{ fontSize: size, lineHeight: 1 }} aria-hidden="true">
      {icon}
    </span>
  );
}
