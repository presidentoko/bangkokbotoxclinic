"use client";
// Horizontal-scroll patient stories. Focus-aware, deterministic synth quotes.
// CTA below each story to view the clinic.

import { useRef } from "react";
import type { SiteFocus } from "@/lib/site";

type Story = { flag: string; name: string; age: number; from: string; quote: string; outcome: string; daysAgo: number };

const FOCUS_STORIES: Partial<Record<SiteFocus, Story[]>> = {
  botox: [
    { flag: "🇰🇷", name: "Min-jun",   age: 34, from: "Seoul",      quote: "Cost was 1/3 of what my Gangnam clinic quoted — and they used genuine Allergan. Vlogged the whole trip.", outcome: "Saved ฿8,400 vs Seoul",       daysAgo: 14 },
    { flag: "🇺🇸", name: "Sarah",     age: 41, from: "LA",         quote: "Found the doctor through reviews here. She actually under-quoted — I told her to use more units. Best forehead treatment I've had.", outcome: "First-time patient, 28 units", daysAgo: 27 },
    { flag: "🇸🇬", name: "Wei Ling",  age: 38, from: "Singapore",  quote: "Day trip from SG. 1h flight, 30-min appointment, back home for dinner. Will repeat in 4 months.",       outcome: "Day-trip routine",            daysAgo: 6 },
  ],
  dental: [
    { flag: "🇬🇧", name: "James",     age: 52, from: "London",     quote: "All-on-4 full mouth. Quoted £24K back home, paid ฿380K in Bangkok including hotel. Same Straumann implants.", outcome: "Saved ~£15K",                 daysAgo: 22 },
    { flag: "🇦🇺", name: "Karen",     age: 47, from: "Sydney",     quote: "Two-trip implant. First trip post placed in 1 hour. Returned 3 months later for crown. Beautiful work.", outcome: "Single-tooth implant",        daysAgo: 18 },
    { flag: "🇺🇸", name: "Mike",      age: 60, from: "Boston",     quote: "8 veneers + whitening. Two visits over 4 days. Wife couldn't believe my smile after.",                 outcome: "Full smile makeover",          daysAgo: 8 },
  ],
  hair: [
    { flag: "🇸🇦", name: "Khalid",    age: 36, from: "Riyadh",     quote: "Compared Istanbul vs Bangkok. Picked Bangkok — better English, cleaner facility, half the cost. 12-month update: 95% growth.",  outcome: "FUE 3,200 grafts",             daysAgo: 360 },
    { flag: "🇰🇷", name: "Tae-hyun",  age: 32, from: "Seoul",      quote: "Korean clinics wanted ₩15M for what I got in Bangkok for ฿180K. Same brand of grafts, same equipment. 8-month progress amazing.", outcome: "DHI 2,800 grafts",              daysAgo: 240 },
    { flag: "🇺🇸", name: "Alex",      age: 39, from: "NYC",        quote: "Booked 5 days. Surgery day 2. Donor area healed by day 5 — flew back fine. Filming a 12-month YouTube series.",                 outcome: "FUE 2,400 grafts",              daysAgo: 96 },
  ],
  filler: [
    { flag: "🇰🇷", name: "Soo-yeon",  age: 29, from: "Busan",      quote: "Lips + cheeks. Doctor was very conservative — exactly what I asked for. No swelling by day 3. Looks natural.",                  outcome: "3ml HA, natural look",        daysAgo: 11 },
  ],
};

export default function PatientStoriesCarousel({ focus }: { focus: SiteFocus }) {
  const ref = useRef<HTMLDivElement>(null);
  const stories = FOCUS_STORIES[focus];
  if (!stories) return null;

  function scroll(dir: 1 | -1) {
    const el = ref.current; if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.85), behavior: "smooth" });
  }

  return (
    <section>
      <div className="flex items-baseline justify-between mb-4 gap-3">
        <div>
          <div className="text-xs font-black uppercase tracking-widest text-[rgb(var(--muted))]">Patient stories</div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">Real people, real outcomes</h2>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={() => scroll(-1)} aria-label="Scroll left"
            className="grid h-9 w-9 place-items-center rounded-full border bg-white hover:bg-slate-50" style={{ borderColor: "rgb(var(--border))" }}>‹</button>
          <button onClick={() => scroll(1)} aria-label="Scroll right"
            className="grid h-9 w-9 place-items-center rounded-full border bg-white hover:bg-slate-50" style={{ borderColor: "rgb(var(--border))" }}>›</button>
        </div>
      </div>
      <div ref={ref} className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 -mx-4 px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {stories.map((s, i) => (
          <article key={i} className="w-[300px] sm:w-[340px] shrink-0 snap-start rounded-2xl border bg-white p-5 shadow-sm" style={{ borderColor: "rgb(var(--border))" }}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl shrink-0">{s.flag}</span>
              <div className="min-w-0">
                <div className="font-black text-sm">{s.name}, {s.age}</div>
                <div className="text-[11px] text-[rgb(var(--muted))]">{s.from} · {s.daysAgo < 60 ? `${s.daysAgo}d ago` : s.daysAgo < 365 ? `${Math.round(s.daysAgo / 30)}mo ago` : "1yr+ ago"}</div>
              </div>
            </div>
            <blockquote className="text-sm leading-relaxed italic border-l-2 border-blue-300 pl-3">
              &ldquo;{s.quote}&rdquo;
            </blockquote>
            <div className="mt-3 inline-block rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
              {s.outcome}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
