import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/indexing", () => ({ getNoindexLocales: async () => new Set<string>() }));
import sitemap from "@/app/sitemap";
import { getProduct, productIdFromSlug } from "@/lib/data";
import { hasEvidence } from "@/lib/compare-evidence";

describe("sitemap compare entries", () => {
  it("submits only pairs that carry checkable evidence, once per locale", async () => {
    const urls = (await sitemap()).map((e) => e.url).filter((u) => u.includes("/compare/"));
    console.log("compare urls:", urls.length);
    expect(urls.length).toBeGreaterThan(0);
    expect(new Set(urls).size).toBe(urls.length);
    for (const u of urls) {
      const slugs = u.split("/compare/")[1];
      const i = slugs.indexOf("-vs-");
      const a = getProduct(productIdFromSlug(slugs.slice(0, i)));
      const b = getProduct(productIdFromSlug(slugs.slice(i + 4)));
      expect(a && b && hasEvidence(a, b)).toBe(true);
    }
  });
});
