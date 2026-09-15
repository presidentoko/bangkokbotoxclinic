// lib/verdict.ts
// One honest verdict per restaurant, for the "I saw this on Instagram — is it
// actually good?" moment.
//
// GSC says every impression we get is a long-tail *branded* query: someone
// watched a reel, searched the venue's name, and we surfaced around position
// 10. We can't outrank Google's own business panel for a venue's name, so the
// play is to answer the question the searcher actually has, in the <title>
// itself, and to own the skeptical queries ("worth it", "overrated", "real
// reviews") that the incumbents don't target.
//
// Everything here is derived from data we already collected. Nothing is
// invented, and every verdict carries a `reason` built out of real counts so
// the claim is checkable by the reader.
//
// Pure module on purpose — no node:fs, no data loading — so client components
// can import it (see lib/slug.ts for the same constraint).

import type { Restaurant } from "@/lib/types";

export type VerdictKind =
  | "slipping"
  | "hidden_gem"
  | "holds_up"
  | "steady"
  | "solid"
  | "mixed"
  | "thin_data";

export type Verdict = {
  kind: VerdictKind;
  /** Short chip label — fits on a card. */
  label: string;
  /** The claim, stated as data rather than judgement. Always checkable. */
  reason: string;
  /**
   * Headline for <title>. Kept deliberately terse: Google renders roughly 60
   * characters, the venue name has to come first (it's the query), and if the
   * verdict clause falls outside that window the whole exercise is pointless.
   * Measured across the database, these phrasings put 88% of titles inside the
   * limit — but only with the "| SNS Stopper" suffix dropped, which is why the
   * restaurant route sets an absolute title. Separator is an em dash, not a
   * colon, because plenty of venue names contain a colon already.
   */
  headline: string;
  icon: string;
  /** Tailwind-free colours; components pass these straight to style props. */
  fg: string;
  bg: string;
};

// ── Guardrails ────────────────────────────────────────────────────────────────
//
// Publishing "this place is getting worse" about a named, real business is a
// reputational claim, so it needs a real sample behind it on BOTH sides of the
// comparison. A prototype without MIN_TREND_BUCKET flagged a venue as slipping
// off a baseline of a single old 5-star review ("recent 4.06 from 50 reviews vs
// old 5.0 from 1") — arithmetically true, statistically meaningless, and
// exactly the kind of claim we should never put in a <title>.
//
// Same spirit as GUARD_MIN in lib/famous-vs-good.ts: when in doubt, decline to
// judge rather than judge loosely.

/** Minimum reviews in BOTH the recent and old buckets before comparing them. */
export const MIN_TREND_BUCKET = 8;
/** Minimum drop in average stars before we'll call a trend a decline. */
export const MIN_TREND_DROP = 0.25;
/** Below this many scraped reviews we have nothing to analyse — say so. */
export const MIN_ANALYSED_REVIEWS = 15;

/** Trust score at or above which a venue is doing well by our own metric. */
const STRONG_TRUST = 88;
const SOLID_TRUST = 78;
/** A venue this far under the radar is a find, not a crowd pick. */
const GEM_MAX_REVIEWS = 400;

function pct(n: number): string {
  return n.toLocaleString();
}

/**
 * Classify a restaurant. Order matters: `slipping` is checked first because a
 * falling trend is the single most useful thing we know and it outranks a high
 * headline rating (Google will show 4.9 forever; we're the ones who can say the
 * last fifteen visitors averaged 4.27).
 */
/**
 * Build the SERP title: venue name, then the verdict clause.
 *
 * The clause is the whole point of the title and it sits at the end, so when
 * the name is long Google renders the name and cuts the verdict off. 20% of
 * titles ran past the ~60 characters Google shows, and a few names are long
 * enough to eat the clause entirely ("Blue Sky Rooftop Restaurant & Bar at
 * Centara Grand at Central Plaza Ladprao Bangkok — holds up, 94/100").
 *
 * So the name yields, not the verdict. Trim the name to whatever is left
 * after the clause, on a word boundary where there is one. Names shorter
 * than MIN_NAME_CHARS are never trimmed — a title that cannot show both
 * legibly is better long than mangled.
 *
 * Some venue names carry the separator themselves ("Choorotz — ห้องอาหารชูรส").
 * Callers that need to split a title back apart must use lastIndexOf.
 */
const SERP_LIMIT = 60;
const MIN_NAME_CHARS = 18;

export function verdictTitle(name: string, clause: string): string {
  const full = `${name} — ${clause}`;
  if (full.length <= SERP_LIMIT) return full;

  const room = SERP_LIMIT - clause.length - 3 - 1; // " — " and the ellipsis
  if (room < MIN_NAME_CHARS) return full;

  let short = name.slice(0, room);
  const space = short.lastIndexOf(" ");
  if (space >= MIN_NAME_CHARS) short = short.slice(0, space);
  return `${short.trimEnd()}… — ${clause}`;
}

export function getVerdict(r: Restaurant): Verdict {
  const analysed = r.scraped_review_count ?? 0;

  if (analysed < MIN_ANALYSED_REVIEWS) {
    return {
      kind: "thin_data",
      label: "Not enough data",
      reason: `We've analysed ${pct(analysed)} recent review${analysed === 1 ? "" : "s"} — too few to call. Google's overall score is ${r.rating.toFixed(1)}.`,
      headline: verdictTitle(r.name, "too few recent reviews to judge"),
      icon: "○",
      fg: "#64748b",
      bg: "#f1f5f9",
    };
  }

  const recent = r.rating_trend?.recent;
  const old = r.rating_trend?.old;
  const comparable =
    !!recent?.avg &&
    !!old?.avg &&
    recent.count >= MIN_TREND_BUCKET &&
    old.count >= MIN_TREND_BUCKET;
  const drop = comparable ? old!.avg! - recent!.avg! : 0;

  if (comparable && drop >= MIN_TREND_DROP) {
    return {
      kind: "slipping",
      label: "Ratings falling",
      // Data, not a verdict on the food. The reader draws the conclusion.
      reason: `Its ${pct(recent!.count)} most recent reviews average ${recent!.avg!.toFixed(2)}★, against ${old!.avg!.toFixed(2)}★ from ${pct(old!.count)} older ones.`,
      headline: verdictTitle(r.name, "recent reviews are lower"),
      icon: "▼",
      fg: "#b45309",
      bg: "#fffbeb",
    };
  }

  const lgRatio = analysed > 0 ? r.local_guide_count / analysed : 0;
  const credibility = `${pct(r.local_guide_count)} of the ${pct(analysed)} reviews we analysed are by Google Local Guides`;

  if (r.trust_score >= STRONG_TRUST && r.total_reviews < GEM_MAX_REVIEWS) {
    return {
      kind: "hidden_gem",
      label: "Under the radar",
      reason: `Scores ${r.trust_score.toFixed(0)}/100 on just ${pct(r.total_reviews)} Google reviews — strong marks without the crowds. ${credibility}.`,
      headline: verdictTitle(r.name, `under the radar, ${r.trust_score.toFixed(0)}/100`),
      icon: "◆",
      fg: "#7c3aed",
      bg: "#f5f3ff",
    };
  }

  if (r.trust_score >= STRONG_TRUST) {
    return {
      kind: "holds_up",
      label: "Holds up",
      // "no drop in recent ratings" 는 최근·과거를 실제로 비교한 곳에만 쓴다.
      // 전엔 무조건 붙어서 holds_up 1,584곳 중 600곳이 확인 안 한 주장을 달고
      // 있었다 — 리뷰가 한 시기에 몰려 비교 버킷이 비는 가게들이다.
      reason: `Scores ${r.trust_score.toFixed(0)}/100 across ${pct(r.total_reviews)} Google reviews${comparable ? ", with no drop in recent ratings" : ""}. ${credibility}.`,
      headline: verdictTitle(r.name, `holds up, ${r.trust_score.toFixed(0)}/100`),
      icon: "✓",
      fg: "#15803d",
      bg: "#f0fdf4",
    };
  }

  // steady: solid 점수대이면서 최근·과거를 비교할 수 있는 곳. 여기까지 왔다면
  // slipping 분기를 이미 통과했으니 하락폭은 MIN_TREND_DROP 미만이다.
  //
  // solid 가 DB 절반(51%)을 넘어 감사 가드레일에 걸렸다. 기준점을 올려서
  // 줄이면 실제 식당을 "mixed reviews" 로 강등하는 것이라 하지 않았다. 대신
  // 증거가 더 있는 곳에 더 구체적인 — 그리고 확인된 — 긍정 판정을 준다.
  // "뜨고 나서 변했나?" 에 답하는 판정이라 이 사이트 포지션에도 맞는다.
  if (r.trust_score >= SOLID_TRUST && comparable) {
    return {
      kind: "steady",
      label: "Consistent",
      reason: `Its ${pct(recent!.count)} most recent reviews average ${recent!.avg!.toFixed(2)}★, in line with ${old!.avg!.toFixed(2)}★ from ${pct(old!.count)} older ones. Scores ${r.trust_score.toFixed(0)}/100. ${credibility}.`,
      headline: verdictTitle(r.name, `consistent, ${r.trust_score.toFixed(0)}/100`),
      icon: "=",
      fg: "#1d4ed8",
      bg: "#eff6ff",
    };
  }

  if (r.trust_score >= SOLID_TRUST) {
    return {
      kind: "solid",
      label: "Solid",
      reason: `Scores ${r.trust_score.toFixed(0)}/100 across ${pct(r.total_reviews)} Google reviews. ${credibility}.`,
      headline: verdictTitle(r.name, `worth it? ${r.trust_score.toFixed(0)}/100`),
      icon: "•",
      fg: "#0f766e",
      bg: "#f0fdfa",
    };
  }

  return {
    kind: "mixed",
    label: "Mixed reviews",
    reason: `Scores ${r.trust_score.toFixed(0)}/100 across ${pct(r.total_reviews)} Google reviews${lgRatio < 0.2 ? ", and few of its reviewers are Local Guides" : ""}.`,
    headline: verdictTitle(r.name, `mixed reviews, ${r.trust_score.toFixed(0)}/100`),
    icon: "~",
    fg: "#a16207",
    bg: "#fefce8",
  };
}

// ── Hub metadata ──────────────────────────────────────────────────────────────
//
// Only the four verdicts worth a landing page get one. "solid" and "thin_data"
// are the residual buckets — a page listing 783 merely-fine restaurants helps
// nobody and would be exactly the thin, templated content that gets a site's
// whole account judged (see web-thaigle's PLACE_TREE_INDEXABLE note).

export type VerdictHub = {
  kind: VerdictKind;
  slug: string;
  title: string;
  heading: string;
  blurb: string;
};

export const VERDICT_HUBS: VerdictHub[] = [
  {
    kind: "slipping",
    slug: "ratings-falling",
    title: "Bangkok & Pattaya restaurants whose ratings are falling",
    heading: "Ratings are falling",
    blurb:
      "Google shows one lifetime average forever. These places rate materially lower in their most recent reviews than in their older ones — worth knowing before you queue.",
  },
  {
    kind: "hidden_gem",
    slug: "under-the-radar",
    title: "Under-the-radar Bangkok & Pattaya restaurants",
    heading: "Under the radar",
    blurb:
      "High scores, low review counts. These aren't on the reel circuit yet — no queue, no hype tax.",
  },
  {
    kind: "holds_up",
    slug: "holds-up",
    title: "Bangkok & Pattaya restaurants that live up to the hype",
    heading: "Lives up to it",
    blurb:
      "Heavily reviewed and still scoring high. The famous ones that are actually worth the trip.",
  },
  {
    kind: "steady",
    slug: "consistent",
    title: "Bangkok & Pattaya restaurants that haven't changed",
    heading: "Still as good as it was",
    blurb:
      "Places often slip once they go viral. These score as well in their recent reviews as in their older ones — the quality held.",
  },
  {
    kind: "mixed",
    slug: "mixed-reviews",
    title: "Bangkok & Pattaya restaurants with mixed reviews",
    heading: "Mixed reviews",
    blurb:
      "Reviewers disagree about these. Read the detail before you commit your one free evening to one.",
  },
];

export function getVerdictHub(slug: string): VerdictHub | undefined {
  return VERDICT_HUBS.find((h) => h.slug === slug);
}
