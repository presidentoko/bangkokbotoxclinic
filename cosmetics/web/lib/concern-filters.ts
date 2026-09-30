// The concern x filter combinations the site publishes.
//
// Kept out of lib/data.ts so middleware can read it: data.ts imports
// master_db.json (8.6MB) at module scope, which middleware must never pull in.
// lib/data.ts re-exports this, so existing imports are unchanged.
export const CONCERN_FILTER_SLUGS: Record<string, string[]> = {
  acne:       ["under-300", "under-500", "fragrance-free", "niacinamide", "salicylic-acid", "serum", "cleanser"],
  whitening:  ["under-300", "under-500", "fragrance-free", "vitamin-c", "niacinamide", "serum", "cleanser"],
  antiaging:  ["under-500", "under-1000", "retinol", "vitamin-c", "hyaluronic-acid", "serum", "moisturizer"],
  pores:      ["under-300", "under-500", "niacinamide", "salicylic-acid", "serum", "cleanser"],
  oilcontrol: ["under-300", "under-500", "niacinamide", "salicylic-acid", "toner", "cleanser"],
  sensitive:  ["under-300", "under-500", "fragrance-free", "hyaluronic-acid", "moisturizer", "cleanser"],
};
