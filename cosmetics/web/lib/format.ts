export function slugify(s: string): string {
  return (s || "").toLowerCase().trim()
    .replace(/[()]/g, "")
    .replace(/[^a-z0-9ก-๙]+/gi, "-")
    .replace(/^-+|-+$/g, "");
}
export const baht = (n: number) => "฿" + Math.round(n).toLocaleString("en-US");
export const score1 = (n: number) => (Math.round(n * 10) / 10).toFixed(1);

/** Returns a Tailwind text-color class based on the score value. */
export function scoreColor(n: number): string {
  if (n >= 85) return "text-emerald-600";
  if (n >= 70) return "text-teal-600";
  return "text-neutral-500";
}
