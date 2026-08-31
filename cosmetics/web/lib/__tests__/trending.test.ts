import { describe, it, expect } from "vitest";
import {
  trendingData,
  trendingBrands,
  trendingProducts,
  hasTrendingData,
} from "../trending";
import { getProduct } from "../data";

describe("trending data", () => {
  const d = trendingData();

  it("declares a window the source can actually support", () => {
    // A cosmetics brand draws roughly one to three Pantip threads a quarter,
    // so anything shorter than a month would be a claim, not a measurement.
    expect(d.window_days).toBeGreaterThanOrEqual(30);
  });

  it("only publishes threads with a real id, date and link", () => {
    for (const b of d.brands) {
      for (const t of b.threads) {
        expect(t.topic_id).toMatch(/^\d+$/);
        expect(t.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(t.url).toBe(`https://pantip.com/topic/${t.topic_id}`);
        expect(t.title.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("keeps every published thread inside the stated window", () => {
    const cutoff = Date.now() - d.window_days * 86400_000;
    for (const b of d.brands) {
      for (const t of b.threads) {
        expect(new Date(t.date).getTime()).toBeGreaterThanOrEqual(cutoff);
      }
    }
  });

  it("never lists more threads than it counted", () => {
    for (const b of d.brands) {
      expect(b.threads.length).toBeLessThanOrEqual(b.thread_count);
      expect(b.thread_count).toBeGreaterThan(0);
    }
  });

  it("orders brands by heat, descending", () => {
    const heats = trendingBrands(50).map((b) => b.heat);
    for (let i = 1; i < heats.length; i++) {
      expect(heats[i - 1]).toBeGreaterThanOrEqual(heats[i]);
    }
  });

  it("de-duplicates the threads shown per brand", () => {
    for (const b of d.brands) {
      const ids = b.threads.map((t) => t.topic_id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("requires two separate threads before naming a product", () => {
    // One thread naming a product line matched six near-identical pack
    // variants of it on the first run — one discussion, not six products.
    for (const p of trendingProducts(50)) {
      expect(p.thread_count).toBeGreaterThanOrEqual(2);
      expect(getProduct(p.product_id)).toBeDefined();
    }
  });

  it("reports attribution honestly", () => {
    expect(d.threads_attributed).toBeLessThanOrEqual(d.threads_in_window);
  });

  it("exposes whether the page is worth publishing at all", () => {
    expect(hasTrendingData()).toBe(d.brands.length > 0);
  });
});
