"use client";

import { useState } from "react";

export type VersusOption = {
  id: string;
  label: string;
  emoji: string;
  desc: string;
  url: string;
  highlight?: string;
};

const BASE_COUNTS: Record<string, [number, number]> = {
  "eating-experiences": [312, 241],
  "food-activities": [198, 287],
  "bts-taxi": [445, 167],
  "indoor-outdoor": [223, 334],
  "cooking-spa": [289, 356],
  "trust-score-local-word": [412, 289],
  "cuisine-area": [234, 378],
  "solo-group": [167, 445],
  "research-explore": [323, 198],
  "star-trust": [289, 412],
};

export function VersusVote({ a, b, question }: { a: VersusOption; b: VersusOption; question: string }) {
  const base = BASE_COUNTS[`${a.id}-${b.id}`] ?? BASE_COUNTS[`${b.id}-${a.id}`] ?? [148, 203];
  const [votes, setVotes] = useState<Record<string, number>>({ [a.id]: base[0], [b.id]: base[1] });
  const [picked, setPicked] = useState<string | null>(null);
  const [shared, setShared] = useState(false);

  const totalVotes = votes[a.id] + votes[b.id];

  const vote = (id: string) => {
    if (picked) return;
    setVotes((v) => ({ ...v, [id]: v[id] + 1 }));
    setPicked(id);
  };

  const pctA = totalVotes > 0 ? Math.round((votes[a.id] / totalVotes) * 100) : 50;
  const pctB = 100 - pctA;

  const shareResult = async () => {
    const winner = picked === a.id ? a : b;
    const text = `I voted "${winner.emoji} ${winner.label}" in Thaigle's Bangkok showdown! Who wins? ${window.location.href}`;
    if (navigator.share) {
      try { await navigator.share({ title: question, text }); return; } catch {}
    }
    try {
      await navigator.clipboard.writeText(text);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {
      // Clipboard API unavailable — nothing more we can do here.
    }
  };

  return (
    <div className="bg-white border border-[var(--border)] rounded-2xl overflow-hidden">
      <div className="px-5 pt-5 pb-3 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">Bangkok Showdown</div>
          {totalVotes > 1 && <div className="text-[10px] text-[var(--muted)] font-medium">{totalVotes.toLocaleString()} votes</div>}
        </div>
        <h3 className="text-lg font-black">{question}</h3>
      </div>

      <div className="grid grid-cols-2 gap-0 relative">
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 flex items-center z-10">
          <div className="bg-white border-2 border-[var(--border)] rounded-full w-10 h-10 flex items-center justify-center font-black text-sm shadow-md">
            VS
          </div>
        </div>

        {[a, b].map((opt) => (
          <button
            key={opt.id}
            onClick={() => vote(opt.id)}
            disabled={!!picked}
            className={`group relative p-5 text-center transition ${
              picked
                ? picked === opt.id
                  ? "bg-orange-50"
                  : "bg-gray-50 opacity-60"
                : "hover:bg-orange-50 cursor-pointer active:scale-[0.98]"
            } ${opt.id === a.id ? "border-r border-[var(--border)]" : ""}`}
          >
            <div className="text-4xl mb-2">{opt.emoji}</div>
            <div className={`font-black text-base mb-1 transition ${!picked ? "group-hover:text-orange-700" : picked === opt.id ? "text-orange-700" : ""}`}>
              {opt.label}
            </div>
            <div className="text-xs text-[var(--muted)] leading-relaxed mb-2">{opt.desc}</div>
            {opt.highlight && (
              <div className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full inline-block">
                {opt.highlight}
              </div>
            )}
            {picked && (
              <div className="mt-3">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full transition-all duration-700"
                    style={{ width: `${opt.id === a.id ? pctA : pctB}%` }}
                  />
                </div>
                <div className="text-sm font-black mt-1 text-orange-600">
                  {opt.id === a.id ? pctA : pctB}%
                </div>
              </div>
            )}
          </button>
        ))}
      </div>

      {picked && (
        <div className="px-5 py-4 border-t border-[var(--border)] bg-orange-50 flex items-center justify-between gap-3 flex-wrap">
          <div className="text-sm">
            <span className="font-bold text-orange-800">
              {picked === a.id ? `${a.emoji} ${a.label}` : `${b.emoji} ${b.label}`}
            </span>
            <span className="text-[var(--muted)]"> wins your vote!</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={picked === a.id ? a.url : b.url}
              className="text-xs font-bold text-orange-700 hover:underline"
            >
              See rankings →
            </a>
            <button
              onClick={shareResult}
              className="text-xs px-3 py-1.5 rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition"
            >
              {shared ? "✓ Copied!" : "📤 Share"}
            </button>
            <a
              href={`https://line.me/R/msg/text/?${encodeURIComponent(`I voted for "${picked === a.id ? a.label : b.label}" in Thaigle's Bangkok showdown! 🇹🇭 ${typeof window !== "undefined" ? window.location.href : "https://thaigle.com"}`)}`}
              target="_blank" rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 rounded-full font-bold text-white transition"
              style={{ backgroundColor: "#06C755" }}
            >
              LINE
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`I voted for "${picked === a.id ? a.label : b.label}" in Thaigle's Bangkok showdown! 🇹🇭 ${typeof window !== "undefined" ? window.location.href : "https://thaigle.com"}`)}`}
              target="_blank" rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 rounded-full font-bold text-white transition"
              style={{ backgroundColor: "#25D366" }}
            >
              WA
            </a>
          </div>
        </div>
      )}

      {!picked && (
        <div className="px-5 py-3 border-t border-[var(--border)] text-center">
          <p className="text-xs text-[var(--muted)]">Tap to vote — results reveal instantly</p>
        </div>
      )}
    </div>
  );
}
