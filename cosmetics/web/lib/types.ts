export interface IngredientAnalysis { inci: string; role: string; concern_efficacy: Record<string, number>; safety_flags: string[]; }
export interface ReviewSummary { count: number; avg: number; pos_count: number; neg_count: number; pos_keywords: string[]; neg_keywords: string[]; samples: { rating: number; body: string; author?: string; helpful_count?: number }[]; }
export interface PantipSnippet { text: string; topic_id: string; author?: string; }
export interface PantipData { mention_count: number; thread_count: number; snippets: PantipSnippet[]; }
export interface YoutubeSnippet { text: string; author?: string; like_count?: number; video_id: string; published_at?: string; }
export interface YoutubeData { video_count: number; comment_count: number; snippets: YoutubeSnippet[]; }
export interface WatsonsSnippet { text: string; author?: string; rating?: number; date?: string; source_url?: string; }
export interface WatsonsData { review_count: number; matched_name?: string; similarity?: number; snippets: WatsonsSnippet[]; }
export interface Product {
  product_id: string; url: string; name: string; brand: string;
  price_thb: number; list_price_thb: number; discount_pct: number; volume: string;
  image_url: string; images?: string[]; description: string; gtin8?: string; sku?: string;
  ingredients: string | string[]; ingredient_analysis: IngredientAnalysis[];
  ingredient_score: Record<string, number>; review_score: number;
  value_score: number; total_score: Record<string, number>;
  review_summary: ReviewSummary; concern_seeds: string | string[];
  konvy_rating: number; konvy_review_count: number; sold_count: number;
  source?: string; beautrium_rating?: number; beautrium_review_count?: number;
  llm_summary?: { th: string; en: string };
  pantip?: PantipData;
  youtube?: YoutubeData;
  watsons?: WatsonsData;
  /** "topical" (default skincare) or "oral" (supplements). See build_master_db.py. */
  form?: "topical" | "oral";
  /** Parsed from the product name for oral products only; null when unparseable. */
  dose_mg?: number | null;
  servings?: number | null;
  /** "concealer" | "cushion" | "foundation" | "powder" | ... — set only when
   * form is "topical" and the name matched a makeup category. See
   * build_master_db.py's _makeup_category(). */
  makeup_category?: string | null;
  spf?: number | null;
  /** 0-100, review+value+SPF-bonus. Only set when makeup_category is set;
   * total_score/ingredient_score stay at 0 for makeup products since they
   * never enter a concern ranking. See scoring.makeup_score(). */
  makeup_score?: number | null;
}
export interface RankingEntry { product_id: string; total_score: number; }
export interface MasterDb {
  generated_at: string;
  products: Record<string, Product>;
  rankings: Record<string, RankingEntry[]>;
  oral_rankings?: Record<string, RankingEntry[]>;
  makeup_rankings?: Record<string, RankingEntry[]>;
}
export interface IngredientEntry {
  th_name: string; en_name: string; aliases: string[]; role: string;
  concern_efficacy: Record<string, number>; safety_flags: string[];
  mechanism_th: string; mechanism_en: string; typical_pct: string;
  evidence_note?: string; evidence_note_th?: string; sources: string[];
  /** Common alternate Thai transliterations searched for this ingredient
   * (e.g. "ไนอะซินาไมด์" alongside the canonical "ไนอาซินาไมด์") — surfaced
   * in the intro copy so both spellings appear in the page text. */
  alt_th_names?: string[];
  /** Pairing guidance for well-documented actives only; omitted where no
   * established interaction exists (most extracts/emollients/additives). */
  combo_good_th?: string; combo_good_en?: string;
  combo_avoid_th?: string; combo_avoid_en?: string;
}
