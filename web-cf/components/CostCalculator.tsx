"use client";
// Focus-aware patient-side cost calculator. Renders different controls per focus
// (botox=units, dental=teeth count, etc). Returns null for focus types without a config.

import { useMemo, useState } from "react";
import type { SiteFocus } from "@/lib/site";

type ProcedureCfg = { v: string; name: string; perUnit: [number, number]; note: string };
type FocusCfg = {
  title: string;
  sub: string;
  unitLabel: string;
  unitMin: number;
  unitMax: number;
  unitStep: number;
  unitDefault: number;
  procedures: ProcedureCfg[];
  quickPicks: { v: string; t: string; units: [number, number] }[];
  caveat: string;
  vs_korea_mult: number;
  vs_us_mult: number;
};

const CFG: Partial<Record<SiteFocus, FocusCfg>> = {
  botox: {
    title: "Estimate your Botox cost",
    sub: "Real ranges from Bangkok clinics. Not a quote — just a realistic starting point.",
    unitLabel: "Units",
    unitMin: 10, unitMax: 100, unitStep: 5, unitDefault: 30,
    procedures: [
      { v: "allergan", name: "Allergan",  perUnit: [180, 280], note: "Original · longest data" },
      { v: "dysport",  name: "Dysport",   perUnit: [120, 200], note: "Faster onset · French" },
      { v: "botulax",  name: "Korean",    perUnit: [80,  140], note: "Botulax/Nabota/Innotox" },
    ],
    quickPicks: [
      { v: "glabella", t: "Forehead + 11s",   units: [20, 35] },
      { v: "fullface", t: "Full upper face",  units: [40, 60] },
      { v: "jawline",  t: "Masseter (jaw)",   units: [40, 80] },
      { v: "neck",     t: "Neck/platysma",    units: [40, 60] },
    ],
    caveat: "Pricing is per unit. Some clinics quote per area — convert before comparing. Ask if it's genuine brand and freshly imported.",
    vs_korea_mult: 1.4,
    vs_us_mult: 2.2,
  },
  dental: {
    title: "Estimate your dental cost",
    sub: "Bangkok dental clinic ranges. Not a quote — get an X-ray first.",
    unitLabel: "Number of teeth",
    unitMin: 1, unitMax: 28, unitStep: 1, unitDefault: 2,
    procedures: [
      { v: "implant",  name: "Implant",   perUnit: [55_000, 90_000],   note: "Single tooth, brand-name post + crown" },
      { v: "veneer",   name: "Veneer",    perUnit: [14_000, 28_000],   note: "Porcelain/E-max per tooth" },
      { v: "crown",    name: "Crown",     perUnit: [10_000, 22_000],   note: "Porcelain or zirconia" },
      { v: "whiten",   name: "Whitening", perUnit: [4_000,  9_000],    note: "In-office full mouth (flat)" },
    ],
    quickPicks: [
      { v: "single",  t: "Single tooth fix",      units: [1, 1] },
      { v: "smile",   t: "Smile makeover (8)",    units: [8, 10] },
      { v: "full",    t: "All-on-4 full arch",    units: [4, 6] },
      { v: "ortho",   t: "Ortho braces (full)",   units: [1, 1] },
    ],
    caveat: "Implant pricing includes crown unless noted. All-on-4 quotes are per arch. Ask about lab origin (Bangkok vs Germany changes price).",
    vs_korea_mult: 1.6,
    vs_us_mult: 3.0,
  },
  filler: {
    title: "Estimate your filler cost",
    sub: "Bangkok HA-filler clinic ranges per syringe.",
    unitLabel: "Syringes (1ml each)",
    unitMin: 1, unitMax: 10, unitStep: 1, unitDefault: 2,
    procedures: [
      { v: "juvederm",  name: "Juvederm",  perUnit: [12_000, 22_000], note: "Allergan, US-made" },
      { v: "restylane", name: "Restylane", perUnit: [11_000, 20_000], note: "Galderma, Swedish" },
      { v: "neuramis",  name: "Korean",    perUnit: [6_000,  12_000], note: "Neuramis/Yvoire/Theosyal" },
    ],
    quickPicks: [
      { v: "lips",    t: "Lips (1ml)",       units: [1, 1] },
      { v: "cheeks",  t: "Cheeks (2-3ml)",   units: [2, 3] },
      { v: "jaw",     t: "Jawline (3-4ml)",  units: [3, 4] },
      { v: "fullface", t: "Full face (5-7ml)", units: [5, 7] },
    ],
    caveat: "Quotes are per syringe (1ml). Some clinics price per area — convert before comparing. Confirm brand and expiry stamp.",
    vs_korea_mult: 1.3,
    vs_us_mult: 2.5,
  },
};

const focusFmtTHB = (n: number): string => {
  if (n >= 1_000_000) return `฿${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `฿${Math.round(n / 1000)}K`;
  return `฿${n.toFixed(0)}`;
};

export default function CostCalculator({ focus }: { focus: SiteFocus }) {
  const cfg = CFG[focus];
  const [proc, setProc] = useState(cfg?.procedures[0]?.v ?? "");
  const [units, setUnits] = useState(cfg?.unitDefault ?? 0);

  const procData = cfg?.procedures.find((p) => p.v === proc) || cfg?.procedures[0];

  const { lo, hi, korea, us } = useMemo(() => {
    if (!cfg || !procData) return { lo: 0, hi: 0, korea: 0, us: 0 };
    const [perLo, perHi] = procData.perUnit;
    const lo = units * perLo;
    const hi = units * perHi;
    const mid = (lo + hi) / 2;
    return { lo, hi, korea: mid * cfg.vs_korea_mult, us: mid * cfg.vs_us_mult };
  }, [units, procData, cfg]);

  if (!cfg || !procData) return null;
  const [perLo, perHi] = procData.perUnit;

  return (
    <section className="rounded-[2rem] border-2 bg-white p-6 shadow-md sm:p-10" style={{ borderColor: "var(--border)" }}>
      <div className="text-center mb-8">
        <div className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">Cost calculator</div>
        <h2 className="mt-2 text-3xl sm:text-4xl font-black tracking-tight">{cfg.title}</h2>
        <p className="mt-2 text-sm text-[var(--muted)] max-w-xl mx-auto">{cfg.sub}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-3">Procedure / brand</div>
            <div className="grid grid-cols-3 gap-2">
              {cfg.procedures.map((p) => (
                <button key={p.v} type="button" onClick={() => setProc(p.v)}
                  className={`rounded-xl border-2 p-3 text-left transition ${
                    proc === p.v ? "border-[var(--accent)] bg-slate-50" : "hover:border-slate-400"
                  }`}
                  style={{ borderColor: proc === p.v ? "var(--accent)" : "var(--border)" }}>
                  <div className="text-base font-black">{p.name}</div>
                  <div className="text-[10px] text-[var(--muted)] leading-tight mt-0.5">{p.note}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[var(--muted)]">{cfg.unitLabel}</span>
              <span className="text-2xl font-black tabular-nums">{units.toLocaleString()}</span>
            </div>
            <input
              type="range" min={cfg.unitMin} max={cfg.unitMax} step={cfg.unitStep}
              value={units} onChange={(e) => setUnits(Number(e.target.value))}
              className="w-full"
              style={{ accentColor: "var(--accent)" }}
            />
            <div className="flex justify-between text-[10px] text-[var(--muted)] font-bold">
              <span>{cfg.unitMin}</span>
              <span>{Math.round((cfg.unitMin + cfg.unitMax) / 2)}</span>
              <span>{cfg.unitMax}</span>
            </div>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-[var(--muted)] mb-2">Quick picks</div>
            <div className="grid grid-cols-2 gap-2">
              {cfg.quickPicks.map((o) => (
                <button key={o.v} type="button"
                  onClick={() => setUnits(Math.round((o.units[0] + o.units[1]) / 2))}
                  className="rounded-lg border bg-white p-2.5 text-left text-xs transition hover:border-black"
                  style={{ borderColor: "var(--border)" }}>
                  <div className="font-semibold leading-tight">{o.t}</div>
                  <div className="text-[10px] text-[var(--muted)] mt-0.5 tabular-nums">{o.units[0]}–{o.units[1]}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border-2 border-amber-400 bg-gradient-to-br from-amber-50 to-transparent p-6">
            <div className="text-[10px] font-bold uppercase tracking-widest text-amber-800">Estimated cost (THB)</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black tabular-nums text-amber-900">
                {focusFmtTHB(lo)}–{focusFmtTHB(hi)}
              </span>
            </div>
            <div className="mt-2 text-xs text-[var(--muted)] tabular-nums">
              {units.toLocaleString()} × ฿{perLo.toLocaleString()}–฿{perHi.toLocaleString()} ({procData.name})
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border bg-white p-4" style={{ borderColor: "var(--border)" }}>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">vs. Korea</div>
              <div className="mt-1 text-xl font-black tabular-nums">{focusFmtTHB(korea)}</div>
              <div className="text-[10px] text-[var(--muted)]">~{cfg.vs_korea_mult}× our price</div>
            </div>
            <div className="rounded-xl border bg-white p-4" style={{ borderColor: "var(--border)" }}>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">vs. US/UK</div>
              <div className="mt-1 text-xl font-black tabular-nums">{focusFmtTHB(us)}</div>
              <div className="text-[10px] text-[var(--muted)]">~{cfg.vs_us_mult}× our price</div>
            </div>
          </div>

          <p className="text-[11px] text-[var(--muted)] leading-relaxed">{cfg.caveat}</p>
        </div>
      </div>
    </section>
  );
}
