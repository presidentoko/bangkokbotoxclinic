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
    title: `${brand} — Find Verified Manufacturers & B2B Suppliers in Thailand`,
    description:
      "Search 3,000+ verified Thai B2B suppliers — manufacturers, industrial estates, warehouses, 3PL logistics. DBD registry cross-checked with capital, TSIC code, founding date. Plastic injection molding, food ingredients, auto parts, electronics — direct contact, no agent markup.",
    hero: "Verified Thai manufacturers & B2B suppliers — direct contact, no agent",
    heroSub:
      "Cross-checked with Thailand's Department of Business Development registry. Capital, founding date, registered industry — all in one place. Skip the sourcing agent and contact suppliers directly.",
    themeAccent: "#0f766e",
  };
}
