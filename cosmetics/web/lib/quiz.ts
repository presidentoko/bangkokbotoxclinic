import { getRanking, getProduct } from "./data";
import type { Product } from "./types";
import type { Concern } from "./data";
import type { SkinType, Budget } from "./quiz-config";

export interface QuizParams {
  skin: SkinType;
  concern: Concern;
  budget: Budget;
}

export const BUDGET_RANGE: Record<Budget, { min: number; max: number }> = {
  low:  { min: 0,   max: 280 },
  mid:  { min: 280, max: 700 },
  high: { min: 700, max: Infinity },
};

export function quizRecommendations({ skin, concern, budget }: QuizParams, limit = 3): Product[] {
  const { min, max } = BUDGET_RANGE[budget];

  const ranked = getRanking(concern)
    .map((r) => getProduct(r.product_id))
    .filter((p): p is Product => p !== undefined && p.price_thb > 0);

  let filtered = ranked.filter((p) => p.price_thb >= min && p.price_thb <= max);

  // Sensitive skin: prefer fragrance-free products
  if (skin === "sensitive") {
    const clean = filtered.filter(
      (p) => !p.ingredient_analysis.some((a) => a.safety_flags.includes("fragrance"))
    );
    if (clean.length >= limit) filtered = clean;
  }

  // Fall back to full ranking if budget filter yields too few
  if (filtered.length < limit) {
    let fallback = ranked;
    if (skin === "sensitive") {
      const clean = ranked.filter(
        (p) => !p.ingredient_analysis.some((a) => a.safety_flags.includes("fragrance"))
      );
      if (clean.length >= limit) fallback = clean;
    }
    filtered = fallback;
  }

  return filtered.slice(0, limit);
}
