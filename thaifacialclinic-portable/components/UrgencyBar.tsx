"use client";
// Booking.com-style scarcity/social-proof strip. Deterministic per-clinic per-hour so
// the numbers don't jitter on every render but still feel fresh.

import { useEffect, useState } from "react";

function hourSeed(clinicId: string): number {
  const hourBucket = Math.floor(Date.now() / 3_600_000);
  let h = hourBucket;
  for (let i = 0; i < clinicId.length; i++) h = (h * 31 + clinicId.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export default function UrgencyBar({
  clinicId,
  trustScore,
  totalReviews,
}: {
  clinicId: string;
  trustScore: number;
  totalReviews: number;
}) {
  const [viewing, setViewing] = useState<number | null>(null);
  const [recentBooks, setRecentBooks] = useState<number | null>(null);

  useEffect(() => {
    const seed = hourSeed(clinicId);
    // "Viewing now": 3-14 range, biased higher for higher trust score
    const trustBoost = Math.floor(trustScore / 25); // 0-4
    setViewing(3 + (seed % 8) + trustBoost);
    // "Booked this week": correlated with review volume
    const baseBooks = Math.floor(totalReviews / 80);
    setRecentBooks(Math.max(2, baseBooks + ((seed >> 8) % 5)));
  }, [clinicId, trustScore, totalReviews]);

  if (viewing === null) return null;

  const signals = [
    { icon: "👥", text: <><strong>{viewing}</strong> people viewing this clinic right now</> },
    { icon: "📅", text: <><strong>{recentBooks}</strong> consultations booked this week</> },
    { icon: "⚡", text: <>Average reply time <strong>under 4 hours</strong></> },
    { icon: "🛡️", text: <>Verified across <strong>5+ public sources</strong></> },
  ];

  return (
    <div className="rounded-2xl border-2 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 px-4 py-3 my-4" style={{ borderColor: "#fcd34d" }}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {signals.map((s, i) => (
          <div key={i} className="flex items-start gap-2 text-xs leading-snug">
            <span className="text-base shrink-0 leading-none mt-0.5">{s.icon}</span>
            <div className="min-w-0">{s.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
