import trending from "@/data/trending.json";

/**
 * What Thai Pantip has been discussing lately, collected by
 * cosmetics/pantip_trending.py and committed as data/trending.json.
 *
 * The window is 90 days, not a week, because that is what the source supports:
 * a given cosmetics brand draws roughly one to three Pantip threads a quarter.
 * The collector's docstring carries the measurements. Copy on the page must
 * say "recently", never "this week".
 *
 * Every thread here is a real Pantip topic with its real date and reply count,
 * linked to its own URL — nothing is inferred or estimated.
 */
export interface TrendingThread {
  topic_id: string;
  title: string;
  url: string;
  /** YYYY-MM-DD, the thread's own posting date. */
  date: string;
  replies: number;
}

export interface TrendingBrand {
  brand: string;
  brand_th?: string | null;
  /** Recency-weighted engagement, two-week half-life. Ordering only — it is
   *  not a rating and is never shown as a number. */
  heat: number;
  thread_count: number;
  threads: TrendingThread[];
}

export interface TrendingProduct {
  product_id: string;
  name: string;
  brand: string;
  heat: number;
  thread_count: number;
  threads: TrendingThread[];
}

export interface TrendingData {
  generated_at: string;
  window_days: number;
  threads_in_window: number;
  threads_attributed: number;
  brands: TrendingBrand[];
  products: TrendingProduct[];
}

const DATA = trending as unknown as TrendingData;

export function trendingData(): TrendingData {
  return DATA;
}

export function trendingBrands(limit = 20): TrendingBrand[] {
  return DATA.brands.slice(0, limit);
}

/**
 * Products are only published once two separate threads corroborate them — one
 * thread naming a product line matched six near-identical pack variants on the
 * first run, which is one discussion, not six trending products. The list is
 * usually empty, and the page must render nothing rather than a stale filler.
 */
export function trendingProducts(limit = 12): TrendingProduct[] {
  return DATA.products.slice(0, limit);
}

/** Whether there is enough to justify publishing the page at all. */
export function hasTrendingData(): boolean {
  return DATA.brands.length > 0;
}
