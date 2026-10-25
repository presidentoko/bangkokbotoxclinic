// Venue-vs-venue comparison: the arithmetic and the sentences.
//
// Pure on purpose — no I/O, no runtime imports, only `import type`. That lets
// scripts/vs-metrics.test.mjs run it directly under Node's type stripping, and
// it is the reason the rules below could be checked against the real dataset
// instead of being trusted.
//
// The rule is the one lib/verdict.ts states for the single-venue verdict:
// everything printed is a fact already in the record, or arithmetic on facts
// already in the record. A row whose inputs are missing is dropped, never
// filled in. Sentences that name a winner only exist when a measured gap
// supports them.
//
// What this deliberately does not use: the Klook search hits in
// data/per_place_klook.json. Measured 2026-10-19, none of the 1,103 entries
// carries a price, and for muay thai only 24 of 45 top hits even share a word
// with the venue they are filed under — they are search results, not that
// venue's products, and presenting them as such would be invented data.

import type { NichePlace } from "./niches";

// ── confidence-adjusted rating ─────────────────────────────────────────────

/**
 * Pseudo-reviews at the category average. A ★4.9 from 12 people and a ★4.7
 * from 1,400 are not the same claim; this pulls thin evidence toward the
 * average of its peers and leaves well-evidenced ratings almost untouched
 * (at 1,400 reviews the pull is 3.5%). 50 is small enough not to bury a
 * genuinely good newcomer and large enough that 10-20 reviews cannot top a
 * list on their own.
 */
export const ADJUST_WEIGHT = 50;

export function adjustedRating(
  rating: number | null | undefined,
  reviews: number | null | undefined,
  prior: number,
  weight: number = ADJUST_WEIGHT,
): number | null {
  if (rating == null || reviews == null || reviews <= 0) return null;
  return (reviews / (reviews + weight)) * rating + (weight / (reviews + weight)) * prior;
}

// ── opening hours ──────────────────────────────────────────────────────────

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;

type Meridiem = "AM" | "PM";
const TIME = /^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)?$/i;

function toMinutes(h: number, m: number, mer: Meridiem): number | null {
  if (h < 1 || h > 12 || m < 0 || m > 59) return null;
  return (h % 12) * 60 + m + (mer === "PM" ? 720 : 0);
}

/**
 * Google collapses a shared meridiem: "3 to 6 PM" is 3 PM-6 PM, "9 to 10 AM,
 * 12 to 3 PM" is two ranges. So an unmarked start takes the end's meridiem.
 * That is only safe because Google writes both when they differ ("11 AM to
 * 2 PM"), which the shape survey of the 3,946 venues confirmed.
 */
function parseRange(raw: string): { start: number; end: number } | null {
  const parts = raw.split(/\s+to\s+/i);
  if (parts.length !== 2) return null;
  const s = TIME.exec(parts[0].trim());
  const e = TIME.exec(parts[1].trim());
  if (!s || !e || !e[3]) return null;
  const endMer = e[3].toUpperCase() as Meridiem;
  const startMer = (s[3] ? s[3].toUpperCase() : endMer) as Meridiem;
  const start = toMinutes(Number(s[1]), s[2] ? Number(s[2]) : 0, startMer);
  let end = toMinutes(Number(e[1]), e[2] ? Number(e[2]) : 0, endMer);
  if (start == null || end == null) return null;
  // "7 AM to 1 AM" and "12 PM to 12 AM" close after midnight.
  if (end <= start) end += 1440;
  return { start, end };
}

type Day = { open: boolean; minutes: number; first: number; close: number; is24h: boolean };

function parseDay(value: unknown): Day | null {
  if (typeof value !== "string") return null;
  const s = value.replace(/[   ]/g, " ").replace(/\s+/g, " ").trim();
  if (/^closed$/i.test(s)) return { open: false, minutes: 0, first: 0, close: 0, is24h: false };
  if (/^open 24 hours$/i.test(s)) return { open: true, minutes: 1440, first: 0, close: 1440, is24h: true };
  const ranges = s.split(",").map((r) => parseRange(r.trim()));
  if (ranges.length === 0 || ranges.some((r) => r === null)) return null;
  const rs = ranges as { start: number; end: number }[];
  return {
    open: true,
    minutes: Math.min(1440, rs.reduce((t, r) => t + (r.end - r.start), 0)),
    first: Math.min(...rs.map((r) => r.start)),
    close: Math.max(...rs.map((r) => r.end)),
    is24h: false,
  };
}

export type HoursSummary =
  | { known: false }
  | {
      known: true;
      daysOpen: number;
      /** Mean length of the days the venue is open, in hours. */
      avgHoursPerOpenDay: number;
      /** Latest closing time on any day, minutes after midnight; > 1440 is the next morning. */
      latestClose: number;
      /**
       * Earliest closing time across the days it opens — the hour it is open
       * until every night it trades. "Open late" claims use this, not
       * latestClose, so a place that stays up only on Saturdays doesn't count.
       */
      earliestClose: number;
      earliestOpen: number;
      opensSunday: boolean;
      open24: boolean;
    };

/**
 * Needs all seven days to parse. A partial week would make "open 5 days"
 * a claim about the parser rather than the venue, so any day that is missing
 * or unreadable makes the whole summary unknown and the rows disappear.
 */
export function summarizeHours(json: string | null | undefined): HoursSummary {
  if (!json) return { known: false };
  let obj: Record<string, unknown>;
  try {
    obj = JSON.parse(json) as Record<string, unknown>;
  } catch {
    return { known: false };
  }
  const days: Day[] = [];
  for (const d of DAYS) {
    const parsed = parseDay(obj?.[d]);
    if (!parsed) return { known: false };
    days.push(parsed);
  }
  const open = days.filter((d) => d.open);
  if (open.length === 0) return { known: false };
  return {
    known: true,
    daysOpen: open.length,
    avgHoursPerOpenDay: open.reduce((t, d) => t + d.minutes, 0) / open.length / 60,
    latestClose: Math.max(...open.map((d) => d.close)),
    earliestClose: Math.min(...open.map((d) => d.close)),
    earliestOpen: Math.min(...open.map((d) => d.first)),
    opensSunday: days[6].open,
    open24: open.every((d) => d.is24h),
  };
}

/**
 * "table": `2 AM (next day)`. "prose": `2 AM the next day`, for use inside a
 * sentence that may already be in parentheses.
 */
export function formatClock(min: number, style: "table" | "prose" = "table"): string {
  const nextDay = min > 1440;
  const m = ((min % 1440) + 1440) % 1440;
  const h24 = Math.floor(m / 60);
  const mm = m % 60;
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  const s = `${h12}${mm ? `:${String(mm).padStart(2, "0")}` : ""} ${h24 < 12 ? "AM" : "PM"}`;
  if (!nextDay) return s;
  return style === "prose" ? `${s} the next day` : `${s} (next day)`;
}

// ── small helpers ──────────────────────────────────────────────────────────

const NAME_MAX = 52;

/**
 * The name as a sentence wants it. Category tails go ("X : Spa & Massage :
 * Charoen Nakhon" is X). A long name is cut at its own separators — " - ",
 * a comma, a parenthesis — and the first segment that is actually readable in
 * Latin script wins, because this page is in English and the other segment
 * is often a Thai or Korean twin of the same name. If nothing separates it,
 * it is cut at a word, never with an ellipsis: "Gin Restaurant - Since 2014
 * by…" in the middle of a sentence reads as a bug.
 */
export function shortName(name: string): string {
  const base = name.split(/\s[:|]\s|\s[–—]\s/)[0].trim() || name.trim();
  if (base.length <= NAME_MAX) return base;
  const segs = base.split(/\s+-\s+|,\s+|\s+\(/).map((x) => x.replace(/\)$/, "").trim()).filter(Boolean);
  const readable = segs.find((x) => (x.match(/[A-Za-z]/g) ?? []).length >= 4);
  const chosen = readable ?? segs[0] ?? base;
  if (chosen.length <= NAME_MAX) return chosen;
  const cut = chosen.slice(0, NAME_MAX);
  const sp = cut.lastIndexOf(" ");
  return (sp >= 12 ? cut.slice(0, sp) : cut).trim();
}

/** Short names for a pair; falls back to the full names if they would collide. */
export function pairNames(a: Pick<NichePlace, "name">, b: Pick<NichePlace, "name">): [string, string] {
  const x = shortName(a.name);
  const y = shortName(b.name);
  return x === y ? [a.name.trim(), b.name.trim()] : [x, y];
}

/** "a", "a and b", "a, b and c". */
export function joinAnd(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

const LANG_LABEL: Record<string, string> = { en: "English", th: "Thai", ko: "Korean", zh: "Chinese", ja: "Japanese", ar: "Arabic" };

export function reviewLanguages(p: Pick<NichePlace, "languages">): string[] {
  return Object.entries(p.languages ?? {})
    .filter(([, v]) => v)
    .map(([k]) => LANG_LABEL[k] ?? k.toUpperCase());
}

export function latestReviewTime(p: Pick<NichePlace, "reviews_sample">): number | null {
  let best: number | null = null;
  for (const rv of p.reviews_sample ?? []) {
    if (!rv.date) continue;
    const t = new Date(rv.date).getTime();
    if (Number.isNaN(t)) continue;
    if (best == null || t > best) best = t;
  }
  return best;
}

function monthYear(t: number): string {
  return new Date(t).toLocaleDateString("en-GB", { month: "short", year: "numeric", timeZone: "UTC" });
}

const fmtInt = (n: number) => n.toLocaleString("en-US");
const fmtRating = (n: number) => n.toFixed(1);
const fmtAdj = (n: number) => n.toFixed(2);
const fmtHours = (n: number) => (Math.abs(n - Math.round(n)) < 0.05 ? String(Math.round(n)) : n.toFixed(1));

// ── the comparison ─────────────────────────────────────────────────────────

export type Edge = "a" | "b" | null;

/**
 * How big a gap has to be before a row marks a leader. One table, read by the
 * comparison and by the sentence under the table on the page, so the two
 * cannot drift apart. Below these a difference is noise and stays unmarked.
 */
export const EDGE = {
  rating: 0.1,
  /** Larger review count divided by the smaller. */
  reviewRatio: 1.5,
  adjusted: 0.03,
  trust: 3,
  days: 1,
  /** Average hours per open day. */
  dayHours: 1,
  closeMinutes: 60,
  recentDays: 90,
} as const;

export type Row = {
  id: string;
  label: string;
  a: string;
  b: string;
  edge: Edge;
};

export type Comparison = {
  rows: Row[];
  /** Who comes out ahead overall, or null when the numbers do not separate them. */
  pick: Edge;
  headline: string;
  /** One self-contained line (≈150 chars) for the meta description. */
  summary: string;
  howToChoose: string[];
  faqs: { q: string; a: string }[];
  adjustedA: number | null;
  adjustedB: number | null;
};

export type CompareContext = {
  niche: string;
  nicheLabel: string;
  /** Category median rating, the prior for adjustedRating(). */
  medianRating: number;
  /** "Sukhumvit", "Chiang Mai" — where the pair was drawn from. */
  scopeLabel: string;
  /** Collection date of the Google data, for the method note. */
  generatedAt?: string;
};

type Side = {
  p: NichePlace;
  name: string;
  adj: number | null;
  hours: HoursSummary;
  last: number | null;
};

/** How a row reads inside a sentence ("has the edge on review volume"). */
const SHORT: Record<string, string> = {
  rating: "Google rating",
  reviews: "review volume",
  adjusted: "adjusted rating",
  trust: "Trust Score",
  days: "days open per week",
  daylen: "length of the opening day",
  close: "closing time",
  sunday: "Sunday opening",
  price: "price",
  langs: "range of review languages",
  recent: "recency of reviews",
  beginner: "beginner-friendliness",
};

const BEGINNER_NICHES = new Set(["muay-thai", "yoga-pilates", "cooking", "diving"]);

function higher(x: number | null, y: number | null, min: number): Edge {
  if (x == null || y == null) return null;
  if (x - y >= min) return "a";
  if (y - x >= min) return "b";
  return null;
}

function lower(x: number | null, y: number | null, min: number): Edge {
  const e = higher(x, y, min);
  return e === "a" ? "b" : e === "b" ? "a" : null;
}

export function compareVenues(pa: NichePlace, pb: NichePlace, ctx: CompareContext): Comparison {
  const mk = (p: NichePlace): Side => ({
    p,
    name: shortName(p.name),
    adj: adjustedRating(p.rating, p.review_count, ctx.medianRating),
    hours: summarizeHours(p.opening_hours_json),
    last: latestReviewTime(p),
  });
  const A = mk(pa);
  const B = mk(pb);
  [A.name, B.name] = pairNames(pa, pb);
  const rows: Row[] = [];

  // — Google rating and the volume behind it
  if (pa.rating != null && pb.rating != null) {
    rows.push({ id: "rating", label: "Google rating", a: `★${fmtRating(pa.rating)}`, b: `★${fmtRating(pb.rating)}`, edge: higher(pa.rating, pb.rating, EDGE.rating) });
  }
  const ra = pa.review_count ?? 0;
  const rb = pb.review_count ?? 0;
  if (ra > 0 && rb > 0) {
    const ratio = Math.max(ra, rb) / Math.min(ra, rb);
    rows.push({ id: "reviews", label: "Google reviews", a: fmtInt(ra), b: fmtInt(rb), edge: ratio >= EDGE.reviewRatio ? (ra > rb ? "a" : "b") : null });
  }
  if (A.adj != null && B.adj != null) {
    rows.push({ id: "adjusted", label: "Confidence-adjusted rating", a: fmtAdj(A.adj), b: fmtAdj(B.adj), edge: higher(A.adj, B.adj, EDGE.adjusted) });
  }
  if (pa.trust_score > 0 && pb.trust_score > 0) {
    rows.push({ id: "trust", label: "Thaigle Trust Score", a: String(Math.round(pa.trust_score)), b: String(Math.round(pb.trust_score)), edge: higher(pa.trust_score, pb.trust_score, EDGE.trust) });
  }

  // — hours
  const ha = A.hours;
  const hb = B.hours;
  if (ha.known && hb.known) {
    rows.push({ id: "days", label: "Days open per week", a: String(ha.daysOpen), b: String(hb.daysOpen), edge: higher(ha.daysOpen, hb.daysOpen, EDGE.days) });
    rows.push({
      id: "daylen",
      label: "Typical opening day",
      a: ha.open24 ? "24 hours" : `${fmtHours(ha.avgHoursPerOpenDay)} h`,
      b: hb.open24 ? "24 hours" : `${fmtHours(hb.avgHoursPerOpenDay)} h`,
      edge: higher(ha.avgHoursPerOpenDay, hb.avgHoursPerOpenDay, EDGE.dayHours),
    });
    rows.push({
      id: "close",
      label: "Latest closing time",
      a: ha.open24 ? "Open 24 hours" : formatClock(ha.latestClose),
      b: hb.open24 ? "Open 24 hours" : formatClock(hb.latestClose),
      edge: higher(ha.latestClose, hb.latestClose, EDGE.closeMinutes),
    });
    rows.push({ id: "sunday", label: "Open on Sunday", a: ha.opensSunday ? "Yes" : "No", b: hb.opensSunday ? "Yes" : "No", edge: ha.opensSunday === hb.opensSunday ? null : ha.opensSunday ? "a" : "b" });
  }

  // — price, only when both list one
  if (pa.price_min_thb > 0 && pb.price_min_thb > 0) {
    const unit = (p: NichePlace) => (p.price_unit && p.price_unit !== "unknown" ? ` / ${p.price_unit}` : "");
    const comparable = pa.price_unit === pb.price_unit;
    rows.push({
      id: "price",
      label: "Listed price from",
      a: `฿${fmtInt(pa.price_min_thb)}${unit(pa)}`,
      b: `฿${fmtInt(pb.price_min_thb)}${unit(pb)}`,
      edge: comparable ? lower(pa.price_min_thb, pb.price_min_thb, Math.max(50, Math.min(pa.price_min_thb, pb.price_min_thb) * 0.1)) : null,
    });
  }

  // — who writes the reviews
  const la = reviewLanguages(pa);
  const lb = reviewLanguages(pb);
  if (la.length || lb.length) {
    rows.push({ id: "langs", label: "Reviews written in", a: la.join(", ") || "—", b: lb.join(", ") || "—", edge: higher(la.length, lb.length, 1) });
  }

  // — recency
  if (A.last != null && B.last != null) {
    rows.push({ id: "recent", label: "Latest review on file", a: monthYear(A.last), b: monthYear(B.last), edge: higher(A.last, B.last, EDGE.recentDays * 86_400_000) });
  }

  // — niche-specific
  if (BEGINNER_NICHES.has(ctx.niche)) {
    rows.push({ id: "beginner", label: "Described as beginner-friendly", a: pa.is_beginner_friendly ? "Yes" : "No", b: pb.is_beginner_friendly ? "Yes" : "No", edge: pa.is_beginner_friendly === pb.is_beginner_friendly ? null : pa.is_beginner_friendly ? "a" : "b" });
  }

  // ── who comes out ahead ──────────────────────────────────────────────────
  // Only quality signals decide who is "ahead": the adjusted rating (triple,
  // because it already folds rating and volume together), the Trust Score,
  // review volume and recency. Days open and closing time are convenience —
  // they are reported and they feed "how to choose", but a spa that closes an
  // hour later has not become a better spa, so they never tip the call. A lead
  // of 2 is two independent signals agreeing (or the adjusted rating alone);
  // below that the page says so instead of inventing a winner.
  const WEIGHT: Record<string, number> = { adjusted: 3, trust: 1, reviews: 1, recent: 1 };
  let score = 0;
  for (const r of rows) {
    const w = WEIGHT[r.id];
    if (!w || !r.edge) continue;
    score += r.edge === "a" ? w : -w;
  }
  const pick: Edge = score >= 2 ? "a" : score <= -2 ? "b" : null;

  // Reasons a side leads, split the way pick is: quality decides who is ahead,
  // convenience (days open, closing time) is reported next to it, never inside it.
  const reasonFor = (side: "a" | "b", kind: "all" | "quality" | "convenience" = "all"): string[] => {
    const out: string[] = [];
    const row = (id: string) => rows.find((r) => r.id === id && r.edge === side);
    const val = (r: Row, who: "me" | "them") => (side === "a" ? (who === "me" ? r.a : r.b) : who === "me" ? r.b : r.a);
    const q = kind !== "convenience";
    const c = kind !== "quality";
    const adj = row("adjusted");
    if (q && adj) out.push(`a higher confidence-adjusted rating (${val(adj, "me")} against ${val(adj, "them")})`);
    const rev = row("reviews");
    if (q && rev) out.push(`more reviews behind its score (${val(rev, "me")} against ${val(rev, "them")})`);
    const tr = row("trust");
    if (q && tr) out.push(`a higher Trust Score (${val(tr, "me")} against ${val(tr, "them")})`);
    const rec = row("recent");
    if (q && rec) out.push(`more recent reviews on file (${val(rec, "me")} against ${val(rec, "them")})`);
    const days = row("days");
    if (c && days) out.push(`longer weekly availability (${val(days, "me")} days against ${val(days, "them")})`);
    const close = row("close");
    if (c && close) out.push(`later opening hours (closing ${val(close, "me")} against ${val(close, "them")})`);
    return out;
  };

  /** "On convenience: X is open 7 days a week against 6; Y stays open later (8 PM against 6:30 PM)." */
  const convenienceLine = (): string => {
    const parts: string[] = [];
    for (const side of ["a", "b"] as const) {
      const who = side === "a" ? A.name : B.name;
      const mine = reasonFor(side, "convenience");
      if (mine.length) parts.push(`${who} has ${joinAnd(mine)}`);
    }
    return parts.length ? ` On convenience: ${parts.join("; ")}.` : "";
  };

  const ahead = pick ? (pick === "a" ? A : B) : null;
  const behind = pick ? (pick === "a" ? B : A) : null;
  let headline: string;
  if (pick && ahead && behind) {
    const why = reasonFor(pick, "quality").slice(0, 3);
    const back = reasonFor(pick === "a" ? "b" : "a", "quality").slice(0, 1);
    headline =
      `On the numbers we hold, ${ahead.name} comes out ahead of ${behind.name}: ${joinAnd(why)}.` +
      (back.length ? ` ${behind.name} does have ${back[0]}.` : "") +
      convenienceLine() +
      ` Treat it as a lean, not a ruling — the next section says what the data cannot tell you.`;
  } else {
    const parts: string[] = [];
    if (A.adj != null && B.adj != null) {
      parts.push(`once review volume is accounted for their ratings sit ${fmtAdj(Math.abs(A.adj - B.adj))} apart (${fmtAdj(A.adj)} against ${fmtAdj(B.adj)})`);
    }
    const spread = rows.filter((r) => r.edge && ["reviews", "days", "close", "recent", "trust"].includes(r.id)).slice(0, 4);
    const bits = (["a", "b"] as const)
      .map((side) => {
        const labels = spread.filter((r) => r.edge === side).map((r) => SHORT[r.id] ?? r.label.toLowerCase());
        return labels.length ? `${side === "a" ? A.name : B.name} has the edge on ${joinAnd(labels)}` : "";
      })
      .filter(Boolean);
    headline =
      `${A.name} and ${B.name} are too close to call on the numbers: ${parts.join(", ") || "their scores do not separate them"}` +
      (bits.length ? `. ${bits.join("; ")}` : "") +
      `. Choose on location and the details in the table.`;
  }

  const summary = pick && ahead && behind
    ? `${ahead.name} edges ${behind.name} on the numbers — ${reasonFor(pick, "quality")[0]}. Rating, reviews, hours and more, side by side.`
    : `Too close to call: ${A.name} (${pa.rating != null ? `★${fmtRating(pa.rating)}` : "unrated"}, ${fmtInt(ra)} reviews) vs ${B.name} (${pb.rating != null ? `★${fmtRating(pb.rating)}` : "unrated"}, ${fmtInt(rb)} reviews), side by side.`;

  // ── how to choose ────────────────────────────────────────────────────────
  const howToChoose: string[] = [];
  const strengths = (side: "a" | "b") => reasonFor(side);
  const sa = strengths("a");
  const sb = strengths("b");
  if (sa.length) howToChoose.push(`Choose ${A.name} if you want ${sa[0]}${sa[1] ? ` and ${sa[1]}` : ""}.`);
  if (sb.length) howToChoose.push(`Choose ${B.name} if you want ${sb[0]}${sb[1] ? ` and ${sb[1]}` : ""}.`);
  if (!sa.length && !sb.length) {
    howToChoose.push(`Neither has a measurable lead, so decide on distance: ${A.name} is at ${shortAddress(pa)}, ${B.name} at ${shortAddress(pb)}.`);
  }
  const thinner = (pa.review_count ?? 0) < (pb.review_count ?? 0) ? A : B;
  const thinnerCount = Math.min(pa.review_count ?? 0, pb.review_count ?? 0);
  if (thinnerCount < 100) {
    howToChoose.push(`${thinner.name} has ${fmtInt(thinnerCount)} Google reviews, so its rating can still move; read the most recent reviews before booking.`);
  }
  if (ha.known && hb.known && (ha.latestClose >= 1320 || hb.latestClose >= 1320)) {
    const late = ha.latestClose >= hb.latestClose ? A : B;
    const lateInfo = late === A ? ha : hb;
    if (lateInfo.known && !lateInfo.open24) howToChoose.push(`For an evening visit, ${late.name} is the one that stays open (until ${formatClock(lateInfo.latestClose, "prose")}).`);
  }

  // ── FAQs (computed answers) ──────────────────────────────────────────────
  const faqs: { q: string; a: string }[] = [];
  if (pa.rating != null && pb.rating != null) {
    const d = Math.abs(pa.rating - pb.rating);
    faqs.push({
      q: `Which has the higher Google rating, ${A.name} or ${B.name}?`,
      a: d < 0.05
        ? `They are level at ★${fmtRating(pa.rating)}. The difference is in how many people rated them: ${fmtInt(ra)} reviews for ${A.name} and ${fmtInt(rb)} for ${B.name}.`
        : `${pa.rating > pb.rating ? A.name : B.name} is rated higher: ★${fmtRating(Math.max(pa.rating, pb.rating))} against ★${fmtRating(Math.min(pa.rating, pb.rating))}. ${A.name} has ${fmtInt(ra)} reviews and ${B.name} has ${fmtInt(rb)}, which is why the page also shows a confidence-adjusted rating.`,
    });
  }
  if (A.adj != null && B.adj != null) {
    const w = A.adj >= B.adj ? A : B;
    faqs.push({
      q: `Does the number of reviews matter when comparing ${A.name} and ${B.name}?`,
      a: `Yes. A rating built on a few dozen reviews can swing with one visit, so we pull every rating toward the ${ctx.nicheLabel.toLowerCase()} average (★${fmtRating(ctx.medianRating)}) by an amount that shrinks as reviews grow. After that adjustment ${A.name} scores ${fmtAdj(A.adj)} and ${B.name} scores ${fmtAdj(B.adj)}${Math.abs(A.adj - B.adj) < 0.03 ? ", effectively level" : `, so ${w.name} is the better-evidenced of the two`}.`,
    });
  }
  if (ha.known && hb.known) {
    const lateName = ha.latestClose === hb.latestClose ? null : ha.latestClose > hb.latestClose ? A : B;
    faqs.push({
      q: `Which is open later, ${A.name} or ${B.name}?`,
      a: lateName
        ? `${lateName.name} stays open later: it closes at ${formatClock(Math.max(ha.latestClose, hb.latestClose), "prose")} on its latest day, against ${formatClock(Math.min(ha.latestClose, hb.latestClose), "prose")} for ${lateName === A ? B.name : A.name}. ${daysPhrase(A.name, ha.daysOpen, B.name, hb.daysOpen)} Hours come from Google Maps and can change, so check before you go.`
        : `Their latest closing time is the same, ${formatClock(ha.latestClose, "prose")}. ${daysPhrase(A.name, ha.daysOpen, B.name, hb.daysOpen)} Hours come from Google Maps and can change, so check before you go.`,
    });
  }
  faqs.push({
    q: `Is ${A.name} or ${B.name} better for a first visit?`,
    a: pick
      ? `On the numbers, ${ahead!.name} is the safer first pick — ${joinAnd(reasonFor(pick, "quality").slice(0, 2))}. That is a lean from public ratings, not a guarantee of how your visit will go.`
      : `The numbers do not separate them, so there is no safe default. Pick the one closer to where you are staying and read the most recent reviews for whichever you choose.`,
  });
  faqs.push({
    q: `Where are ${A.name} and ${B.name}?`,
    a: `${A.name}: ${pa.address || "address not listed"}. ${B.name}: ${pb.address || "address not listed"}. Both were drawn from ${ctx.scopeLabel}.`,
  });

  return { rows, pick, headline, summary, howToChoose, faqs, adjustedA: A.adj, adjustedB: B.adj };
}

function daysPhrase(an: string, ad: number, bn: string, bd: number): string {
  if (ad === bd) return `Both are open ${ad} day${ad === 1 ? "" : "s"} a week.`;
  return `${an} opens ${ad} day${ad === 1 ? "" : "s"} a week and ${bn} opens ${bd}.`;
}

function shortAddress(p: NichePlace): string {
  const parts = (p.address || "").split(",").map((s) => s.trim()).filter(Boolean);
  return parts.slice(0, 3).join(", ") || "an address Google does not list";
}
