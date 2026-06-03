import type { Clinic } from "@/lib/types";

type Action = {
  done: boolean;
  text: string;
  detail: string;
  gain: number;            // estimated Trust Score gain
  category: "photo" | "video" | "source" | "review" | "content" | "language";
};

// Mirrors scripts/build-data.mjs trustScore() — exposes "if you did X, score would be Y".
export function computeActions(c: Clinic): Action[] {
  const out: Action[] = [];

  // Source-diversity (each missing source = 5 pts up to 25)
  const sources = [
    { has: c.reviews_scraped_count > 0, name: "Google reviews", detail: "Encourage 10+ verified patients to leave Google reviews. Required for trust signal.", gain: 5, key: "source" as const },
    { has: c.photos_count > 0, name: "Clinic photos", detail: "Upload at least 1 photo on your Google Business Profile (interior, team, equipment).", gain: 5, key: "photo" as const },
    { has: c.videos_count > 0, name: "YouTube videos", detail: "Post 1-2 patient-result videos (with consent) on a clinic YouTube channel.", gain: 5, key: "video" as const },
    { has: Boolean(c.website), name: "Official website", detail: "Live website with clinic info, doctor bios, and procedure pages.", gain: 5, key: "source" as const },
    { has: Boolean(c.bookimed_slug), name: "Bookimed listing", detail: "Get listed on Bookimed (medical-tourism platform). Brings global traffic + diversity bonus.", gain: 5, key: "source" as const },
  ];
  for (const s of sources) {
    out.push({ done: s.has, text: s.name, detail: s.detail, gain: s.gain, category: s.key });
  }

  // Photo volume (10 pts max at 8 photos)
  if (c.photos_count < 8) {
    out.push({
      done: false,
      text: `Reach 8+ indexed photos (currently ${c.photos_count})`,
      detail: `Each additional photo on Google Business contributes ~${(10 / 8).toFixed(1)} pts up to 10 pts.`,
      gain: Math.round((10 / 8) * (8 - c.photos_count)),
      category: "photo",
    });
  }

  // Video volume (5 pts max at 5 videos)
  if (c.videos_count < 5) {
    out.push({
      done: false,
      text: `Reach 5+ patient-result videos (currently ${c.videos_count})`,
      detail: `Each additional video contributes ~1 pt up to 5 pts. Best-converting content for hair-transplant decisions.`,
      gain: 5 - c.videos_count,
      category: "video",
    });
  }

  // Review volume (15 pts logarithmic, max around 500 reviews)
  const r = c.review_count ?? 0;
  if (r < 50) {
    out.push({
      done: false,
      text: `Get to 50+ Google reviews (currently ${r})`,
      detail: "Below 50 reviews limits Trust Score volume bonus. Ask satisfied patients to review on Google directly.",
      gain: Math.min(8, Math.max(2, 8 - Math.floor(r / 8))),
      category: "review",
    });
  }

  // Rating
  if ((c.rating ?? 0) < 4.5) {
    out.push({
      done: false,
      text: `Maintain 4.5+ Google rating (currently ${(c.rating ?? 0).toFixed(1)})`,
      detail: "Respond professionally to negative reviews, follow up unhappy patients privately.",
      gain: 4,
      category: "review",
    });
  }

  // Procedure breadth
  if (c.procedures.length < 4) {
    out.push({
      done: false,
      text: `List 4+ procedures (currently ${c.procedures.length})`,
      detail: "Update Google Business categories + website with all hair services (FUE, DHI, PRP, SMP, beard, eyebrow).",
      gain: Math.round((10 / 4) * (4 - c.procedures.length)),
      category: "content",
    });
  }

  // Languages
  if (!c.languages.en) {
    out.push({ done: false, text: "Add English content to website", detail: "Page-level English at minimum. Most medical tourists search in English.", gain: 3, category: "language" });
  }
  if (!c.languages.ko && !c.languages.ar) {
    out.push({ done: false, text: "Add Korean OR Arabic page", detail: "Korea + GCC = highest-value medical tourists. Even a 1-page landing in these languages boosts ranking.", gain: 2, category: "language" });
  }

  return out;
}

const CATEGORY_META: Record<Action["category"], { label: string; color: string }> = {
  photo:   { label: "Photos",   color: "#8b5cf6" },
  video:   { label: "Video",    color: "#ef4444" },
  source:  { label: "Sources",  color: "#0ea5e9" },
  review:  { label: "Reviews",  color: "#10b981" },
  content: { label: "Content",  color: "#f59e0b" },
  language:{ label: "Language", color: "#ec4899" },
};

export default function ProfileHealth({ c }: { c: Clinic }) {
  const actions = computeActions(c);
  const todo = actions.filter((a) => !a.done);
  const done = actions.filter((a) => a.done);
  const potentialGain = todo.reduce((s, a) => s + a.gain, 0);
  const newScore = Math.min(100, c.trust_score + potentialGain);

  return (
    <section className="card overflow-hidden">
      <div className="grid items-center gap-3 border-b p-5 sm:grid-cols-[1fr_auto]" style={{ borderColor: "rgb(var(--border))" }}>
        <div>
          <div className="eyebrow">Profile health</div>
          <h2 className="mt-1 font-display text-2xl font-bold">
            {todo.length === 0 ? "Your profile is fully optimized" : `${todo.length} improvements available`}
          </h2>
          {todo.length > 0 && (
            <p className="mt-1 text-sm muted">
              Implementing all suggestions could lift Trust Score from <strong className="text-[rgb(var(--fg))]">{c.trust_score}</strong> to <strong className="text-mint-700">~{newScore}</strong>{" "}
              <span className="text-xs muted">(+{potentialGain} pts)</span>
            </p>
          )}
        </div>
        {todo.length > 0 && (
          <div className="rounded-2xl bg-gradient-to-br from-mint-50 to-transparent dark:from-mint-950/30 p-4 text-center">
            <div className="text-[10px] font-bold uppercase tracking-wider text-mint-700">Potential</div>
            <div className="font-display text-3xl font-bold tabular-nums text-mint-700">+{potentialGain}</div>
            <div className="text-[10px] muted">Trust points</div>
          </div>
        )}
      </div>

      {/* Action list */}
      <ul className="divide-y" style={{ borderColor: "rgb(var(--border))" }}>
        {todo.length === 0 && (
          <li className="p-5 text-center text-sm muted">All major signals covered. Excellent baseline.</li>
        )}
        {todo.map((a, i) => {
          const meta = CATEGORY_META[a.category];
          return (
            <li key={i} className="p-4 sm:p-5">
              <div className="grid grid-cols-[auto_1fr_auto] gap-3 items-start">
                <span className="grid h-8 w-8 place-items-center rounded-full text-[10px] font-bold text-white"
                  style={{ background: meta.color }}>
                  +{a.gain}
                </span>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold leading-tight">{a.text}</span>
                    <span className="rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                      style={{ color: meta.color, background: `${meta.color}15` }}>
                      {meta.label}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed muted">{a.detail}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Done items collapsed */}
      {done.length > 0 && (
        <div className="border-t bg-[rgb(var(--bg))] p-4" style={{ borderColor: "rgb(var(--border))" }}>
          <div className="text-[10px] font-bold uppercase tracking-wider text-mint-700 mb-2">
            ✓ Already covered ({done.length})
          </div>
          <div className="flex flex-wrap gap-1.5">
            {done.map((a, i) => (
              <span key={i} className="rounded-full bg-mint-100 px-2 py-0.5 text-[10px] font-bold text-mint-800 dark:bg-mint-900/40 dark:text-mint-200">
                ✓ {a.text}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
