import assert from "node:assert";
import { computeTrustScore, trustTier } from "../lib/trustScore.ts";
import type { Supplier } from "../lib/types.ts";

// Minimal supplier factory — only fields the score reads.
function mk(over: Partial<Supplier>): Supplier {
  return {
    id: "x", place_id: "", name: "", primary_type: "", address: "", city: "", city_label: "",
    district: "", phone: "", website: "", menu_url: "", lat: null, lng: null,
    rating: 0, total_reviews: 0, trust_score: 0, categories: [], raw_categories: [],
    price_level: "", price_symbol: "", scraped_review_count: 0, local_guide_count: 0,
    avg_author_review_count: 0,
    language_breakdown: { th: 0, en: 0, ko: 0, ja: 0, other: 0 },
    cuisine_mentions: {}, mentioned_topics: [],
    rating_trend: { recent: { count: 0, avg: null }, midterm: { count: 0, avg: null }, old: { count: 0, avg: null }, trend: "insufficient_data" },
    sample_reviews_th: [], sample_reviews_en: [], sample_reviews_ko: [],
    business_status: "", maps_url: "",
    ...over,
  } as Supplier;
}

// 1. Empty supplier -> all zero -> overall 0, tier Limited.
const empty = computeTrustScore(mk({}), 2026);
assert.equal(empty.overall, 0, "empty overall");
assert.equal(empty.tier, "Limited", "empty tier");
assert.equal(empty.subs.length, 5, "5 subs");

// 2. Capital sub: 100M THB -> (log10(1e8)-5)*25 = 75. (1B -> 100, 100K -> 0)
const capOnly = computeTrustScore(mk({ dbd: { reg_no: "", legal_name: null, capital_thb: 100_000_000, registered_date: null, tsic_code: null, purpose: null, address: null, match_score: 0 } }), 2026);
const capSub = capOnly.subs.find((s) => s.key === "capital")!;
assert.equal(Math.round(capSub.score), 75, "100M capital -> 75");
// 1B -> 100, 100K -> 0
assert.equal(computeTrustScore(mk({ dbd: { reg_no: "", legal_name: null, capital_thb: 1_000_000_000, registered_date: null, tsic_code: null, purpose: null, address: null, match_score: 0 } }), 2026).subs.find((s) => s.key === "capital")!.score, 100, "1B -> 100");

// 3. Longevity sub: 10 years -> 40.
const lon = computeTrustScore(mk({ years_in_business: 10 }), 2026);
assert.equal(lon.subs.find((s) => s.key === "longevity")!.score, 40, "10y -> 40");

// 4. Longevity from registered_date + currentYear.
const lon2 = computeTrustScore(mk({ dbd: { reg_no: "", legal_name: null, capital_thb: null, registered_date: "2016-01-01", tsic_code: null, purpose: null, address: null, match_score: 0 } }), 2026);
assert.equal(lon2.subs.find((s) => s.key === "longevity")!.score, 40, "2016->2026 = 10y -> 40");

// 5. Reviews sub: 100 reviews, rating 4.5 -> min(100, 2*25 + 45) = 95.
const rev = computeTrustScore(mk({ total_reviews: 100, rating: 4.5 }), 2026);
assert.equal(rev.subs.find((s) => s.key === "reviews")!.score, 95, "reviews 95");

// 6. Verifications: 2 of 4 -> 50.
const ver = computeTrustScore(mk({ verified: true, halal_certified: true }), 2026);
assert.equal(ver.subs.find((s) => s.key === "verifications")!.score, 50, "2/4 -> 50");

// 7. Photos: 4 photos -> 50.
const ph = computeTrustScore(mk({ photos: ["a", "b", "c", "d"] }), 2026);
assert.equal(ph.subs.find((s) => s.key === "photos")!.score, 50, "4 photos -> 50");

// 8. tier thresholds.
assert.equal(trustTier(39).tier, "Limited");
assert.equal(trustTier(40).tier, "Fair");
assert.equal(trustTier(60).tier, "Strong");
assert.equal(trustTier(75).tier, "Excellent");

// 9. overall does NOT depend on b2b_score / trust_score field.
const a = computeTrustScore(mk({ trust_score: 0, b2b_score: 0, rating: 4.5, total_reviews: 100 }), 2026);
const b = computeTrustScore(mk({ trust_score: 18, b2b_score: 18, rating: 4.5, total_reviews: 100 }), 2026);
assert.equal(a.overall, b.overall, "overall independent of b2b_score");

console.log("test_trust_score: OK");
