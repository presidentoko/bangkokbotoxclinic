"use client";

import { useState } from "react";

const LEAD_ESTIMATES: Record<string, Record<string, number>> = {
  bangkok:    { implants: 22, veneers: 18, whitening: 14, orthodontics: 10, general: 30 },
  pattaya:    { implants: 8,  veneers: 6,  whitening: 5,  orthodontics: 4,  general: 12 },
  phuket:     { implants: 10, veneers: 8,  whitening: 6,  orthodontics: 5,  general: 14 },
  chiang_mai: { implants: 6,  veneers: 5,  whitening: 4,  orthodontics: 3,  general: 9  },
};

const CITIES = [
  { value: "bangkok",    label: "Bangkok" },
  { value: "pattaya",    label: "Pattaya" },
  { value: "phuket",     label: "Phuket" },
  { value: "chiang_mai", label: "Chiang Mai" },
];

const PROCEDURES = [
  { value: "implants",     label: "Dental Implants" },
  { value: "veneers",      label: "Veneers" },
  { value: "whitening",    label: "Teeth Whitening" },
  { value: "orthodontics", label: "Orthodontics" },
  { value: "general",      label: "General Dentistry" },
];

export function RoiCalculator() {
  const [city, setCity] = useState("bangkok");
  const [procedure, setProcedure] = useState("implants");

  const leads = LEAD_ESTIMATES[city]?.[procedure] ?? 10;
  const monthly = leads * 50;

  return (
    <div className="bg-white border border-[var(--border)] rounded-xl p-6 max-w-lg">
      <h3 className="font-bold text-lg mb-4">How many leads could you get?</h3>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <div>
          <label className="text-xs text-[var(--muted)] block mb-1">City</label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm"
          >
            {CITIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs text-[var(--muted)] block mb-1">Procedure</label>
          <select
            value={procedure}
            onChange={(e) => setProcedure(e.target.value)}
            className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm"
          >
            {PROCEDURES.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-emerald-50 rounded-lg p-4 mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-[var(--muted)]">Estimated leads/month</span>
          <span className="font-bold text-emerald-700">~{leads}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-sm text-[var(--muted)]">Cost per lead</span>
          <span className="font-bold">฿50</span>
        </div>
        <div className="flex justify-between border-t border-emerald-200 pt-2 mt-2">
          <span className="text-sm font-semibold">Monthly investment</span>
          <span className="font-bold text-emerald-700">฿{monthly.toLocaleString()}</span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-3 mb-5 text-sm text-[var(--muted)]">
        vs. Google Ads for same keywords:{" "}
        <span className="font-medium text-red-600">฿3,000–8,000/month</span>
      </div>

      <a
        href="#pilot"
        className="block w-full py-3 text-center rounded-lg bg-[var(--accent)] text-white font-semibold hover:opacity-90 transition"
      >
        Get Started Free →
      </a>

      <p className="text-xs text-[var(--muted)] mt-3 text-center">
        * Lead estimates based on site traffic data. Actual results vary.
      </p>
    </div>
  );
}
