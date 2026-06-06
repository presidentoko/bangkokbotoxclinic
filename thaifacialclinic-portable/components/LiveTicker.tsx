"use client";

import { useEffect, useState } from "react";

// Plausible/rotating signals — keeps user attention on hero, signals activity.
// Each line picks a deterministic-ish "X minutes ago" so it looks natural.

const EVENTS = [
  { icon: "📨", text: "consultation request from {country}",     ago: 3 },
  { icon: "💬", text: "{country} visitor viewing {clinic}",        ago: 1 },
  { icon: "✓",  text: "Verified Partner activated in Bangkok",     ago: 8 },
  { icon: "📞", text: "callback booked with {clinic}",             ago: 12 },
  { icon: "📨", text: "consultation request from {country}",       ago: 2 },
  { icon: "👀", text: "{country} visitor reading {clinic} reviews", ago: 1 },
];

const COUNTRIES = [
  { flag: "🇰🇷", name: "Seoul" }, { flag: "🇸🇦", name: "Riyadh" }, { flag: "🇦🇪", name: "Dubai" },
  { flag: "🇸🇬", name: "Singapore" }, { flag: "🇲🇾", name: "Kuala Lumpur" }, { flag: "🇭🇰", name: "Hong Kong" },
  { flag: "🇺🇸", name: "Los Angeles" }, { flag: "🇬🇧", name: "London" }, { flag: "🇦🇺", name: "Sydney" },
  { flag: "🇨🇳", name: "Shanghai" }, { flag: "🇯🇵", name: "Tokyo" }, { flag: "🇩🇪", name: "Berlin" },
];

const CLINIC_HINTS = ["DHI Bangkok", "Full Hair BY DHT", "BHI Clinic", "Siam Clinic Phuket", "BEQ Hair Center", "ProDerma"];

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

export default function LiveTicker() {
  // Cycle through events every 4 seconds. Use seed = current 30s window so renders stay stable across hydration.
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 4500);
    return () => clearInterval(t);
  }, []);

  const idx = tick % EVENTS.length;
  const e = EVENTS[idx];
  const country = pick(COUNTRIES, tick + 3);
  const clinic = pick(CLINIC_HINTS, tick + 5);
  const text = e.text
    .replace("{country}", `${country.flag} ${country.name}`)
    .replace("{clinic}", clinic);
  const ago = e.ago + (tick % 3);

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 backdrop-blur transition-all duration-300">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mint-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-mint-500" />
      </span>
      <span className="text-[11px] font-semibold text-navy-100">
        <span className="mr-1">{e.icon}</span>
        {text}
        <span className="ml-1 muted">· {ago} min ago</span>
      </span>
    </div>
  );
}
