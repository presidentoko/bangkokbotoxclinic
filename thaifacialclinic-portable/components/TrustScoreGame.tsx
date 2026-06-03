"use client";
// Guess the Trust Score — interactive learning. Shows clinic name + rating + review count,
// hides Trust Score. User drags slider, reveals answer, gets pts. Repeat.

import { useEffect, useState } from "react";
import type { Clinic } from "@/lib/types";

type Round = { clinic: Clinic; guess: number; revealed: boolean; diff: number };

export default function TrustScoreGame({ clinics, lang = "en" }: { clinics: Clinic[]; lang?: string }) {
  // Eligible: trust_score and rating defined
  const pool = clinics.filter((c) => c.trust_score >= 30 && c.rating !== null && (c.review_count ?? 0) >= 10);
  const [round, setRound] = useState<Round | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [played, setPlayed] = useState(0);

  function pickNext() {
    if (pool.length === 0) return;
    const c = pool[Math.floor(Math.random() * pool.length)];
    setRound({ clinic: c, guess: 50, revealed: false, diff: 0 });
  }

  useEffect(() => { pickNext(); }, []);

  function reveal() {
    if (!round || round.revealed) return;
    const diff = Math.abs(round.guess - round.clinic.trust_score);
    let pts = 0;
    if (diff <= 3)  pts = 10;
    else if (diff <= 7) pts = 5;
    else if (diff <= 12) pts = 2;
    setRound({ ...round, revealed: true, diff });
    setScore((s) => s + pts);
    setPlayed((p) => p + 1);
    setStreak((s) => (diff <= 7 ? s + 1 : 0));
  }

  if (!round) return null;
  const { clinic, guess, revealed, diff } = round;
  const actual = clinic.trust_score;

  const accuracy =
    diff <= 3 ? { label: "🎯 Perfect!", color: "#059669", pts: 10 } :
    diff <= 7 ? { label: "👏 Close!",   color: "#0891b2", pts: 5 } :
    diff <= 12 ? { label: "🤏 Almost",  color: "#d97706", pts: 2 } :
                { label: "😬 Way off",  color: "#dc2626", pts: 0 };

  return (
    <section className="rounded-[2rem] border-2 bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 dark:from-violet-950/30 dark:to-pink-950/30 p-6 sm:p-8" style={{ borderColor: "rgb(var(--border))" }}>
      <div className="text-center mb-5">
        <div className="text-xs font-black uppercase tracking-widest text-violet-700 dark:text-violet-400">🎮 Guess the Trust Score</div>
        <h2 className="mt-1 font-display text-3xl sm:text-4xl font-bold tracking-tighter-display">How well do you read clinics?</h2>
        <div className="mt-3 inline-flex items-center gap-4 text-xs">
          <span><strong className="text-violet-700">{score}</strong> pts</span>
          <span className="text-[rgb(var(--muted))]">·</span>
          <span><strong className="text-violet-700">{streak}</strong> 🔥 streak</span>
          <span className="text-[rgb(var(--muted))]">·</span>
          <span>round <strong>{played + 1}</strong></span>
        </div>
      </div>

      {/* Clinic card */}
      <div className="rounded-2xl bg-white dark:bg-navy-900/30 border p-5 mb-4" style={{ borderColor: "rgb(var(--border))" }}>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="min-w-0">
            <div className="font-display text-xl font-bold tracking-tighter-display truncate">{clinic.name}</div>
            <div className="text-xs muted mt-0.5">{clinic.city} · {clinic.category}</div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-2xl font-black tabular-nums text-yellow-700">★ {(clinic.rating ?? 0).toFixed(1)}</div>
            <div className="text-[10px] muted">{(clinic.review_count ?? 0).toLocaleString()} reviews</div>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2 text-center text-[10px]">
          <div className="rounded bg-blue-50 dark:bg-blue-950/30 p-2">
            <div className="font-bold tabular-nums">{clinic.source_badges?.google_reviews ?? 0}</div>
            <div className="muted">Google</div>
          </div>
          <div className="rounded bg-purple-50 dark:bg-purple-950/30 p-2">
            <div className="font-bold tabular-nums">{clinic.photos_count ?? 0}</div>
            <div className="muted">Photos</div>
          </div>
          <div className="rounded bg-red-50 dark:bg-red-950/30 p-2">
            <div className="font-bold tabular-nums">{clinic.videos_count ?? 0}</div>
            <div className="muted">Videos</div>
          </div>
        </div>
      </div>

      {/* Slider */}
      <div className="mb-4">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-widest muted">Your guess</span>
          <span className="font-display text-3xl font-bold tabular-nums">{guess}</span>
        </div>
        <input type="range" min={0} max={100} step={1}
          value={guess}
          disabled={revealed}
          onChange={(e) => setRound({ ...round, guess: Number(e.target.value) })}
          className="w-full accent-violet-600 disabled:opacity-50"
        />
        <div className="flex justify-between text-[10px] muted mt-1 font-bold">
          <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
        </div>
      </div>

      {/* Reveal / next */}
      {!revealed ? (
        <button onClick={reveal}
          className="w-full rounded-xl bg-gradient-to-br from-violet-600 to-purple-700 text-white py-3 text-base font-black hover:opacity-90">
          Reveal answer →
        </button>
      ) : (
        <>
          <div className="rounded-xl border-2 p-4 mb-3" style={{ background: accuracy.color + "15", borderColor: accuracy.color }}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[10px] font-black uppercase tracking-widest" style={{ color: accuracy.color }}>
                  {accuracy.label} · +{accuracy.pts} pts
                </div>
                <div className="text-xs mt-1">
                  Off by <strong className="tabular-nums">{diff}</strong> points
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] muted">Actual</div>
                <div className="font-display text-4xl font-bold tabular-nums" style={{ color: accuracy.color }}>{actual}</div>
              </div>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-2">
            <button onClick={pickNext}
              className="rounded-xl bg-navy-900 dark:bg-gold-400 dark:text-navy-950 text-white py-3 text-sm font-black hover:opacity-90">
              Next clinic →
            </button>
            <a href={`/${lang}/clinic/${clinic.slug}/`}
              className="rounded-xl border-2 text-center py-3 text-sm font-bold hover:bg-white/50"
              style={{ borderColor: "rgb(var(--border))" }}>
              See full data →
            </a>
          </div>
          <p className="text-[11px] muted mt-3 leading-relaxed text-center">
            Trust Score = rating quality (30%) + review volume (20%) + scraped depth (15%) + multi-source presence (15%) + photo/video evidence (20%)
          </p>
        </>
      )}
    </section>
  );
}
