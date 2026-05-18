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
    title: `${brand} — DBD-Verified Thai Manufacturers, Industrial Estates & Logistics`,
    description:
      "849 DBD-verified manufacturers + 3,300 B2B suppliers across Thailand's Eastern Seaboard. Capital, registered date, TSIC industry code, photos — sourced from the official Department of Business Development registry. Pinthong, Amata, WHA, Rojana, Nava Nakorn — in one searchable directory.",
    hero: "DBD-verified Thai manufacturers, industrial estates & logistics",
    heroSub:
      "849 manufacturers cross-checked with Thailand's official business registry. Capital, founding date, registered industry — all in one place. Skip the sourcing agent and contact suppliers directly.",
    themeAccent: "#0f766e",
  };
}
