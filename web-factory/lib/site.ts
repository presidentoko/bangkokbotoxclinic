export type SiteConfig = {
  brand: string;
  domain: string;
  title: string;
  description: string;
  hero: string;
  heroSub: string;
  themeAccent: string;
};

export function getSiteConfig(): SiteConfig {
  const brand = process.env.NEXT_PUBLIC_BRAND || "Thai Supply Hub";
  const domain = process.env.NEXT_PUBLIC_SITE_URL || "https://thaisupplyhub.com";
  return {
    brand,
    domain,
    title: `${brand} — Verified Thai Manufacturers, Industrial Estates & Logistics`,
    description:
      "650+ verified suppliers across Thailand's Eastern Seaboard. Manufacturers, auto-parts factories, warehouses, industrial estates — ranked by Trust Score from real Google reviews. Pinthong, Amata, WHA, Rojana — all in one place.",
    hero: "Thai Supply Hub — verified manufacturers and industrial estates",
    heroSub:
      "650+ suppliers in Chon Buri, Rayong & Bangkok. Real Google reviews analyzed. Compare manufacturers, auto-parts factories, warehouses, and industrial estates before you source.",
    themeAccent: "#0f766e",
  };
}
