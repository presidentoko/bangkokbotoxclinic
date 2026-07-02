"use client";

import { useState, useEffect, useCallback } from "react";

type BingoItem = {
  id: string;
  emoji: string;
  label: string;
  url?: string;
  category: "food" | "activity" | "experience" | "nightlife";
};

const ITEMS: BingoItem[] = [
  { id: "massage", emoji: "💆", label: "Thai massage", url: "/activities/spa", category: "activity" },
  { id: "muay", emoji: "🥊", label: "Muay Thai training", url: "/activities/muay-thai", category: "activity" },
  { id: "cooking", emoji: "👨‍🍳", label: "Cooking class", url: "/activities/cooking", category: "activity" },
  { id: "padthai", emoji: "🍜", label: "Pad Thai on the street", url: "/restaurants/cuisine/street_food", category: "food" },
  { id: "tuk", emoji: "🛺", label: "Tuk tuk ride", url: "/local-tips", category: "experience" },
  { id: "rooftop", emoji: "🌆", label: "Rooftop bar at sunset", url: "/for/views", category: "nightlife" },
  { id: "temple", emoji: "⛩️", label: "Wat Pho temple", url: "/local-tips", category: "experience" },
  { id: "market", emoji: "🥬", label: "Chatuchak market", url: "/local-tips", category: "experience" },
  { id: "somtam", emoji: "🥗", label: "Som Tam (papaya salad)", url: "/restaurants/cuisine/street_food", category: "food" },
  { id: "yoga", emoji: "🧘", label: "Yoga class", url: "/activities/yoga-pilates", category: "activity" },
  { id: "mango", emoji: "🥭", label: "Mango sticky rice", url: "/restaurants/cuisine/street_food", category: "food" },
  { id: "nightlife", emoji: "🎵", label: "Live music or nightclub", url: "/for/late-night", category: "nightlife" },
  { id: "boat", emoji: "⛵", label: "Chao Phraya boat", url: "/local-tips", category: "experience" },
  { id: "streetfood2am", emoji: "🌙", label: "Street food after midnight", url: "/for/late-night", category: "food" },
  { id: "floating", emoji: "🚤", label: "Floating market", url: "/local-tips", category: "experience" },
  { id: "diving", emoji: "🤿", label: "Snorkeling or diving", url: "/activities/diving", category: "activity" },
];

const KEY = "thaigle_bingo";

const CATEGORY_COLORS: Record<BingoItem["category"], string> = {
  food: "bg-orange-100 text-orange-800 border-orange-300",
  activity: "bg-green-100 text-green-800 border-green-300",
  experience: "bg-blue-100 text-blue-800 border-blue-300",
  nightlife: "bg-purple-100 text-purple-800 border-purple-300",
};

const CATEGORY_CHECKED: Record<BingoItem["category"], string> = {
  food: "bg-orange-500 text-white border-orange-600",
  activity: "bg-green-500 text-white border-green-600",
  experience: "bg-blue-500 text-white border-blue-600",
  nightlife: "bg-purple-500 text-white border-purple-600",
};

export function BangkokBingo() {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [shared, setShared] = useState(false);

  useEffect(() => {
    try {
      const stored: string[] = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      setChecked(new Set(stored));
    } catch {}
  }, []);

  const toggle = useCallback((id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try { localStorage.setItem(KEY, JSON.stringify([...next])); } catch {}
      return next;
    });
  }, []);

  const count = checked.size;
  const total = ITEMS.length;
  const pct = Math.round((count / total) * 100);

  const getLabel = () => {
    if (count === total) return "🏆 Full Bangkok Bingo! You've done it all.";
    if (count >= 12) return "🥇 Bangkok veteran — almost there!";
    if (count >= 8) return "🥈 Bangkok explorer — getting there!";
    if (count >= 4) return "🥉 Bangkok beginner — good start!";
    if (count >= 1) return "🇹🇭 Bangkok journey started!";
    return "Tick what you've done in Bangkok";
  };

  const shareResult = async () => {
    const text = `My Bangkok Bingo: ${count}/${total} done (${pct}%)! 🇹🇭\nCheck yours → https://thaigle.com/bingo`;
    if (navigator.share) {
      try { await navigator.share({ title: "My Bangkok Bucket List", text }); return; } catch {}
    }
    await navigator.clipboard.writeText(text);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <div className="bg-white border border-[var(--border)] rounded-2xl overflow-hidden">
      <div className="px-5 pt-5 pb-4 border-b border-[var(--border)]">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h2 className="font-black text-lg">Bangkok Bucket List 🇹🇭</h2>
            <p className="text-sm text-[var(--muted)] mt-0.5">{getLabel()}</p>
          </div>
          {count > 0 && (
            <button onClick={shareResult}
              className="shrink-0 px-3 py-1.5 rounded-full bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition">
              {shared ? "✓ Copied!" : `📤 Share (${count}/${total})`}
            </button>
          )}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }} />
          </div>
          <div className="text-xs font-bold text-orange-600 shrink-0 tabular-nums">{pct}%</div>
        </div>
        <div className="flex gap-4 mt-2 text-xs text-[var(--muted)]">
          <span><span className="inline-block w-2 h-2 rounded-full bg-orange-400 mr-1" />Food</span>
          <span><span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-1" />Activity</span>
          <span><span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-1" />Experience</span>
          <span><span className="inline-block w-2 h-2 rounded-full bg-purple-400 mr-1" />Nightlife</span>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-4">
        {ITEMS.map((item) => {
          const done = checked.has(item.id);
          const colorClass = done ? CATEGORY_CHECKED[item.category] : CATEGORY_COLORS[item.category];
          return (
            <button
              key={item.id}
              onClick={() => toggle(item.id)}
              className={`group relative flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition font-medium text-xs text-center active:scale-[0.96] ${colorClass}`}
            >
              {done && (
                <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-white/40 flex items-center justify-center text-[8px] font-black">✓</div>
              )}
              <span className="text-2xl">{item.emoji}</span>
              <span className="leading-tight">{item.label}</span>
              {item.url && !done && (
                <a href={item.url} onClick={(e) => e.stopPropagation()}
                  className="absolute bottom-1 right-1 text-[8px] opacity-60 hover:opacity-100 underline">
                  find →
                </a>
              )}
            </button>
          );
        })}
      </div>
      {count === total && (
        <div className="px-5 pb-5 text-center relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none flex justify-around items-start pt-2 opacity-70">
            {["🎊","🎉","✨","🏆","🎊","🎉","✨"].map((e, i) => (
              <span key={i} className="text-2xl animate-bounce" style={{ animationDelay: `${i * 0.1}s` }}>{e}</span>
            ))}
          </div>
          <div className="text-4xl mb-2 relative z-10">🏆</div>
          <div className="font-black text-lg mb-1 relative z-10">FULL BANGKOK BINGO!</div>
          <p className="text-sm text-[var(--muted)] mb-3 relative z-10">You&apos;ve experienced everything Bangkok has to offer. Legendary.</p>
          <button onClick={shareResult} className="px-5 py-2.5 rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition relative z-10">
            {shared ? "✓ Copied!" : "📤 Share your achievement"}
          </button>
        </div>
      )}
    </div>
  );
}
