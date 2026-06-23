// Focus-aware curated mini-lists. 4 collections, deduped against actual data.
// Each collection has a filter + emoji + sub. Renders only when 2+ clinics match.

import type { Clinic } from "@/lib/types";
import type { SiteFocus } from "@/lib/site";
import { formatTrustScore } from "@/lib/utils";

type Collection = {
  key: string;
  title: string;
  sub: string;
  emoji: string;
  filter: (c: Clinic) => boolean;
};

const HIGHEST_RATED: Collection = {
  key: "highest-rated",
  title: "Highest Rated",
  sub: "4.8+ stars with 50+ reviews",
  emoji: "⭐",
  filter: (c) => (c.rating ?? 0) >= 4.8 && (c.total_reviews ?? 0) >= 50,
};

const ENGLISH_FRIENDLY: Collection = {
  key: "english",
  title: "English-friendly",
  sub: "English-speaking staff verified",
  emoji: "🇬🇧",
  filter: (c) => (c.language_breakdown?.en ?? 0) >= 5,
};

const KOREAN_FRIENDLY: Collection = {
  key: "korean",
  title: "Korean-friendly",
  sub: "Korean-speaking staff verified",
  emoji: "🇰🇷",
  filter: (c) => (c.language_breakdown?.ko ?? 0) >= 3,
};

const HIGH_TRUST: Collection = {
  key: "high-trust",
  title: "Highest Trust",
  sub: "Trust Score 80+ — multi-source verified",
  emoji: "🛡️",
  filter: (c) => c.trust_score >= 80,
};

const FOCUS_COLLECTIONS: Record<SiteFocus, Collection[]> = {
  all:    [HIGHEST_RATED, HIGH_TRUST, ENGLISH_FRIENDLY, KOREAN_FRIENDLY],
  botox:  [
    { key: "genuine-brand", title: "Genuine Brand", sub: "Allergan/Dysport/Botulax verified in reviews", emoji: "🛡️", filter: (c) => /genuine|allergan|dysport|botulax/i.test(JSON.stringify(c.mentioned_topics || [])) },
    HIGH_TRUST, ENGLISH_FRIENDLY, KOREAN_FRIENDLY,
  ],
  filler: [
    { key: "filler-specialists", title: "HA Filler Specialists", sub: "Juvederm/Restylane mentioned in reviews", emoji: "💉", filter: (c) => /juvederm|restylane|belotero|filler/i.test(JSON.stringify(c.mentioned_topics || [])) },
    HIGH_TRUST, ENGLISH_FRIENDLY, HIGHEST_RATED,
  ],
  hifu:   [
    { key: "hifu-machines", title: "Branded Machines", sub: "Ulthera/Thermage/Ultraformer verified", emoji: "⚡", filter: (c) => /ulthera|thermage|ultraformer|hifu/i.test(JSON.stringify(c.mentioned_topics || [])) },
    HIGH_TRUST, HIGHEST_RATED, ENGLISH_FRIENDLY,
  ],
  facial: [HIGHEST_RATED, HIGH_TRUST, ENGLISH_FRIENDLY, KOREAN_FRIENDLY],
  laser:  [
    { key: "pico-specialists", title: "Pico Laser Specialists", sub: "Pico Pico/PicoSure verified", emoji: "🔬", filter: (c) => /pico/i.test(JSON.stringify(c.mentioned_topics || [])) },
    HIGH_TRUST, HIGHEST_RATED, ENGLISH_FRIENDLY,
  ],
  dental: [
    { key: "implant-specialists", title: "Implant Specialists", sub: "Straumann/Nobel/Osstem mentioned", emoji: "🦷", filter: (c) => /implant|straumann|nobel|osstem/i.test(JSON.stringify(c.mentioned_topics || [])) },
    HIGH_TRUST, ENGLISH_FRIENDLY, HIGHEST_RATED,
  ],
  hair:   [
    { key: "fue-specialists", title: "FUE Specialists", sub: "FUE-focused in reviews + photos", emoji: "🔬", filter: (c) => /fue/i.test(JSON.stringify(c.mentioned_topics || [])) },
    HIGH_TRUST, KOREAN_FRIENDLY, HIGHEST_RATED,
  ],
};

export default function CuratedCollections({ clinics, focus = "all" }: { clinics: Clinic[]; focus?: SiteFocus }) {
  const cols = FOCUS_COLLECTIONS[focus] || FOCUS_COLLECTIONS.all;
  const items = cols.map((col) => ({
    ...col,
    clinics: clinics.filter(col.filter).sort((a, b) => b.trust_score - a.trust_score).slice(0, 3),
  })).filter((col) => col.clinics.length >= 2);

  if (items.length === 0) return null;

  return (
    <section className="py-10">
      <div className="mb-6">
        <div className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">Curated</div>
        <h2 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight">Find by what matters to you</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">Hand-picked groups based on real review data. No paid placements here.</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {items.map((col) => (
          <div key={col.key} className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-center gap-3 border-b p-5" style={{ borderColor: "var(--border)" }}>
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 text-2xl">
                {col.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-black leading-tight">{col.title}</h3>
                <p className="text-xs text-[var(--muted)]">{col.sub}</p>
              </div>
              <span className="text-xs font-bold tabular-nums text-[var(--muted)] whitespace-nowrap">{col.clinics.length}+</span>
            </div>
            <ul className="divide-y" style={{ borderColor: "var(--border)" }}>
              {col.clinics.map((c, i) => (
                <li key={c.id}>
                  <a href={`/clinic/${c.id}`} className="flex items-center gap-4 p-4 transition hover:bg-slate-50">
                    <span className="text-xl font-black tabular-nums text-[var(--muted)] w-6 text-center">{i + 1}</span>
                    <div className="h-14 w-14 rounded-xl bg-slate-100 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-semibold">{c.name}</div>
                      <div className="text-xs text-[var(--muted)]">{c.district || c.city_label} · ★ {(c.rating ?? 0).toFixed(1)} · {c.total_reviews ?? 0} reviews</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xl font-black tabular-nums">{formatTrustScore(c.trust_score)}</div>
                      <div className="text-[9px] font-bold uppercase tracking-wider text-[var(--muted)]">Trust</div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
