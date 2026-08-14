import fs from "node:fs";
import path from "node:path";
import type { Lang } from "./site";

export type GuideSection = { heading: string; body: string };
export type GuideFaqItem = { q: string; a: string };

export type Guide = {
  slug: string;
  title: Record<Lang, string>;
  // Lede paragraph -- always present for every language, used for
  // metaDescription and as the opening paragraph. `sections`/`faq` are
  // optional PER LANGUAGE (Partial, not Record): English guides were
  // restructured into real h2 sections + FAQ items for AEO (see the
  // 2026-08-14 audit -- guides were the thinnest, most dead-end pages on
  // the site), but th/ko translations of that new structure need a native
  // speaker's review before publishing, so they're deliberately left
  // rendering the original single-paragraph body until that happens
  // rather than shipping unreviewed machine-translated section copy on a
  // live commercial site.
  body: Record<Lang, string>;
  sections?: Partial<Record<Lang, GuideSection[]>>;
  faq?: Partial<Record<Lang, GuideFaqItem[]>>;
  // Other guide slugs to cross-link -- guide pages used to have zero links
  // out to anywhere else on the site (the single worst discovery dead end
  // found in the retention audit); this and the fixed prices/cities links
  // rendered alongside it in guide/[slug]/page.tsx fix that.
  relatedGuides?: string[];
};

const GUIDES_DIR = path.join(process.cwd(), "content", "guides");

let cache: Guide[] | null = null;

export function listGuides(): Guide[] {
  if (cache) return cache;
  if (!fs.existsSync(GUIDES_DIR)) return (cache = []);
  cache = fs
    .readdirSync(GUIDES_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(GUIDES_DIR, f), "utf-8")) as Guide);
  return cache;
}

export function getGuide(slug: string): Guide | null {
  return listGuides().find((g) => g.slug === slug) ?? null;
}
