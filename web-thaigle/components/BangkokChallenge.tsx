"use client";

import { useState, useEffect } from "react";

const CHALLENGES = [
  { emoji: "🌶️", title: "Order in Thai", desc: "Order your entire meal in Thai today — no English menus allowed. Use today's phrase!", reward: "100 local points", url: "/local-tips" },
  { emoji: "🚇", title: "No Grab Challenge", desc: "Get from A to B using only BTS, MRT, or river boat today. No taxis, no Grab.", reward: "Bangkok transport master", url: "/local-tips" },
  { emoji: "🍜", title: "Street Food Only", desc: "Eat every meal at street stalls today. Target: spend under ฿300 total on food.", reward: "Budget Bangkok badge", url: "/restaurants/cuisine/street_food" },
  { emoji: "🥊", title: "Try Muay Thai", desc: "Walk into any Muay Thai gym for a trial class today. Many accept walk-ins.", reward: "Fighter for a day", url: "/activities/muay-thai" },
  { emoji: "💆", title: "Spa Detox Day", desc: "Book a Thai massage before noon and a foot massage in the evening.", reward: "Wellness warrior", url: "/activities/spa" },
  { emoji: "⛩️", title: "Temple Hopping", desc: "Visit 3 temples before lunch. Start with Wat Pho, then follow the map.", reward: "Cultural explorer", url: "/local-tips" },
  { emoji: "🌅", title: "Early Riser", desc: "Hit a local market before 8am. Jatujak opens at 9am on weekends, Or Tor Kor daily.", reward: "Market maestro", url: "/restaurants/cuisine/street_food" },
  { emoji: "📵", title: "Lost in Bangkok", desc: "Wander for 2 hours with no Google Maps. Get genuinely lost in old Bangkok.", reward: "Authentic explorer", url: "/local-tips" },
  { emoji: "🏊", title: "Rooftop Pool", desc: "Find a hotel's rooftop pool open to walk-ins and spend a lazy afternoon.", reward: "Bangkok VIP", url: "/for/views" },
  { emoji: "👨‍🍳", title: "Cook Thai", desc: "Book a morning cooking class and make Pad Thai, Tom Yum, and mango sticky rice.", reward: "Amateur chef", url: "/activities/cooking" },
  { emoji: "🛺", title: "Tuk Tuk Adventure", desc: "Hire a tuk tuk for 2 hours and tell the driver to show you hidden places.", reward: "Local whisperer", url: "/local-tips" },
  { emoji: "🤿", title: "Dive Day Trip", desc: "Take a day trip from Bangkok to the nearest diving or snorkeling spot.", reward: "Underwater explorer", url: "/activities/diving" },
  { emoji: "🌃", title: "Night Owl", desc: "Stay out past 2am. Visit a night market, rooftop bar, then street food at 3am.", reward: "Bangkok night owl", url: "/for/late-night" },
  { emoji: "🧘", title: "Morning Zen", desc: "Start the day with a yoga class at sunrise, then meditate at a temple.", reward: "Inner peace seeker", url: "/activities/yoga-pilates" },
];

export function BangkokChallenge() {
  const [challenge, setChallenge] = useState<typeof CHALLENGES[0] | null>(null);
  const [completed, setCompleted] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      const idx = Math.floor(Date.now() / 86400000) % CHALLENGES.length;
      const key = `thaigle_challenge_${idx}`;
      setChallenge(CHALLENGES[idx]);
      setCompleted(localStorage.getItem(key) === "done");
    } catch {}
  }, []);

  const markDone = () => {
    try {
      const idx = Math.floor(Date.now() / 86400000) % CHALLENGES.length;
      localStorage.setItem(`thaigle_challenge_${idx}`, "done");
      setCompleted(true);
      const text = `🏆 I completed the Bangkok Daily Challenge on Thaigle: "${challenge?.title}" ${process.env.NEXT_PUBLIC_SITE_URL || "https://thaigle.com"}`;
      if (navigator.share) { navigator.share({ text }).catch(() => {}); }
      else { window.open(`https://line.me/R/msg/text/?${encodeURIComponent(text)}`, "_blank"); }
    } catch {}
  };

  if (!challenge || dismissed) return null;

  return (
    <div className={`mb-6 rounded-2xl border-2 p-4 relative transition ${completed ? "border-green-400 bg-green-50" : "border-orange-300 bg-gradient-to-br from-orange-50 to-amber-50"}`}>
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-lg leading-none"
        aria-label="Dismiss"
      >×</button>
      <div className="text-[10px] font-bold uppercase tracking-widest text-orange-600 mb-1.5">
        {completed ? "✅ Today's challenge — completed!" : "🎯 Bangkok daily challenge"}
      </div>
      <div className="flex items-start gap-3">
        <span className="text-2xl shrink-0">{challenge.emoji}</span>
        <div className="flex-1 min-w-0 pr-6">
          <div className="font-black text-sm mb-0.5">{challenge.title}</div>
          <p className="text-xs text-gray-700 leading-snug mb-2">{challenge.desc}</p>
          <div className="text-[10px] font-bold text-orange-600">Reward: {challenge.reward}</div>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        {!completed ? (
          <>
            <button
              onClick={markDone}
              className="flex-1 py-2 rounded-full bg-orange-500 text-white font-bold text-xs hover:bg-orange-600 transition"
            >
              Mark as done + Share 🎉
            </button>
            <a href={challenge.url} className="text-xs font-bold text-orange-600 hover:underline shrink-0">
              Find it →
            </a>
          </>
        ) : (
          <div className="text-xs font-bold text-green-700 flex items-center gap-1.5">
            <span>🏆</span> You completed this! Come back tomorrow for a new challenge.
          </div>
        )}
      </div>
    </div>
  );
}
