export interface IngredientAnalysis { inci: string; role: string; concern_efficacy: Record<string, number>; safety_flags: string[]; }
export interface ReviewSummary { count: number; avg: number; pos_count: number; neg_count: number; pos_keywords: string[]; neg_keywords: string[]; samples: { rating: number; body: string; author?: string; helpful_count?: number }[]; }
export interface Product {
  product_id: string; url: string; name: string; brand: string;
  price_thb: number; list_price_thb: number; discount_pct: number; volume: string;
  image_url: string; description: string; gtin8: string;
  ingredients: string | string[]; ingredient_analysis: IngredientAnalysis[];
  ingredient_score: Record<string, number>; review_score: number;
  value_score: number; total_score: Record<string, number>;
  review_summary: ReviewSummary; concern_seeds: string | string[];
  konvy_rating: number; konvy_review_count: number; sold_count: number;
  llm_summary?: { th: string; en: string };
}
export interface RankingEntry { product_id: string; total_score: number; }
export interface MasterDb { generated_at: string; products: Record<string, Product>; rankings: Record<string, RankingEntry[]>; }
export interface IngredientEntry { th_name: string; en_name: string; aliases: string[]; role: string; concern_efficacy: Record<string, number>; safety_flags: string[]; mechanism_th: string; mechanism_en: string; typical_pct: string; evidence_note?: string; sources: string[]; }
