"use client";
import { useEffect, useState } from "react";

type EventEntry = { name: string; emoji: string; month: number; day: number; desc: string };

const EVENTS: EventEntry[] = [
  { name: "Songkran Water Festival", emoji: "💦", month: 4, day: 13, desc: "Bangkok's biggest street party — water fights citywide." },
  { name: "Loy Krathong", emoji: "🪔", month: 11, day: 15, desc: "Float offerings on rivers, sky lanterns light up Bangkok." },
  { name: "New Year's Eve Bangkok", emoji: "🎆", month: 12, day: 31, desc: "Massive countdown at Centralworld, fireworks on the Chao Phraya." },
  { name: "Chinese New Year Bangkok", emoji: "🐉", month: 1, day: 29, desc: "Yaowarat Chinatown comes alive with dragon dances and street food." },
  { name: "King's Birthday", emoji: "🇹🇭", month: 7, day: 28, desc: "National holiday — many venues closed, grand ceremonies citywide." },
];

// "Days away" and "already happened this year" need to be evaluated
// against Bangkok's own calendar day, not the visitor's — otherwise a
// distant-timezone reader gets an off-by-one day count, or the event flips
// to "next year" up to ~14 hours early/late depending on which side of UTC
// their local midnight falls on. Building a UTC-stamped Date whose fields
// mirror the Bangkok wall clock keeps every comparison in one consistent
// (fictional but self-consistent) frame.
function bangkokNow(): Date {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Bangkok",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value ?? "0");
  return new Date(Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second")));
}

function getNextOccurrence(month: number, day: number, now: Date): Date {
  const thisYear = new Date(Date.UTC(now.getUTCFullYear(), month - 1, day));
  if (thisYear > now) return thisYear;
  return new Date(Date.UTC(now.getUTCFullYear() + 1, month - 1, day));
}

function daysUntil(d: Date, now: Date): number {
  const diff = d.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function BangkokCountdown() {
  const [event, setEvent] = useState<{ entry: EventEntry; days: number } | null>(null);

  useEffect(() => {
    const now = bangkokNow();
    const withDays = EVENTS.map((e) => ({
      entry: e,
      days: daysUntil(getNextOccurrence(e.month, e.day, now), now),
    })).sort((a, b) => a.days - b.days);
    setEvent(withDays[0]);
  }, []);

  if (!event) return null;

  return (
    <div className="rounded-2xl border border-purple-200 bg-purple-50 p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-purple-700 mb-3">
        📅 Next Bangkok event
      </h2>
      <div className="flex items-center gap-3">
        <span className="text-3xl">{event.entry.emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="font-black text-sm text-purple-900">{event.entry.name}</div>
          <div className="text-xs text-purple-800 opacity-90 mt-0.5 leading-snug">{event.entry.desc}</div>
        </div>
        <div className="shrink-0 text-center">
          <div className="text-2xl font-black tabular-nums text-purple-700">{event.days}</div>
          <div className="text-[10px] text-purple-600 font-bold uppercase">days away</div>
        </div>
      </div>
    </div>
  );
}
