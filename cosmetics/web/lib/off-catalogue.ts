import offCatalogue from "@/data/off-catalogue-brands.json";

/**
 * Brands whose products are not cosmetics.
 *
 * The catalogue is filled from a retailer that files facial tissue, cotton
 * pads, condoms and sanitary pads under beauty, so the site generated a brand
 * page for each of them. Two of those pages are worse than thin: "Hourglass"
 * and "Giorgio Armani" hold a pouch and a case, so a reader searching either
 * makeup house lands on a page that is about neither.
 *
 * They are kept out of the sitemap and marked noindex rather than removed.
 * The page still answers 200, so nothing 404s and the decision reverses by
 * deleting a line from data/off-catalogue-brands.json. Nothing measured is at
 * risk: none of these brands appears among the 147 /brand URLs in the
 * 2026-10-15 Search Console export.
 */
const OFF = new Set(
  (offCatalogue.brands as { brand: string }[]).map((b) => b.brand.trim().toLowerCase())
);

export function isOffCatalogue(brand: string): boolean {
  return OFF.has(brand.trim().toLowerCase());
}

export function offCatalogueCount(): number {
  return OFF.size;
}
