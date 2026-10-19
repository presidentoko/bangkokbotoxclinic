import { describe, it, expect } from "vitest";
import { isOffCatalogue, offCatalogueCount } from "../off-catalogue";
import { allBrands } from "../data";
import offCatalogue from "../../data/off-catalogue-brands.json";

describe("off-catalogue brands", () => {
  it("holds things a cosmetics site does not sell", () => {
    for (const b of ["Kleenex", "Sofy", "Onetouch", "Hygiene", "Clinix"]) {
      expect(isOffCatalogue(b)).toBe(true);
    }
  });

  it("matches regardless of case or stray spacing", () => {
    expect(isOffCatalogue("  kleenex ")).toBe(true);
    expect(isOffCatalogue("GIORGIO ARMANI")).toBe(true);
  });

  it("keeps the supplements, which are bought for how you look", () => {
    // Hi-Balanz, NUBOLIC and the rest are ranked in the site's oral section;
    // they were only ever missing a per-capsule price, not a reason to exist.
    for (const b of ["Hi-Balanz", "NUBOLIC", "Doctorlogy", "PPRIM", "Black Magic Plus"]) {
      expect(isOffCatalogue(b)).toBe(false);
    }
  });

  it("keeps ordinary skincare brands", () => {
    for (const b of ["Eucerin", "CeraVe", "La Roche Posay"]) {
      expect(isOffCatalogue(b)).toBe(false);
    }
  });

  it("names a reason for every brand it excludes", () => {
    for (const row of offCatalogue.brands as { brand: string; why: string }[]) {
      expect(row.why.length).toBeGreaterThan(10);
    }
  });

  it("only lists brands the catalogue actually carries", () => {
    // A stale name here would silently stop excluding anything, and nobody
    // would notice until the page turned up in an index report.
    const live = new Set(allBrands().map((b) => b.trim().toLowerCase()));
    const missing = (offCatalogue.brands as { brand: string }[])
      .map((r) => r.brand)
      .filter((b) => !live.has(b.trim().toLowerCase()));
    expect(missing).toEqual([]);
  });

  it("excludes a small, reviewable number rather than a sweep", () => {
    expect(offCatalogueCount()).toBeLessThan(30);
    expect(offCatalogueCount()).toBeGreaterThan(0);
  });
});
