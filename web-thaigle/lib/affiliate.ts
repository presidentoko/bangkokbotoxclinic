// Affiliate link builder — single source of truth for all providers.

const KLOOK_AID = process.env.NEXT_PUBLIC_KLOOK_AID || "";
const GYG_PARTNER_ID = process.env.NEXT_PUBLIC_GYG_PARTNER_ID || "";
const VIATOR_PID = process.env.NEXT_PUBLIC_VIATOR_PID || "";
const TP_MARKER = process.env.NEXT_PUBLIC_TRAVELPAYOUTS_MARKER || "";

const KLOOK_SEARCH_BASE = "https://www.klook.com/en-US/search/result/";
const GYG_SEARCH_BASE = "https://www.getyourguide.com/s/";
const VIATOR_SEARCH_BASE = "https://www.viator.com/search/";

function addUtm(url: string, activityType: string): string {
  const sep = url.includes("?") ? "&" : "?";
  let qs = `utm_source=thaigle&utm_medium=affiliate&utm_campaign=${encodeURIComponent(activityType)}`;
  if (TP_MARKER) qs += `&marker=${encodeURIComponent(TP_MARKER)}`;
  return `${url}${sep}${qs}`;
}

/**
 * Resolve an affiliate URL that was written by the scraper with a placeholder
 * ID in it.
 *
 * All 19,730 affiliate URLs in data/by-niche/*.json carry literal
 * `PLACEHOLDER_KLOOK_AID` / `PLACEHOLDER_VIATOR_AID` / `PLACEHOLDER_GYG_AID`
 * query values. Rendered as-is they are unattributed clicks: the visitor
 * reaches the partner, books, and no commission is recorded.
 *
 * Worse, their mere presence broke the fallback path. Every place has a
 * non-empty `viator` and `getyourguide` string, so `hasDirectBooking` was
 * true for all of them, so getAffiliateLink() — the one code path that
 * inserts the real IDs from the environment — never ran on any venue page.
 *
 * Returning null when no real ID is configured is what re-arms that path.
 */
export function resolveAffiliateUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (!url.includes("PLACEHOLDER_")) return url;
  const filled = url
    .replace("PLACEHOLDER_KLOOK_AID", KLOOK_AID)
    .replace("PLACEHOLDER_VIATOR_AID", VIATOR_PID)
    .replace("PLACEHOLDER_GYG_AID", GYG_PARTNER_ID);
  // A still-unfilled placeholder means that provider has no ID configured.
  // Treat the link as absent so the caller falls back to a built one.
  return filled.includes("PLACEHOLDER_") ? null : filled;
}

// Appends our Klook affiliate ID to a direct product URL scraped without one.
export function withKlookAid(url: string): string {
  if (!KLOOK_AID || !url) return url;
  try {
    const u = new URL(url);
    if (!u.searchParams.has("aid")) {
      u.searchParams.set("aid", KLOOK_AID);
      u.searchParams.set("aff_adid", "thaigle");
    }
    return u.toString();
  } catch {
    return url;
  }
}

function klookSearchUrl(query: string): string {
  const u = new URL(KLOOK_SEARCH_BASE);
  u.searchParams.set("keyword", query);
  if (KLOOK_AID) {
    u.searchParams.set("aid", KLOOK_AID);
    u.searchParams.set("aff_adid", "thaigle");
  }
  return u.toString();
}

function gygSearchUrl(query: string): string {
  const u = new URL(GYG_SEARCH_BASE);
  u.searchParams.set("q", query);
  if (GYG_PARTNER_ID) u.searchParams.set("partner_id", GYG_PARTNER_ID);
  return u.toString();
}

function viatorSearchUrl(query: string): string {
  if (!query) return "";
  const u = new URL(VIATOR_SEARCH_BASE);
  u.searchParams.set("text", query);
  if (VIATOR_PID) u.searchParams.set("pid", VIATOR_PID);
  return u.toString();
}

// Provider priority by niche slug
const PROVIDER_ORDER: Record<string, ("klook" | "gyg" | "viator")[]> = {
  "diving":       ["klook", "gyg", "viator"],
  "cooking":      ["klook", "gyg", "viator"],
  "muay-thai":    ["klook", "gyg", "viator"],
  "yoga-pilates": ["klook", "gyg", "viator"],
  "spa":          ["klook", "gyg"],
  "wellness":     ["klook", "gyg"],
  "coworking":    ["gyg", "klook"],
};

// Category search queries per niche
const CATEGORY_QUERIES: Record<string, { klook: string; gyg: string; viator: string }> = {
  "diving":       { klook: "Bangkok diving",          gyg: "diving Bangkok",           viator: "diving Bangkok"    },
  "cooking":      { klook: "Bangkok cooking class",   gyg: "cooking class Bangkok",    viator: "cooking Bangkok"   },
  "muay-thai":    { klook: "Bangkok Muay Thai",       gyg: "Muay Thai Bangkok",        viator: "Muay Thai Bangkok" },
  "yoga-pilates": { klook: "Bangkok yoga",            gyg: "yoga Bangkok",             viator: "yoga Bangkok"      },
  "spa":          { klook: "Bangkok spa massage",     gyg: "spa Bangkok",              viator: ""                  },
  "wellness":     { klook: "Bangkok wellness",        gyg: "wellness retreat Bangkok", viator: ""                  },
  "coworking":    { klook: "Bangkok tours",           gyg: "Bangkok day tours",        viator: "Bangkok tours"     },
};

export type AffiliateVenue = {
  name: string;
  affiliate?: { klook?: string; viator?: string; getyourguide?: string };
};

export type AffiliateLinkResult = {
  url: string;
  provider: string;
  label: string;
  isDirect: boolean;
};

export function getAffiliateLink({
  venue,
  activityType,
  city = "Bangkok",
}: {
  venue?: AffiliateVenue;
  activityType: string;
  city?: string;
}): AffiliateLinkResult {
  // Restaurant: reuse Klook search (Eatigo/HungryHub handled separately in AffiliateSlot)
  if (activityType === "restaurant") {
    const q = venue ? `${venue.name} ${city} restaurant` : `restaurants ${city}`;
    return { url: addUtm(klookSearchUrl(q), activityType), provider: "Klook", label: "Book on Klook", isDirect: false };
  }

  const order = PROVIDER_ORDER[activityType] ?? ["klook", "gyg", "viator"];
  const queries = CATEGORY_QUERIES[activityType] ?? {
    klook: `${activityType} ${city}`,
    gyg: `${activityType} ${city}`,
    viator: `${activityType} ${city}`,
  };

  // Direct venue affiliate URL first — but only one that resolves to a real
  // affiliate ID. The scraped URLs all carry PLACEHOLDER_* values; taking one
  // of those here would return an unattributed link *and* skip the category
  // search below, which is the branch that actually inserts our IDs.
  const direct = {
    klook: resolveAffiliateUrl(venue?.affiliate?.klook),
    getyourguide: resolveAffiliateUrl(venue?.affiliate?.getyourguide),
    viator: resolveAffiliateUrl(venue?.affiliate?.viator),
  };
  if (venue?.affiliate) {
    for (const provider of order) {
      if (provider === "klook" && direct.klook)
        return { url: addUtm(direct.klook, activityType), provider: "Klook", label: "Book on Klook", isDirect: true };
      if (provider === "gyg" && direct.getyourguide)
        return { url: addUtm(direct.getyourguide, activityType), provider: "GetYourGuide", label: "Book on GetYourGuide", isDirect: true };
      if (provider === "viator" && direct.viator)
        return { url: addUtm(direct.viator, activityType), provider: "Viator", label: "Book on Viator", isDirect: true };
    }
  }

  // Category search fallback — never returns null
  for (const provider of order) {
    if (provider === "klook" && queries.klook)
      return { url: addUtm(klookSearchUrl(queries.klook), activityType), provider: "Klook", label: "Find & book similar on Klook", isDirect: false };
    if (provider === "gyg" && queries.gyg)
      return { url: addUtm(gygSearchUrl(queries.gyg), activityType), provider: "GetYourGuide", label: "Find & book similar on GetYourGuide", isDirect: false };
    if (provider === "viator" && queries.viator) {
      const vUrl = viatorSearchUrl(queries.viator);
      if (vUrl) return { url: addUtm(vUrl, activityType), provider: "Viator", label: "Find & book similar on Viator", isDirect: false };
    }
  }

  return { url: addUtm(klookSearchUrl(`${activityType} ${city}`), activityType), provider: "Klook", label: "Find & book similar on Klook", isDirect: false };
}

// Legacy exports — keep for existing callers
export function klookSearchLink(query: string): string { return klookSearchUrl(query); }
export function trackingParams(source: string, medium = "internal", campaign = "thaigle"): string {
  return `utm_source=${source}&utm_medium=${medium}&utm_campaign=${campaign}`;
}
