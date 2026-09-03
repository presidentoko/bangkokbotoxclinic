import type { Restaurant } from "@/lib/types";
import type { NichePlace } from "@/lib/niches";

// The verdict — the one sentence a traveller who saw a venue on TikTok or
// Instagram actually came here for. The Trust Score is a continuous number
// and, because it is mostly rating × review volume, two thirds of the
// restaurant set clears 80. A number that high on nearly everything does
// not answer "should I go?". The verdict does, and every line of evidence
// it shows is a fact already in the record — nothing here is estimated.
//
// Codes are short because they travel into /search-index.json for every
// entry (thousands of rows) and are decoded client-side.

export type VerdictCode =
  | "worth-it"
  | "solid"
  | "mixed"
  | "overhyped"
  | "trap-risk"
  | "too-new"
  | "closed";

export type Evidence = {
  /** true = supports going, false = counts against, null = neutral fact */
  ok: boolean | null;
  text: string;
};

export type Verdict = {
  code: VerdictCode;
  label: string;
  emoji: string;
  tone: "green" | "teal" | "amber" | "red" | "gray";
  /** One plain sentence, written for someone holding a phone in a tuk-tuk. */
  summary: string;
  evidence: Evidence[];
};

export const VERDICT_META: Record<VerdictCode, { label: string; emoji: string; tone: Verdict["tone"]; short: string }> = {
  "worth-it": { label: "Worth it", emoji: "✅", tone: "green", short: "Worth it" },
  solid: { label: "Solid choice", emoji: "👍", tone: "teal", short: "Solid" },
  mixed: { label: "Mixed signals", emoji: "🤔", tone: "amber", short: "Mixed" },
  overhyped: { label: "Overhyped", emoji: "📉", tone: "amber", short: "Overhyped" },
  "trap-risk": { label: "Tourist-trap risk", emoji: "⚠️", tone: "red", short: "Trap risk" },
  "too-new": { label: "Too few reviews to call", emoji: "🆕", tone: "gray", short: "Unproven" },
  closed: { label: "Closed", emoji: "🚫", tone: "gray", short: "Closed" },
};

/** Compact code used inside the search index (one char). */
export const VERDICT_SHORT: Record<VerdictCode, string> = {
  "worth-it": "W",
  solid: "S",
  mixed: "M",
  overhyped: "O",
  "trap-risk": "T",
  "too-new": "N",
  closed: "C",
};
export const VERDICT_FROM_SHORT: Record<string, VerdictCode> = Object.fromEntries(
  Object.entries(VERDICT_SHORT).map(([k, v]) => [v, k as VerdictCode]),
);

// ---------------------------------------------------------------------------
// Restaurants
// ---------------------------------------------------------------------------

export type RestaurantContext = {
  /** Review-count 80th percentile of open venues in the same city. */
  volumeP80: number;
  /** Mean Google rating of open venues in the same city. */
  avgRating: number;
};

const _restaurantCtx = new Map<string, RestaurantContext>();

function isRestaurantClosed(r: Restaurant): "permanent" | "temporary" | null {
  const s = (r.business_status || "").toLowerCase();
  if (s.startsWith("permanently")) return "permanent";
  if (s.startsWith("temporarily") || s === "closed") return "temporary";
  return null;
}

/**
 * Per-city thresholds, computed once from the full set. "A lot of reviews"
 * means something different in Pattaya than in Bangkok, so the volume bar is
 * relative to the city rather than a fixed number.
 */
export function restaurantContext(all: Restaurant[], city: string): RestaurantContext {
  const cached = _restaurantCtx.get(city);
  if (cached) return cached;
  const open = all.filter((r) => r.city === city && !isRestaurantClosed(r));
  const vols = open.map((r) => r.total_reviews).sort((a, b) => a - b);
  const ctx: RestaurantContext = {
    volumeP80: vols.length ? vols[Math.floor(vols.length * 0.8)] : 500,
    avgRating: open.length ? open.reduce((s, r) => s + r.rating, 0) / open.length : 4.4,
  };
  _restaurantCtx.set(city, ctx);
  return ctx;
}

function topicCount(r: Restaurant, topic: string): number {
  return r.mentioned_topics?.find((t) => t.topic === topic)?.count ?? 0;
}

export function restaurantVerdict(r: Restaurant, ctx: RestaurantContext): Verdict {
  const closed = isRestaurantClosed(r);
  const trap = topicCount(r, "tourist_trap");
  const insta = topicCount(r, "instagram_worthy");
  const lines = topicCount(r, "long_lines") + topicCount(r, "long_wait");
  const expensive = topicCount(r, "expensive");
  const trend = r.rating_trend?.trend ?? "insufficient_data";
  const recent = r.rating_trend?.recent;
  const old = r.rating_trend?.old;
  const recentAvg = recent?.avg ?? null;
  const lgRatio = r.scraped_review_count > 0 ? r.local_guide_count / r.scraped_review_count : 0;
  const bigVolume = r.total_reviews >= ctx.volumeP80;

  const evidence: Evidence[] = [];

  // Rating relative to the city, not in a vacuum — 4.3 sounds good until
  // you learn the city average is 4.45.
  const diff = r.rating - ctx.avgRating;
  evidence.push({
    ok: diff >= 0.1 ? true : diff <= -0.2 ? false : null,
    text: `★${r.rating.toFixed(1)} on Google — ${
      diff >= 0.1 ? "above" : diff <= -0.2 ? "below" : "about"
    } the ${r.city_label || r.city} average of ★${ctx.avgRating.toFixed(2)}`,
  });

  evidence.push({
    ok: r.total_reviews >= 100 ? true : r.total_reviews < 30 ? false : null,
    text: `${r.total_reviews.toLocaleString()} reviews${bigVolume ? " — top 20% by volume in the city" : ""}`,
  });

  if (r.scraped_review_count >= 20) {
    evidence.push({
      ok: lgRatio >= 0.35 ? true : lgRatio < 0.15 ? false : null,
      text: `${Math.round(lgRatio * 100)}% of analysed reviewers are Google Local Guides (frequent, accountable reviewers)`,
    });
  }

  if (trend === "declining" && recentAvg != null && old?.avg != null) {
    evidence.push({
      ok: false,
      text: `Rating is falling: recent reviews average ★${recentAvg.toFixed(2)} vs ★${old.avg.toFixed(2)} earlier`,
    });
  } else if (trend === "improving" && recentAvg != null && old?.avg != null) {
    evidence.push({
      ok: true,
      text: `Rating is improving: recent reviews average ★${recentAvg.toFixed(2)} vs ★${old.avg.toFixed(2)} earlier`,
    });
  } else if (trend === "stable") {
    evidence.push({ ok: true, text: "Rating has been stable over time" });
  }

  if (trap > 0) {
    evidence.push({
      ok: false,
      text: `${trap} reviewer${trap === 1 ? "" : "s"} explicitly call${trap === 1 ? "s" : ""} it a tourist trap`,
    });
  }
  if (insta > 0) {
    evidence.push({
      ok: null,
      text: `${insta} reviewer${insta === 1 ? "" : "s"} mention coming for the photos — expect a crowd that is there for Instagram`,
    });
  }
  if (lines > 0) {
    evidence.push({ ok: null, text: `${lines} reviewer${lines === 1 ? "" : "s"} mention long queues or waits` });
  }
  if (expensive > 0) {
    evidence.push({ ok: null, text: `${expensive} reviewer${expensive === 1 ? "" : "s"} say it is expensive for what you get` });
  }
  if (topicCount(r, "michelin") > 0) {
    evidence.push({ ok: true, text: "Reviewers reference a Michelin listing" });
  }

  const meta = (code: VerdictCode, summary: string): Verdict => ({
    code,
    label: VERDICT_META[code].label,
    emoji: VERDICT_META[code].emoji,
    tone: VERDICT_META[code].tone,
    summary,
    evidence,
  });

  if (closed === "permanent") {
    evidence.unshift({ ok: false, text: "Google reports this venue as permanently closed" });
    return meta("closed", "Google lists this place as permanently closed. Do not travel here on the strength of an old video.");
  }
  if (closed === "temporary") {
    evidence.unshift({ ok: false, text: "Google reports this venue as temporarily closed" });
    return meta("closed", "Google lists this place as temporarily closed. Call before you go.");
  }
  if (r.total_reviews < 30) {
    return meta("too-new", `Only ${r.total_reviews} reviews so far — not enough to separate a real find from a lucky week.`);
  }
  const collapsing = trend === "declining" && recentAvg != null && recentAvg < 3.8 && (recent?.count ?? 0) >= 10;
  if ((trap >= 2 && r.rating < 4.3) || r.trust_score < 55 || collapsing) {
    return meta(
      "trap-risk",
      collapsing
        ? "Recent reviewers are rating it well below its old reputation. What the video showed may no longer be what you get."
        : "Reviewers who went are warning others. Read the recent reviews before you commit.",
    );
  }
  if (bigVolume && (r.rating < 4.3 || (trend === "declining" && recentAvg != null && recentAvg < 4.0))) {
    return meta(
      "overhyped",
      "Huge review volume but the score does not keep up — a lot of people go, and a lot leave underwhelmed.",
    );
  }
  if (r.rating >= 4.5 && r.total_reviews >= 100 && trend !== "declining" && trap === 0) {
    return meta("worth-it", "High rating, real volume, no warning signs. The reputation holds up in the data.");
  }
  if (r.rating >= 4.3 && r.total_reviews >= 50) {
    return meta(
      "solid",
      trap > 0
        ? "Good scores overall, with a few reviewers calling it touristy. Go for the food, not the hype."
        : "Good scores and enough reviews to trust them. Not a standout, not a mistake.",
    );
  }
  return meta("mixed", "The numbers neither confirm nor kill the hype. Check the recent reviews and decide for yourself.");
}

// ---------------------------------------------------------------------------
// Niche venues (spa, yoga, cooking, muay thai, diving, coworking, wellness)
// ---------------------------------------------------------------------------

export type NicheContext = {
  medianRating: number;
  medianReviews: number;
  /** Share of rated venues at ★4.5 or above. */
  share45: number;
};

const _nicheCtx = new Map<string, NicheContext>();

export function nicheContext(niche: string, places: NichePlace[]): NicheContext {
  const cached = _nicheCtx.get(niche);
  if (cached) return cached;
  const rated = places.filter((p) => p.rating != null && p.review_count != null && !p.permanently_closed);
  const ratings = rated.map((p) => p.rating as number).sort((a, b) => a - b);
  const reviews = rated.map((p) => p.review_count as number).sort((a, b) => a - b);
  const median = (xs: number[], fallback: number) => (xs.length ? xs[Math.floor(xs.length / 2)] : fallback);
  const ctx: NicheContext = {
    medianRating: median(ratings, 4.7),
    medianReviews: median(reviews, 50),
    share45: ratings.length ? ratings.filter((x) => x >= 4.5).length / ratings.length : 0.7,
  };
  _nicheCtx.set(niche, ctx);
  return ctx;
}

function latestReviewDate(p: NichePlace): Date | null {
  let best: Date | null = null;
  for (const rv of p.reviews_sample ?? []) {
    if (!rv.date) continue;
    const d = new Date(rv.date);
    if (Number.isNaN(d.getTime())) continue;
    if (!best || d > best) best = d;
  }
  return best;
}

export function nicheVerdict(p: NichePlace, nicheLabel: string, ctx: NicheContext): Verdict {
  const rating = p.rating ?? null;
  const reviews = p.review_count ?? 0;
  const evidence: Evidence[] = [];

  if (rating != null) {
    const diff = rating - ctx.medianRating;
    evidence.push({
      ok: diff >= 0.1 ? true : diff <= -0.3 ? false : null,
      text: `★${rating.toFixed(1)} on Google — the median ${nicheLabel.toLowerCase()} venue here is ★${ctx.medianRating.toFixed(1)}, and ${Math.round(ctx.share45 * 100)}% score 4.5 or higher, so the bar is high`,
    });
  }
  evidence.push({
    ok: reviews >= ctx.medianReviews ? true : reviews < 20 ? false : null,
    text: `${reviews.toLocaleString()} reviews (median for this category: ${ctx.medianReviews.toLocaleString()})`,
  });
  const last = latestReviewDate(p);
  if (last) {
    const months = Math.round((Date.now() - last.getTime()) / (30 * 24 * 3600 * 1000));
    evidence.push({
      ok: months <= 3 ? true : months >= 12 ? false : null,
      text: months <= 1 ? "Reviewed within the last month" : `Most recent review on file is ${months} months old`,
    });
  }
  if (p.is_suspected_viral) {
    evidence.push({ ok: null, text: "Review pattern looks like a social-media spike (many reviews in a short burst)" });
  }
  if (p.price_min_thb > 0) {
    evidence.push({ ok: null, text: `Listed from ฿${p.price_min_thb.toLocaleString()}${p.price_unit && p.price_unit !== "unknown" ? ` per ${p.price_unit}` : ""}` });
  }
  const langs = Object.entries(p.languages ?? {}).filter(([, v]) => v).map(([k]) => k.toUpperCase());
  if (langs.length > 1) {
    evidence.push({ ok: true, text: `Reviewers wrote in ${langs.join(", ")} — a genuinely mixed, international crowd` });
  }

  const meta = (code: VerdictCode, summary: string): Verdict => ({
    code,
    label: VERDICT_META[code].label,
    emoji: VERDICT_META[code].emoji,
    tone: VERDICT_META[code].tone,
    summary,
    evidence,
  });

  if (p.permanently_closed) {
    evidence.unshift({ ok: false, text: "Google reports this venue as permanently closed" });
    return meta("closed", "Google lists this place as permanently closed.");
  }
  if (rating == null || reviews < 20) {
    return meta("too-new", `Only ${reviews} reviews so far — not enough to separate a real find from a lucky week.`);
  }
  if (rating < 4.0 && reviews >= 30) {
    return meta("trap-risk", `★${rating.toFixed(1)} is far below what ${nicheLabel.toLowerCase()} venues normally score here. Reviewers are telling you something.`);
  }
  if ((p.is_suspected_viral && rating < 4.5) || (reviews >= ctx.medianReviews * 3 && rating < 4.3)) {
    return meta("overhyped", "Lots of attention, average scores. The crowd came for the video, not the experience.");
  }
  if (rating >= 4.7 && reviews >= Math.max(30, ctx.medianReviews)) {
    return meta("worth-it", "Top-tier rating with more reviews than most of its peers. The reputation is earned.");
  }
  if (rating >= 4.4) {
    return meta("solid", "Good scores from enough people to trust them. A safe pick, if not the standout.");
  }
  return meta("mixed", "Scores sit below the category's usual bar. Read the recent reviews before booking.");
}
