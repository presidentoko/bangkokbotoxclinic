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
  // optional PER LANGUAGE (Partial, not Record): every guide was
  // restructured into real h2 sections + FAQ items for AEO (see the
  // 2026-08-14 audit -- guides were the thinnest, most dead-end pages on
  // the site), en/th/ko all included. The th/ko section+FAQ copy is
  // AI-translated (matching the tone of this file's original human-written
  // th/ko body paragraphs, not machine-literal) and hasn't had a native
  // speaker's pass yet -- worth a review before treating it as final, but
  // it ships rather than falling back to the old single-paragraph body,
  // since thin/dead-end content was the worse default. The Partial type
  // stays in case a future guide ships English-only before translation.
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
