import { describe, it, expect, vi } from "vitest";

// app/sitemap.ts reads the admin per-locale noindex flag through
// unstable_cache, which throws E469 outside a Next.js render context. The
// wrapper is Next's caching layer, not behaviour this suite is testing, so it
// is replaced by the identity function; the Redis read underneath already
// degrades to null without REDIS_URL, giving an empty noindex set.
vi.mock("next/cache", () => ({
  unstable_cache: <T,>(fn: T) => fn,
  revalidateTag: () => {},
}));

import sitemap from "../../app/sitemap";
import { STATIC_LOCALES } from "../i18n";

const BASE = "https://bangkokfillers.com";

describe("sitemap", () => {
  const urls = (async () => (await sitemap()).map((e) => e.url))();

  const locOf = (u: string) => u.slice(BASE.length + 1).split("/")[0];

  it("submits every locale the site actually builds", async () => {
    // The whole sitemap was TH-only from 2026-07 to 2026-09-06 while /en
    // carried 48% of the site's impressions and 8 of its 15 clicks. Nothing in
    // the build said so — the omission was invisible until a GSC export was
    // read three weeks later. This is that regression, as an assertion.
    const seen = new Set((await urls).map(locOf));
    for (const l of STATIC_LOCALES) expect(seen).toContain(l);
  });

  it("never names a URL outside the locales that render", async () => {
    // /ko and /ar 307 to /en (894b0bb); anything else 404s via the
    // isValidLocale guard in [locale]/layout.tsx.
    const allowed = new Set<string>(STATIC_LOCALES);
    for (const u of await urls) {
      expect(u.startsWith(`${BASE}/`)).toBe(true);
      expect(allowed).toContain(locOf(u));
    }
  });

  it("submits products in every built locale", async () => {
    // /en products were dropped from the sitemap and 308'd to /th on
    // 2026-08-17 while 79 of them were drawing impressions at positions 7-10;
    // site impressions fell ~80% the next day.
    const all = await urls;
    const byLocale = STATIC_LOCALES.map(
      (l) => all.filter((u) => u.startsWith(`${BASE}/${l}/product/`)).length
    );
    expect(Math.min(...byLocale)).toBeGreaterThan(0);
    expect(new Set(byLocale).size).toBe(1);
  });

  it("does not stamp every URL with the build time", async () => {
    for (const e of await sitemap()) expect(e.lastModified).toBeUndefined();
  });

  it("mirrors brands and ingredients across locales", async () => {
    const all = await urls;
    for (const seg of ["brand", "ingredient"] as const) {
      const byLocale = STATIC_LOCALES.map(
        (l) => all.filter((u) => u.startsWith(`${BASE}/${l}/${seg}/`)).length
      );
      expect(Math.min(...byLocale)).toBeGreaterThan(0);
      expect(new Set(byLocale).size).toBe(1);
    }
  });

  it("lists each URL exactly once", async () => {
    const all = await urls;
    expect(new Set(all).size).toBe(all.length);
  });
});
