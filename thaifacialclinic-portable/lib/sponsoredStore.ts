// Sponsored slot env reader. Manual flow: edit Vercel env CSV → redeploy.
// Tiers: EDITORS_PICK (top, ฿15k/mo) · RECOMMENDED (฿10k) · FEATURED (฿5k)

export type SponsorTier = "editors_pick" | "recommended" | "featured";

function ids(envVar: string | undefined): string[] {
  if (!envVar) return [];
  return envVar.split(",").map((s) => s.trim()).filter(Boolean);
}

export function sponsoredEditorsPick(): string[] {
  return ids(process.env.SPONSORED_EDITORS_PICK);
}
export function sponsoredRecommended(): string[] {
  return ids(process.env.SPONSORED_RECOMMENDED);
}
export function sponsoredFeatured(): string[] {
  return ids(process.env.SPONSORED_FEATURED);
}

export function sponsorTierFor(clinicId: string): SponsorTier | null {
  if (sponsoredEditorsPick().includes(clinicId)) return "editors_pick";
  if (sponsoredRecommended().includes(clinicId)) return "recommended";
  if (sponsoredFeatured().includes(clinicId)) return "featured";
  return null;
}

export const SPONSOR_META: Record<SponsorTier, { label: string; color: string; bg: string; order: number }> = {
  editors_pick: { label: "Editor's Pick", color: "#fff", bg: "#7c3aed", order: 0 },
  recommended:  { label: "Recommended",   color: "#fff", bg: "#2563eb", order: 1 },
  featured:     { label: "Featured",      color: "#fff", bg: "#6b7280", order: 2 },
};
