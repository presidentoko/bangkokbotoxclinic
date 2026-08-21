"use client";
import { useEffect, useState } from "react";

const FESTIVALS = [
  { month: "Jan", name: "New Year Celebrations", emoji: "🎆", where: "Central World, Asiatique", type: "Public holiday" },
  { month: "Feb", name: "Chinese New Year (Yaowarat)", emoji: "🏮", where: "Chinatown, Yaowarat Rd", type: "Cultural" },
  { month: "Mar", name: "Bangkok Art Biennale", emoji: "🎨", where: "Various galleries", type: "Arts" },
  { month: "Apr", name: "Songkran (Thai New Year)", emoji: "💦", where: "Silom, Khao San, Ekkamai", type: "National holiday" },
  { month: "May", name: "Royal Ploughing Ceremony", emoji: "👑", where: "Sanam Luang", type: "Royal ceremony" },
  { month: "Jun", name: "Hua Hin Jazz Festival", emoji: "🎷", where: "Hua Hin (day trip)", type: "Music" },
  { month: "Jul", name: "Asahna Bucha / Khao Phansa", emoji: "🕯️", where: "All temples", type: "Buddhist holiday" },
  { month: "Aug", name: "Her Majesty the Queen's Birthday", emoji: "🌸", where: "Ratchadamnoen Ave", type: "National holiday" },
  { month: "Sep", name: "Vegetarian Festival (J Festival)", emoji: "🥬", where: "Chinatown", type: "Cultural" },
  { month: "Oct", name: "Loy Krathong", emoji: "🪔", where: "Chao Phraya riverside", type: "National" },
  { month: "Nov", name: "Bangkok Jazz Festival + BIFF", emoji: "🎸", where: "Lumphini Park, World Trade", type: "Festival" },
  { month: "Dec", name: "Christmas + New Year countdown", emoji: "🎄", where: "Central World, Emporium", type: "Festival" },
];

const TYPE_COLORS: Record<string, string> = {
  "National holiday": "bg-orange-100 text-orange-700",
  "Cultural": "bg-red-100 text-red-700",
  "Arts": "bg-purple-100 text-purple-700",
  "Buddhist holiday": "bg-yellow-100 text-yellow-700",
  "Royal ceremony": "bg-blue-100 text-blue-700",
  "Music": "bg-green-100 text-green-700",
  "Festival": "bg-indigo-100 text-indigo-700",
  "Public holiday": "bg-gray-100 text-gray-700",
};

const MONTH_NUMS: Record<string, number> = {
  Jan:1,Feb:2,Mar:3,Apr:4,May:5,Jun:6,Jul:7,Aug:8,Sep:9,Oct:10,Nov:11,Dec:12,
};

export function BangkokFestivalCalendar() {
  const [currentMonth, setCurrentMonth] = useState<number | null>(null);

  useEffect(() => {
    setCurrentMonth(new Date().getMonth() + 1);
  }, []);

  if (currentMonth === null) return null;

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-4 my-4">
      <h2 className="text-xs font-black uppercase tracking-widest text-[var(--muted)] mb-3">
        📅 Bangkok festivals — full year calendar
      </h2>
      <div className="space-y-1.5">
        {FESTIVALS.map((f) => {
          const isCurrent = MONTH_NUMS[f.month] === currentMonth;
          return (
            <div
              key={f.month}
              className={`flex items-center gap-3 p-2.5 rounded-xl transition ${isCurrent ? "bg-orange-50 border border-orange-200" : "border border-[var(--border)]"}`}
            >
              <div className="shrink-0 w-8 text-center">
                <div className="text-[10px] font-black text-[var(--muted)] uppercase">{f.month}</div>
                <div className="text-lg">{f.emoji}</div>
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-bold text-xs ${isCurrent ? "text-orange-700" : ""}`}>
                  {f.name}
                  {isCurrent && <span className="ml-1.5 text-[9px] bg-orange-500 text-white rounded px-1.5 py-0.5 font-black">THIS MONTH</span>}
                </div>
                <div className="text-[10px] text-[var(--muted)] truncate">📍 {f.where}</div>
              </div>
              <span className={`shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded hidden sm:inline-block ${TYPE_COLORS[f.type] ?? "bg-gray-100 text-gray-700"}`}>
                {f.type}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
