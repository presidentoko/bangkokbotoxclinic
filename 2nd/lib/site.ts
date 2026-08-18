import { getAllItems } from './data'

/**
 * The year the price data actually belongs to.
 *
 * Every year-stamped title, H1 and schema name renders this instead of a
 * literal. The brand pages spent all of 2026 advertising "Price Guide 2025"
 * because the year was hardcoded in 48 files; deriving it from the newest
 * `last_updated` in the dataset means the site rolls over the moment the
 * scraper does, and a stale year can only mean stale prices.
 */
export const PRICE_YEAR: number =
  Number(
    (getAllItems()
      .map(i => i.last_updated)
      .filter(Boolean)
      .sort()
      .pop() ?? '').slice(0, 4)
  ) || new Date().getFullYear()
