"use client";

import { useEffect, useState } from "react";

type Stats = {
  saved: number;
  bingoCount: number;
  quizDone: boolean;
  recentCount: number;
};

function shareProgress(stats: Stats) {
  const pct = Math.round((stats.bingoCount / 16) * 100);
  const text = `🇹🇭 My Bangkok journey on Thaigle:\n🏆 Bucket list: ${stats.bingoCount}/16 (${pct}%)\n❤️ Saved: ${stats.saved} places\n🔍 Browsed: ${stats.recentCount} venues\n${stats.quizDone ? "✅ Traveler type: done!" : "🎯 Quiz: not yet"}\n\nhttps://thaigle.com/bingo`;
  if (navigator.share) {
    navigator.share({ text }).catch(() => {});
  } else {
    const url = `https://line.me/R/msg/text/?${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  }
}

export function BangkokStats() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("thaigle_saved") ?? "[]").length;
      const bingo: string[] = JSON.parse(localStorage.getItem("thaigle_bingo") ?? "[]");
      const bingoCount = bingo.length;
      const quizResult = localStorage.getItem("thaigle_quiz_result");
      const recent = JSON.parse(localStorage.getItem("thaigle_recent") ?? "[]").length;
      if (saved === 0 && bingoCount === 0 && !quizResult && recent === 0) return;
      setStats({ saved, bingoCount, quizDone: !!quizResult, recentCount: recent });
    } catch {}
  }, []);

  if (!stats) return null;

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Your Bangkok journey</div>
        <button
          onClick={() => shareProgress(stats)}
          className="text-xs font-bold text-orange-600 hover:underline flex items-center gap-1"
        >
          Share progress ↗
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <a href="/bingo" className="block bg-white border border-[var(--border)] rounded-xl p-4 hover:border-orange-300 transition text-center group col-span-2 sm:col-span-1">
          <div className="text-2xl font-black text-orange-600">{stats.bingoCount}<span className="text-base text-[var(--muted)]">/16</span></div>
          <div className="text-xs text-[var(--muted)] mt-0.5 group-hover:text-orange-600 transition mb-2">Bucket list done</div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-orange-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${Math.round((stats.bingoCount / 16) * 100)}%` }} />
          </div>
        </a>
        <div className="bg-white border border-[var(--border)] rounded-xl p-4 text-center">
          <div className="text-2xl font-black text-red-500">{stats.saved}</div>
          <div className="text-xs text-[var(--muted)] mt-0.5">Places saved</div>
        </div>
        <div className="bg-white border border-[var(--border)] rounded-xl p-4 text-center">
          <div className="text-2xl font-black text-blue-500">{stats.recentCount}</div>
          <div className="text-xs text-[var(--muted)] mt-0.5">Places browsed</div>
        </div>
        <a href={stats.quizDone ? "/quiz" : "/quiz"} className="block bg-white border border-[var(--border)] rounded-xl p-4 hover:border-orange-300 transition text-center group">
          <div className="text-2xl font-black">{stats.quizDone ? "✅" : "🎯"}</div>
          <div className="text-xs text-[var(--muted)] mt-0.5 group-hover:text-orange-600 transition">
            {stats.quizDone ? "Quiz done!" : "Take quiz →"}
          </div>
        </a>
      </div>
    </section>
  );
}
