// Initials avatar — deterministic color from string hash. No external avatar service.
const COLORS = [
  ["#0ea5e9", "#fff"], // sky
  ["#10b981", "#fff"], // emerald
  ["#f59e0b", "#fff"], // amber
  ["#ef4444", "#fff"], // red
  ["#8b5cf6", "#fff"], // violet
  ["#06b6d4", "#fff"], // cyan
  ["#ec4899", "#fff"], // pink
  ["#84cc16", "#0a0905"], // lime (dark text)
  ["#f97316", "#fff"], // orange
] as const;

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function Avatar({
  name, email, size = 36,
}: {
  name: string;
  email?: string;
  size?: number;
}) {
  const seed = email || name || "?";
  const [bg, fg] = COLORS[hash(seed) % COLORS.length];
  return (
    <span
      className="inline-grid place-items-center rounded-full font-bold shrink-0"
      style={{
        width: size,
        height: size,
        background: bg,
        color: fg,
        fontSize: size * 0.4,
      }}
      aria-hidden
    >
      {initials(name || email || "?")}
    </span>
  );
}
