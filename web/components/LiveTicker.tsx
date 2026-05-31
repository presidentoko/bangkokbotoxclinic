"use client";
// Rotating social-proof ticker. Focus-aware copy so botox/dental/etc each feel native.
// Light-background variant tuned to web/'s hero. Optional accent color.

import { useEffect, useState } from "react";
import type { SiteFocus } from "@/lib/site";

const EVENTS_BASE = [
  { icon: "📨", text: "consultation request from {country}",         ago: 3 },
  { icon: "💬", text: "{country} visitor viewing {clinic}",          ago: 1 },
  { icon: "✓",  text: "Verified Partner activated in Bangkok",       ago: 8 },
  { icon: "📞", text: "callback booked with {clinic}",               ago: 12 },
  { icon: "📨", text: "consultation request from {country}",         ago: 2 },
  { icon: "👀", text: "{country} visitor reading {clinic} reviews",  ago: 1 },
];

const COUNTRIES = [
  { flag: "🇰🇷", name: "Seoul" }, { flag: "🇸🇦", name: "Riyadh" }, { flag: "🇦🇪", name: "Dubai" },
  { flag: "🇸🇬", name: "Singapore" }, { flag: "🇲🇾", name: "KL" }, { flag: "🇭🇰", name: "Hong Kong" },
  { flag: "🇺🇸", name: "LA" }, { flag: "🇬🇧", name: "London" }, { flag: "🇦🇺", name: "Sydney" },
  { flag: "🇨🇳", name: "Shanghai" }, { flag: "🇯🇵", name: "Tokyo" }, { flag: "🇩🇪", name: "Berlin" },
];

const FOCUS_CLINIC_HINTS: Record<SiteFocus, string[]> = {
  all:    ["Nirunda", "Apex Profound", "Yanhee", "Wuttisak", "Pan Clinic", "Major Cineplex Clinic"],
  botox:  ["BTX Bangkok", "Apex Profound Beauty", "Nida Esth'", "DTAC Clinic", "Wuttisak Clinic"],
  filler: ["Filler House Bangkok", "Nirunda Filler", "DermaPure", "Pan Clinic", "MBK Filler"],
  hifu:   ["Apex HIFU", "Nida HIFU", "Wuttisak Ultherapy", "Thermage Bangkok", "Ultra V Clinic"],
  facial: ["HydraFacial Bangkok", "Glow Skin Clinic", "Bangkok Hospital Skincare", "Major Skin"],
  laser:  ["Pico Pro Clinic", "Bangkok Laser Center", "Nirunda Laser", "Apex Pico"],
  dental: ["Bangkok International Dental", "Dental Signature", "BFC Dental", "Smile Signature", "Bangkok Smile"],
  hair:   ["DHI Bangkok", "Full Hair BY DHT", "BHI Clinic", "Siam Clinic", "BEQ Hair Center"],
};

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

export default function LiveTicker({
  focus = "all",
  accent,
}: {
  focus?: SiteFocus;
  accent?: string;
}) {
  const [tick, setTick] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = setInterval(() => setTick((n) => n + 1), 4500);
    return () => clearInterval(t);
  }, []);

  if (!mounted) return null; // avoid hydration mismatch — server renders nothing

  const clinicHints = FOCUS_CLINIC_HINTS[focus] || FOCUS_CLINIC_HINTS.all;
  const idx = tick % EVENTS_BASE.length;
  const e = EVENTS_BASE[idx];
  const country = pick(COUNTRIES, tick + 3);
  const clinic = pick(clinicHints, tick + 5);
  const text = e.text
    .replace("{country}", `${country.flag} ${country.name}`)
    .replace("{clinic}", clinic);
  const ago = e.ago + (tick % 3);
  const dotColor = accent || "#10b981";

  return (
    <div
      className="inline-flex items-center gap-2 rounded-full border bg-white/80 px-3 py-1.5 backdrop-blur shadow-sm transition-all duration-300"
      style={{ borderColor: "var(--border)" }}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: dotColor }} />
        <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: dotColor }} />
      </span>
      <span className="text-[11px] font-semibold text-[var(--fg)]">
        <span className="mr-1">{e.icon}</span>
        {text}
        <span className="ml-1 text-[var(--muted)]">· {ago} min ago</span>
      </span>
    </div>
  );
}
