// jobs/learn-cooking/config.ts

export const AREAS = [
  "Sukhumvit",
  "Silom",
  "Sathorn",
  "Old Town Rattanakosin",
  "Chinatown",
  "Thonglor",
  "Ari",
  "Bang Rak",
  "Riverside",
  "On Nut",
];

export const KEYWORDS = [
  "thai cooking class",
  "cooking school",
  "culinary class",
  "market tour cooking",
  "thai food workshop",
];

// 50 queries total: all AREAS × all KEYWORDS
export const SEED_QUERIES = AREAS.flatMap((area) =>
  KEYWORDS.map((kw) => ({ area, keyword: kw, query: `${kw} ${area} Bangkok` }))
);

// Source trust weights — aligned with receipt SYSTEM prompt
// Note: ReviewSource union is "google"|"line"|"tiktok_comment"|"field"|"other"
// OTA sources (klook, getyourguide, viator, airbnb_exp) map to "other" in ReviewInput
export const SOURCE_TRUST: Record<string, number> = {
  field: 1.0,
  google: 0.8,
  klook: 0.75,
  getyourguide: 0.75,
  viator: 0.7,
  airbnb_exp: 0.7,
  line: 0.7,
  tiktok_comment: 0.5,
};

// Negative filter: drop if name/category contains these (not a real class)
export const NEGATIVE_NAME_PATTERNS = [
  /restaurant\s+only/i,
  /catering/i,
  /kitchen\s+equipment/i,
  /ghost\s+kitchen/i,
  /dark\s+kitchen/i,
  /food\s+delivery/i,
  /grocery/i,
  /supermarket/i,
];

// Positive signals in review text indicating an actual hands-on class
export const CLASS_SIGNALS = [
  /\bhands.?on\b/i,
  /\brecipe\b/i,
  /\blearn to cook\b/i,
  /\blearned\b/i,
  /\blearn how\b/i,
  /\bwok\b/i,
  /\binstructor\b/i,
  /\bteacher\b/i,
  /\bสอน\b/i,     // Thai: teach
  /\bทำอาหาร\b/i, // Thai: cook food
  /\bเรียน\b/i,   // Thai: learn
];

// Sponsored signal patterns (1st-pass heuristic, receipt pipeline does 2nd-pass)
export const SPONSORED_PATTERNS = [
  /\bcomplimentary\b/i,
  /\bhosted\b/i,
  /\bpress\s+trip\b/i,
  /\bgifted\b/i,
  /\bPR\s+package\b/i,
  /\baffiliate\b/i,
  /\bdiscount\s+code\b/i,
  /ได้รับเชิญ/i, // Thai: was invited
  /สปอนเซอร์/i,  // Thai: sponsor
  /ได้รับฟรี/i,  // Thai: received free
];
