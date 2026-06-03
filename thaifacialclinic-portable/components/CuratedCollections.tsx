import Link from "next/link";
import type { Clinic, Lang } from "@/lib/types";

type Collection = {
  key: string;
  title: string;
  sub: string;
  emoji: string;
  filter: (c: Clinic) => boolean;
};

const COLLECTIONS: Collection[] = [
  {
    key: "fue-specialists",
    title: "FUE Specialists",
    sub: "Clinics with FUE-focused expertise + photos",
    emoji: "🔬",
    filter: (c) => c.procedures.some((p) => /fue/i.test(p)) && c.photos_count >= 3,
  },
  {
    key: "international",
    title: "International-friendly",
    sub: "English + Korean staff verified",
    emoji: "🌏",
    filter: (c) => c.languages.en || c.languages.ko,
  },
  {
    key: "highest-rated",
    title: "Highest Rated",
    sub: "4.8+ stars with 30+ reviews",
    emoji: "⭐",
    filter: (c) => (c.rating ?? 0) >= 4.8 && (c.review_count ?? 0) >= 30,
  },
  {
    key: "video-evidence",
    title: "Video Evidence",
    sub: "Clinics with patient-result videos on YouTube",
    emoji: "🎥",
    filter: (c) => c.videos_count >= 2,
  },
];

export default function CuratedCollections({ clinics, lang }: { clinics: Clinic[]; lang: Lang }) {
  const items = COLLECTIONS.map((col) => ({
    ...col,
    clinics: clinics.filter(col.filter).sort((a, b) => b.trust_score - a.trust_score).slice(0, 3),
  })).filter((col) => col.clinics.length >= 2);

  if (items.length === 0) return null;

  return (
    <section>
      <div className="mb-6">
        <div className="eyebrow">Curated</div>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tighter-display sm:text-4xl">
          Find by what matters to you
        </h2>
        <p className="mt-2 text-sm muted">Hand-picked groups based on real data. No paid placements here.</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        {items.map((col) => (
          <div key={col.key} className="card overflow-hidden">
            <div className="flex items-center gap-3 border-b p-5" style={{ borderColor: "rgb(var(--border))" }}>
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-gold-100 to-gold-200 text-2xl dark:from-gold-900/40 dark:to-gold-800/40">
                {col.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-lg font-bold leading-tight">{col.title}</h3>
                <p className="text-xs muted">{col.sub}</p>
              </div>
              <span className="text-xs font-bold tabular-nums muted whitespace-nowrap">{col.clinics.length}+ found</span>
            </div>
            <ul className="divide-y" style={{ ["--tw-divide-opacity" as never]: "1", borderColor: "rgb(var(--border))" }}>
              {col.clinics.map((c, i) => (
                <li key={c.id}>
                  <Link href={`/${lang}/clinic/${c.slug}/`} className="flex items-center gap-4 p-4 transition hover:bg-[rgb(var(--bg))]">
                    <span className="font-display text-xl font-bold tabular-nums muted w-6 text-center">{i + 1}</span>
                    {c.top_photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.top_photo_url} alt={c.name} loading="lazy" referrerPolicy="no-referrer"
                        className="h-14 w-14 rounded-xl object-cover shrink-0" />
                    ) : (
                      <div className="h-14 w-14 rounded-xl bg-navy-100 dark:bg-navy-900 shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-semibold">{c.name}</div>
                      <div className="text-xs muted">{c.city} · ★ {(c.rating ?? 0).toFixed(1)} · {c.review_count ?? 0} reviews</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-display text-xl font-bold tabular-nums">{c.trust_score}</div>
                      <div className="text-[9px] font-bold uppercase tracking-wider muted">Trust</div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
