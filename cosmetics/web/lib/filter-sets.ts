// Ingredient sets used by the concern-page filter. Kept in a plain module (no
// "use client", no data import) so the server component can fold them into
// scalars before serialising, instead of shipping every product's full
// ingredient_analysis to the browser to recompute them there.

/** Actives a sensitive-skin user should see at most one of. */
export const SENSITIVE_AVOID = new Set([
  "Alcohol Denat.",
  "Benzoyl Peroxide",
  "Fragrance",
  "Tea Tree Oil",
  "Salicylic Acid",
  "Adapalene",
]);

/** Actives that meaningfully control sebum. */
export const OILY_GOOD = new Set([
  "Salicylic Acid",
  "Zinc PCA",
  "Niacinamide",
  "Benzoyl Peroxide",
  "Adapalene",
]);

/**
 * Collapses a product's ingredient_analysis into the three values the client
 * filter actually reads. Everything else it used to receive — every INCI name,
 * every per-ingredient efficacy number, and safety_flags (which no surviving
 * code path reads at all) — never needs to cross the wire.
 */
export function foldIngredients(
  analysis: { inci: string; concern_efficacy?: Record<string, number>; safety_flags?: string[] }[],
  concern: string
): { harshCount: number; hasOilControlActive: boolean; topActives: string[] } {
  let harshCount = 0;
  let hasOilControlActive = false;
  const topActives: string[] = [];
  for (const a of analysis ?? []) {
    if (SENSITIVE_AVOID.has(a.inci)) harshCount++;
    if (OILY_GOOD.has(a.inci)) hasOilControlActive = true;
    if (topActives.length < 2 && (a.concern_efficacy?.[concern] ?? 0) >= 2) {
      topActives.push(a.inci);
    }
  }
  return { harshCount, hasOilControlActive, topActives };
}
