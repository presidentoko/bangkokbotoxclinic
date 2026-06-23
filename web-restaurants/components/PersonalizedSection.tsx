"use client";
import { useEffect, useState } from "react";
import type { UserPrefs } from "./OnboardingFlow";
import { CUISINE_LABELS, CUISINE_ICONS } from "@/lib/types";

type SlimRestaurant = {
  id: string;
  name: string;
  district: string;
  city_label: string;
  rating: number;
  trust_score: number;
  cuisines: string[];
};

export function PersonalizedSection({ restaurants }: { restaurants: SlimRestaurant[] }) {
  const [prefs, setPrefs] = useState<UserPrefs | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("snsstopper_prefs");
      if (raw) setPrefs(JSON.parse(raw));
    } catch {}
  }, []);

  if (!prefs || prefs.cuisines.length === 0) return null;

  const filtered = restaurants
    .filter((r) => r.cuisines.some((c) => prefs.cuisines.includes(c)))
    .sort((a, b) => b.trust_score - a.trust_score)
    .slice(0, 6);

  if (filtered.length === 0) return null;

  const cuisineLabel = prefs.cuisines
    .slice(0, 2)
    .map((c) => CUISINE_LABELS[c] ?? c)
    .join(", ");

  return (
    <section className="mb-12">
      <div className="flex items-baseline justify-between gap-4 mb-5">
        <div>
          <h2 className="font-serif-display text-2xl md:text-3xl text-[var(--fg)]">
            취향 맞춤 추천
          </h2>
          <p className="text-sm text-[var(--muted)] mt-1">{cuisineLabel} 기반</p>
        </div>
        <button
          onClick={() => { localStorage.removeItem("snsstopper_prefs"); setPrefs(null); window.location.reload(); }}
          className="text-xs text-[var(--muted)] hover:text-[var(--accent)] underline"
        >
          취향 다시 설정
        </button>
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filtered.map((r) => (
          <a
            key={r.id}
            href={`/restaurant/${r.id}`}
            className="group block border border-[var(--border)] rounded-3xl p-5 bg-[var(--card)] hover:shadow-md hover:border-[var(--accent)] transition"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="text-2xl font-bold tabular-nums text-[var(--accent)]">
                {r.trust_score.toFixed(0)}
              </div>
              <div className="text-sm font-bold text-yellow-700">★ {r.rating.toFixed(1)}</div>
            </div>
            <h3 className="font-bold text-base group-hover:text-[var(--accent)] transition leading-tight mb-1">
              {r.name}
            </h3>
            <p className="text-sm text-[var(--muted)]">{r.district || r.city_label}</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {r.cuisines.slice(0, 2).map((c) => (
                <span key={c} className="bg-[var(--accent-light)] text-[var(--accent)] text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1 font-medium">
                  <span aria-hidden>{CUISINE_ICONS[c] ?? "🍴"}</span>
                  {CUISINE_LABELS[c] ?? c}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
