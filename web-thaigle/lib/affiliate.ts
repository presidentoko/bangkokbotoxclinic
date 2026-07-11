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

  // Direct venue affiliate URL first
  if (venue?.affiliate) {
    for (const provider of order) {
      if (provider === "klook" && venue.affiliate.klook)
        return { url: addUtm(venue.affiliate.klook, activityType), provider: "Klook", label: "Book on Klook", isDirect: true };
      if (provider === "gyg" && venue.affiliate.getyourguide)
        return { url: addUtm(venue.affiliate.getyourguide, activityType), provider: "GetYourGuide", label: "Book on GetYourGuide", isDirect: true };
      if (provider === "viator" && venue.affiliate.viator)
        return { url: addUtm(venue.affiliate.viator, activityType), provider: "Viator", label: "Book on Viator", isDirect: true };
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
