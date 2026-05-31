"use client";
// Gamified clinic discovery — spin to land on a random top clinic.
// Pure CSS rotation. Picks weighted by trust score. Confetti on result.

import { useEffect, useRef, useState } from "react";
import type { Clinic } from "@/lib/types";

const SEGMENT_COLORS = [
  "#0ea5e9", "#10b981", "#f59e0b", "#ef4444",
  "#8b5cf6", "#06b6d4", "#ec4899", "#84cc16",
];

export default function ClinicSpinWheel({ clinics }: { clinics: Clinic[] }) {
  // Pick top 8 by trust score for the wheel
  const wheel = [...clinics].sort((a, b) => b.trust_score - a.trust_score).slice(0, 8);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<Clinic | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  function spin() {
    if (spinning || wheel.length === 0) return;
    setWinner(null);
    setSpinning(true);
    const pickIdx = Math.floor(Math.random() * wheel.length);
    const segAngle = 360 / wheel.length;
    // Target: center of picked segment at top (12 o'clock).
    // Multi-rotations + final precise angle. Pointer is at top.
    const target = 360 * 6 + (360 - (pickIdx * segAngle + segAngle / 2));
    setRotation(target);
    setTimeout(() => {
      setSpinning(false);
      setWinner(wheel[pickIdx]);
    }, 4200); // matches CSS transition
  }

  useEffect(() => {
    // Auto-spin one demo on first load after 1.5s
    const t = setTimeout(() => { if (!winner && !spinning) spin(); }, 1500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (wheel.length === 0) return null;

  const segAngle = 360 / wheel.length;

  return (
    <section className="rounded-[2rem] border-2 bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 p-6 sm:p-8 text-center" style={{ borderColor: "var(--border)" }}>
      <div className="mb-5">
        <div className="text-xs font-black uppercase tracking-widest text-amber-700 dark:text-amber-400">🎰 Spin & discover</div>
        <h2 className="mt-1 font-display text-3xl sm:text-4xl font-bold tracking-tighter-display">Can't decide? Spin the wheel.</h2>
        <p className="mt-2 text-sm muted">Lands on one of our top-8 verified clinics. Spin until you're curious.</p>
      </div>

      {/* Wheel + pointer */}
      <div className="relative mx-auto" style={{ width: 280, height: 280 }}>
        {/* Pointer */}
        <div className="absolute left-1/2 -translate-x-1/2 -top-3 z-10 text-3xl drop-shadow-lg">▼</div>

        <div
          ref={wheelRef}
          className="relative w-full h-full rounded-full shadow-2xl"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? "transform 4s cubic-bezier(0.17, 0.67, 0.34, 1.01)" : "none",
          }}
        >
          {wheel.map((c, i) => {
            const startAngle = i * segAngle;
            const color = SEGMENT_COLORS[i % SEGMENT_COLORS.length];
            return (
              <div
                key={c.id}
                className="absolute inset-0"
                style={{ transform: `rotate(${startAngle}deg)`, transformOrigin: "center" }}
              >
                <div
                  className="absolute left-1/2 top-0 origin-bottom"
                  style={{
                    width: 140,
                    height: 140,
                    transform: `translateX(-50%) rotate(${segAngle / 2}deg) skewY(${90 - segAngle}deg)`,
                    background: color,
                    borderTop: "2px solid white",
                  }}
                />
                {/* Label */}
                <div
                  className="absolute left-1/2 text-[10px] font-black text-white tracking-tight max-w-[80px] text-center"
                  style={{
                    top: 22,
                    transform: `translateX(-50%) rotate(${segAngle / 2}deg)`,
                    transformOrigin: "center 118px",
                    textShadow: "0 1px 2px rgba(0,0,0,0.4)",
                    pointerEvents: "none",
                  }}
                >
                  {c.name.split(" ").slice(0, 2).join(" ")}
                </div>
              </div>
            );
          })}
          {/* Center hub */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-16 w-16 rounded-full bg-white shadow-md grid place-items-center text-2xl">
            🎯
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="mt-5 min-h-[80px]">
        {winner ? (
          <div className="animate-fade-up">
            <div className="text-xs font-black uppercase tracking-widest text-emerald-700">✨ Your pick</div>
            <a href={`/clinic/${winner.id}`}
              className="block mt-1 font-display text-xl font-bold tracking-tighter-display hover:underline">
              {winner.name}
            </a>
            <p className="text-xs muted">{winner.city_label || winner.district} · ★ {(winner.rating ?? 0).toFixed(1)} · Trust {winner.trust_score}</p>
            <div className="mt-3 flex gap-2 justify-center">
              <a href={`/clinic/${winner.id}`}
                className="rounded-xl bg-navy-900 dark:bg-gold-400 dark:text-navy-950 text-white px-5 py-2.5 text-sm font-black hover:opacity-90">
                View clinic →
              </a>
              <button onClick={spin} disabled={spinning}
                className="rounded-xl border-2 px-5 py-2.5 text-sm font-bold hover:bg-white/50 disabled:opacity-50"
                style={{ borderColor: "var(--border)" }}>
                {spinning ? "Spinning…" : "Spin again 🔄"}
              </button>
            </div>
          </div>
        ) : (
          <button onClick={spin} disabled={spinning}
            className="rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white px-6 py-3 text-base font-black shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition disabled:opacity-50">
            {spinning ? "Spinning…" : "🎰 Spin the wheel"}
          </button>
        )}
      </div>
    </section>
  );
}
