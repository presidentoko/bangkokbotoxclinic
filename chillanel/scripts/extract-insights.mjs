// Per-place numbers mined from EVERY scraped review of a place (not the 20
// shown on the page) — chillanel's own data, not a restatement of Google.
// Pure functions, regex dictionaries, zero cost (no LLM). 2026-10-23.
//
// What the page may publish from this is numbers and labels only. No review
// text leaves this module.

// ---------- aspects: positive vs negative mentions ----------
// A review counts once per side per aspect. Positive cues preceded by a
// negation ("not clean", "wasn't friendly") are not counted as positive —
// the negative dictionaries catch the common negated forms explicitly.
export const ASPECTS = {
  cleanliness: {
    pos: [/\b(?:very |so |super |really )?clean\b/i, /\bspotless\b/i, /\bhygienic\b/i, /\btidy\b/i,
      /깨끗|청결|위생/],
    neg: [/\bdirty\b/i, /\bnot (?:very |so |that )?clean\b/i, /\bunclean\b/i, /\bunhygienic\b/i,
      /\bsmell(?:s|ed|y)? (?:bad|weird|musty|awful)\b/i, /\bmusty\b/i, /\bcockroach/i, /\bbed ?bugs?\b/i, /\bmou?ld\b/i,
      /더럽|지저분|깨끗하지 (?:않|못)|청결하지 (?:않|못)|냄새가 심|악취|곰팡이|바퀴벌레/],
  },
  value: {
    pos: [/\bgood value\b/i, /\bgreat value\b/i, /\bvalue for money\b/i, /\breasonabl[ey] priced?\b/i,
      /\bfair pric/i, /\baffordable\b/i, /\bworth (?:it|every|the money|the price)\b/i, /\bcheap\b/i,
      /가성비|저렴|합리적인 가격|싸고|가격이 착/],
    neg: [/\bover-?priced\b/i, /\btoo expensive\b/i, /\brip[- ]?off\b/i, /\bovercharg/i, /\bhidden (?:fee|charge|cost)/i,
      /비싸|바가지|추가 ?(?:요금|금액)/],
  },
  staff: {
    pos: [/\bfriendly\b/i, /\bwelcoming\b/i, /\bpolite\b/i, /\bkind\b(?! of)/i, /\bhospitable\b/i, /\battentive\b/i,
      /(?<!불)친절/],
    neg: [/\brude\b/i, /\bunfriendly\b/i, /\bimpolite\b/i, /\barrogant\b/i, /\bbad attitude\b/i, /\bignored (?:us|me)\b/i,
      /불친절|무례|싸가지|태도가 (?:별로|안 좋|나쁘)/],
  },
  skill: {
    pos: [/\bskill(?:l)?ed\b/i, /\bprofessional\b/i, /\bexpert\b/i, /\bmagic(?:al)? hands\b/i,
      /\bknows? (?:what|exactly|the body)\b/i, /\bgreat technique\b/i,
      /실력|잘 ?(?:하|해)|전문적|시원/],
    neg: [/\bunskill(?:l)?ed\b/i, /\bunprofessional\b/i, /\bamateur/i, /\bjust rubb/i, /\blazy\b/i,
      /\bon (?:her|his|their) (?:phone|mobile)\b/i, /\btalk(?:ed|ing) (?:the whole time|all the time|on the phone)\b/i,
      /대충|성의 ?(?:없|가 없)|(?:핸드)?폰(?:을)? (?:보|만지)|실력이 (?:별로|없)/],
  },
  pressure: {
    pos: [/\b(?:good|perfect|strong|firm|right|great) pressure\b/i, /\bpressure was (?:good|perfect|great|just right|spot on)\b/i,
      /\basked (?:me )?(?:about|if) (?:the )?pressure\b/i,
      /압(?:이|을|도)? ?(?:딱|적당|좋|세게|강하게|조절)/],
    neg: [/\btoo (?:hard|rough|painful|soft|light|weak)\b/i, /\bno pressure\b/i, /\bnot (?:strong|firm|hard) enough\b/i,
      /\bbruis/i, /\bhurt (?:a lot|so much|badly)\b/i,
      /너무 (?:아프|아팠|세|셌|약|약했)|멍이 (?:들|생)/],
  },
  english: {
    pos: [/\b(?:speaks?|spoke|speaking) (?:good |great |some |fluent |decent |excellent )?english\b/i,
      /\benglish (?:was|is) (?:good|fine|great|ok|okay|excellent)\b/i],
    neg: [/\b(?:no|little|limited|poor|bad|zero|not much) english\b/i,
      /\b(?:do not|don't|didn't|doesn't|can't|couldn't|cannot) speak (?:any |much )?english\b/i,
      /\b(?:do not|don't|didn't|does not|doesn't|did not) (?:know|understand) (?:any |much )?english\b/i],
  },
};

// Reports, not satisfaction: how many reviews describe being pushed for a tip.
export const TIP_PRESSURE = [
  /\b(?:ask(?:ed|ing|s)?|demand(?:ed|ing|s)?|beg(?:ged|ging)?|push(?:ed|ing|y)?|pressur(?:e|ed|ing))\b.{0,25}\btips?\b/i,
  /\btips?\b.{0,20}\b(?:demand|pressure|expected|forced)\b/i,
  /팁.{0,12}(?:요구|강요|달라|요청|조르)/,
];

const NEGATED_BEFORE = /\b(?:not|never|no|n't|wasn't|isn't|weren't|aren't|hardly)\s+(?:\w+\s+){0,2}$/i;

// Korean negates after the word ("비싸지 않았다", "아프지도 않고", "요구하지 않습니다")
// or with 안/못 right before it ("안시원해요").
const KO_NEGATED_AFTER = /^[가-힣]{0,4}지(?:도|는|가)?\s*(?:않|못)/;
const KO_NEGATED_BEFORE = /(?:안|못)\s?$/;

function negated(text, m) {
  const before = text.slice(0, m.index);
  const after = text.slice(m.index + m[0].length, m.index + m[0].length + 10);
  return NEGATED_BEFORE.test(before) || KO_NEGATED_BEFORE.test(before) || KO_NEGATED_AFTER.test(after);
}

function hitAny(text, patterns, checkNegation) {
  for (const re of patterns) {
    const m = re.exec(text);
    if (!m) continue;
    if (checkNegation && negated(text, m)) continue;
    return true;
  }
  return false;
}

/** @returns {Record<string, {pos: number, neg: number}>} */
export function aspectCounts(reviews) {
  const out = Object.fromEntries(Object.keys(ASPECTS).map((k) => [k, { pos: 0, neg: 0 }]));
  for (const r of reviews ?? []) {
    const text = r?.text;
    if (!text) continue;
    for (const [key, { pos, neg }] of Object.entries(ASPECTS)) {
      // 부정 표현도 앞에 부정어가 오면 뒤집힌다: "wasn't too expensive", "not dirty".
      const isNeg = hitAny(text, neg, true);
      if (isNeg) out[key].neg++;
      else if (hitAny(text, pos, true)) out[key].pos++;
    }
  }
  return out;
}

export function tipPressureCount(reviews) {
  let n = 0;
  for (const r of reviews ?? []) if (r?.text && hitAny(r.text, TIP_PRESSURE, true)) n++;
  return n;
}

// ---------- trend over time ----------
export function relativeToMonths(rel) {
  const m = /^(?:edited\s+)?(a|an|\d+)\s+(hour|day|week|month|year)s?\s+ago/i.exec(String(rel ?? "").trim());
  if (!m) return null;
  const n = m[1] === "a" || m[1] === "an" ? 1 : parseInt(m[1], 10);
  switch (m[2].toLowerCase()) {
    case "hour": case "day": return 0;
    case "week": return Math.round((n * 7) / 30);
    case "month": return n;
    case "year": return n * 12;
    default: return null;
  }
}

const avg = (xs) => xs.reduce((s, x) => s + x, 0) / xs.length;
const round1 = (x) => Math.round(x * 10) / 10;

/** Last 6 months vs months 7–36. Null unless both windows have 8+ rated reviews. */
export function ratingTrend(reviews) {
  const recent = [], before = [];
  for (const r of reviews ?? []) {
    if (r?.rating == null) continue;
    const mo = relativeToMonths(r.relativeDate);
    if (mo == null) continue;
    if (mo <= 6) recent.push(r.rating);
    else if (mo <= 36) before.push(r.rating);
  }
  if (recent.length < 8 || before.length < 8) return null;
  return { recentAvg: round1(avg(recent)), recentN: recent.length, beforeAvg: round1(avg(before)), beforeN: before.length };
}

// ---------- reviewers ----------
export function reviewerProfile(reviews) {
  const withFlag = (reviews ?? []).filter((r) => r?.isLocalGuide != null);
  if (withFlag.length < 5) return null;
  const counts = withFlag.map((r) => r.authorReviewCount).filter((n) => Number.isFinite(n)).sort((a, b) => a - b);
  return {
    localGuidePct: Math.round((100 * withFlag.filter((r) => r.isLocalGuide).length) / withFlag.length),
    medianAuthorReviews: counts.length ? counts[Math.floor(counts.length / 2)] : null,
  };
}

// ---------- review languages (by script; Google leaves these untranslated) ----------
const SCRIPTS = { ko: /[가-힣]/, ja: /[぀-ヿ]/, zh: /[一-鿿]/, th: /[฀-๿]/, ru: /[Ѐ-ӿ]/ };
export function languageCounts(reviews) {
  const out = {};
  for (const r of reviews ?? []) {
    const t = r?.text;
    if (!t) continue;
    for (const [lang, re] of Object.entries(SCRIPTS)) {
      if (re.test(t)) { out[lang] = (out[lang] ?? 0) + 1; break; }
    }
  }
  return out;
}

// ---------- what reviewers actually paid ("฿200–400", "฿2,000+") ----------
// The scraper occasionally shifts a review's text into this column — accept only
// the short "฿…" band format, and only plausible amounts.
export function spentMidpoint(s) {
  const v = String(s ?? "").trim();
  if (!v.startsWith("฿") || v.length > 20) return null;
  const nums = v.replace(/,/g, "").match(/\d+/g);
  if (!nums) return null;
  const [a, b] = nums.map(Number);
  const mid = b != null ? Math.round((a + b) / 2) : a; // "฿2000+" → lower bound
  return mid >= 50 && mid <= 50000 ? mid : null;
}

export function placeInsights(reviews) {
  const withText = (reviews ?? []).filter((r) => r?.text);
  return {
    analysed: (reviews ?? []).length,
    withText: withText.length,
    aspects: aspectCounts(withText),
    tipPressure: tipPressureCount(withText),
    trend: ratingTrend(reviews),
    reviewers: reviewerProfile(reviews),
    languages: languageCounts(withText),
    spent: (reviews ?? []).map((r) => spentMidpoint(r.spent)).filter((n) => n != null),
  };
}
