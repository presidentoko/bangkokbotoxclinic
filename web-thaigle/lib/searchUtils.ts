// Split out of lib/search.ts so client components can use isUrl/detectPlatform
// (needed on every keystroke to tell a pasted link from a text query) without
// pulling in searchPlaces' 324KB places-search-index.json — that only loads
// via a dynamic import() once a real text search actually happens.
export type SearchResult = {
  slug: string;
  name: string;
  category: "eat" | "train" | "treat" | "learn" | "relax";
  subtype: string;
  area: string;
  localsScore: number;
};

export function isUrl(input: string): boolean {
  return (
    /^https?:\/\//.test(input.trim()) ||
    /^(www\.|tiktok\.com|instagram\.com|ig\.me)/.test(input.trim())
  );
}

export function detectPlatform(url: string): "tiktok" | "instagram" | "other" {
  if (/tiktok\.com/.test(url)) return "tiktok";
  if (/instagram\.com|ig\.me/.test(url)) return "instagram";
  return "other";
}
