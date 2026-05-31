"use client";
// Booking.com / Hotjar-style rolling social-proof toasts.
// Shows in bottom-LEFT (so it doesn't fight WishlistButton/PersonalizationQuiz on right).
// Deterministic seed per visit so users don't see the same name twice in a row.

import { useEffect, useState } from "react";

const VISITORS = [
  { flag: "🇰🇷", first: "Min-jun",  city: "Seoul" },
  { flag: "🇰🇷", first: "Soo-yeon", city: "Busan" },
  { flag: "🇸🇦", first: "Khalid",   city: "Riyadh" },
  { flag: "🇸🇦", first: "Fatima",   city: "Jeddah" },
  { flag: "🇦🇪", first: "Ahmed",    city: "Dubai" },
  { flag: "🇸🇬", first: "Jia Min",  city: "Singapore" },
  { flag: "🇲🇾", first: "Aisha",    city: "Kuala Lumpur" },
  { flag: "🇭🇰", first: "Mei",      city: "Hong Kong" },
  { flag: "🇺🇸", first: "Sarah",    city: "LA" },
  { flag: "🇬🇧", first: "James",    city: "London" },
  { flag: "🇦🇺", first: "Emma",     city: "Sydney" },
  { flag: "🇯🇵", first: "Yuki",     city: "Tokyo" },
];

const ACTIONS = [
  { v: "viewed",   tpl: (n: string) => `just viewed ${n}` },
  { v: "booked",   tpl: (n: string) => `booked a consult at ${n}` },
  { v: "saved",    tpl: (n: string) => `saved ${n} to wishlist` },
  { v: "compared", tpl: (n: string) => `compared ${n} with 2 others` },
];

const CLINIC_HINTS_BY_PATH: Record<string, string[]> = {
  default: ["Nirunda", "Apex Profound", "Yanhee", "Wuttisak", "Pan Clinic", "Bumrungrad"],
  botox:   ["Apex Beauty", "Nida Esth'", "DTAC", "Wuttisak Clinic"],
  dental:  ["Bangkok International Dental", "Dental Signature", "Smile Signature", "Bangkok Smile"],
  hair:    ["DHI Bangkok", "Full Hair BY DHT", "BHI Clinic", "Siam Clinic"],
};

export default function SocialProofToasts() {
  const [tick, setTick] = useState(0);
  const [active, setActive] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // First toast 12s after mount, then every 22s. Each visible for 6s.
    const seed = Math.floor(Math.random() * 100);
    setTick(seed);
    const first = setTimeout(() => setActive(true), 12_000);
    const cycle = setInterval(() => {
      setActive(true);
      setTick((n) => n + 1);
      setTimeout(() => setActive(false), 6_000);
    }, 22_000);
    return () => { clearTimeout(first); clearInterval(cycle); };
  }, []);

  useEffect(() => {
    if (!active) return;
    const t = setTimeout(() => setActive(false), 6_000);
    return () => clearTimeout(t);
  }, [active, tick]);

  if (!mounted || !active) return null;

  const path = typeof window !== "undefined" ? window.location.pathname : "/";
  const focusKey = path.includes("dental") ? "dental"
    : path.includes("hair") || path.includes("transplant") ? "hair"
    : path.includes("botox") ? "botox"
    : "default";
  const clinics = CLINIC_HINTS_BY_PATH[focusKey] || CLINIC_HINTS_BY_PATH.default;

  const v = VISITORS[tick % VISITORS.length];
  const a = ACTIONS[tick % ACTIONS.length];
  const clinic = clinics[(tick * 7) % clinics.length];
  const minsAgo = 1 + (tick % 5);

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-4 sm:left-6 z-30 max-w-[calc(100vw-2rem)] sm:max-w-xs rounded-xl bg-white border-2 border-emerald-200 shadow-xl p-3 toast-fade-up print:hidden">
      <div className="flex items-start gap-2.5">
        <span className="text-2xl shrink-0 leading-none mt-0.5">{v.flag}</span>
        <div className="min-w-0 flex-1">
          <p className="text-xs leading-snug">
            <strong>{v.first}</strong> from {v.city} {a.tpl(clinic)}
          </p>
          <p className="text-[10px] text-[var(--muted)] mt-0.5">{minsAgo} min{minsAgo === 1 ? "" : "s"} ago · verified</p>
        </div>
        <button
          onClick={() => setActive(false)}
          aria-label="Dismiss"
          className="text-[var(--muted)] hover:text-black text-xs -m-1 p-1 shrink-0"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
