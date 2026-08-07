// Counts regenerated from master_db.json on every build (scripts/build_db_stats.mts).
// Never hardcode dataset numbers in the copy below — the previous "3,000+" survived
// the dataset growing to 8,379 and every SERP snippet undersold the site for months.
import stats from "./dbStats.json";

// Round down to a clean "8,000+" style figure so the claim stays true between
// data refreshes and reads like a directory rather than a changelog.
function floorToThousand(n: number): string {
  return `${Math.floor(n / 1000).toLocaleString()},000+`;
}

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
    // Front-loaded: the count and the DBD claim are what a searcher decides on,
    // and Google truncates around 160 characters. "Verified" attaches only to the
    // DBD-checked subset — the old copy called all of them verified, which was
    // both wrong and a claim we couldn't back up on 90% of listings.
    description:
      `Search ${floorToThousand(stats.total)} Thai B2B suppliers — manufacturers, industrial estates, warehouses, 3PL logistics. ${stats.verified.toLocaleString()} cross-checked against Thailand's DBD registry for capital, TSIC code and founding date. Direct contact, no agent markup.`,
    hero: "Verified Thai manufacturers & B2B suppliers — direct contact, no agent",
    heroSub:
      "Cross-checked with Thailand's Department of Business Development registry. Capital, founding date, registered industry — all in one place. Skip the sourcing agent and contact suppliers directly.",
    themeAccent: "#0f766e",
  };
}
