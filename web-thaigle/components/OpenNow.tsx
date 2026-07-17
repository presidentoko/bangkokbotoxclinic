"use client";
import { useEffect, useState } from "react";

type TimeSlot = {
  hours: number[];
  label: string;
  emoji: string;
  links: { label: string; url: string }[];
};

const SLOTS: TimeSlot[] = [
  {
    hours: [6, 7, 8, 9],
    label: "Early morning — cafés & breakfast spots open",
    emoji: "🌅",
    links: [
      { label: "Morning cafés", url: "/restaurants/cuisine/cafe" },
      { label: "Yoga classes", url: "/activities/yoga-pilates" },
    ],
  },
  {
    hours: [10, 11, 12, 13, 14],
    label: "Midday — set lunch menus, massage opens, markets busy",
    emoji: "☀️",
    links: [
      { label: "Lunch spots", url: "/restaurants/cuisine/thai" },
      { label: "Thai massage", url: "/activities/spa" },
    ],
  },
  {
    hours: [15, 16, 17],
    label: "Afternoon lull — great time for a spa session",
    emoji: "🧖",
    links: [
      { label: "Spa & massage", url: "/activities/spa" },
      { label: "Cooking classes", url: "/activities/cooking" },
    ],
  },
  {
    hours: [18, 19, 20],
    label: "Evening — restaurants peak, street food stalls out",
    emoji: "🌆",
    links: [
      { label: "Dinner tonight", url: "/for/date-night" },
      { label: "Street food spots", url: "/restaurants/cuisine/street_food" },
    ],
  },
  {
    hours: [21, 22, 23],
    label: "Late night — bars, rooftops & night markets",
    emoji: "🌃",
    links: [
      { label: "Night scene", url: "/for/late-night" },
      { label: "Yaowarat (Chinatown)", url: "/restaurants/cuisine/chinese" },
    ],
  },
  {
    hours: [0, 1, 2, 3, 4, 5],
    label: "Late night / early hours — rest up for tomorrow!",
    emoji: "🌙",
    links: [
      { label: "Plan tomorrow", url: "/plan" },
      { label: "Day plans", url: "/day-plan" },
    ],
  },
];

function bangkokHour(): number {
  return parseInt(
    new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Bangkok", hour: "numeric", hour12: false }).format(new Date()),
    10
  ) % 24;
}

export function OpenNow() {
  const [slot, setSlot] = useState<TimeSlot | null>(null);

  useEffect(() => {
    // "What's good right now" means right now in Bangkok, not the
    // visitor's local time — a London reader at 8pm Bangkok time was
    // getting the breakfast-café slot instead of the dinner slot.
    const hour = bangkokHour();
    setSlot(SLOTS.find((s) => s.hours.includes(hour)) ?? SLOTS[0]);
  }, []);

  if (!slot) return null;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">{slot.emoji}</span>
        <div className="text-sm font-black">What&apos;s good right now</div>
      </div>
      <p className="text-xs text-[var(--muted)] mb-3">{slot.label}</p>
      <div className="flex flex-wrap gap-2">
        {slot.links.map((l, i) => (
          <a
            key={i}
            href={l.url}
            className="text-xs px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 font-medium hover:bg-orange-100 transition"
          >
            {l.label} →
          </a>
        ))}
      </div>
    </div>
  );
}
