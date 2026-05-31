"use client";
// Floating accessibility toolbar: font-size +/-, high-contrast toggle, dyslexia font.
// Applies via root-level CSS variables and class toggles.

import { useEffect, useState } from "react";

const FONT_KEY = "a11y_font";
const HC_KEY = "a11y_hc";
const DYS_KEY = "a11y_dys";

export default function AccessibilityToolbar() {
  const [open, setOpen] = useState(false);
  const [font, setFont] = useState(100); // % of base
  const [hc, setHc] = useState(false);
  const [dys, setDys] = useState(false);

  useEffect(() => {
    const f = Number(localStorage.getItem(FONT_KEY)) || 100;
    const h = localStorage.getItem(HC_KEY) === "1";
    const d = localStorage.getItem(DYS_KEY) === "1";
    setFont(f); setHc(h); setDys(d);
  }, []);

  useEffect(() => {
    document.documentElement.style.fontSize = `${font}%`;
    document.documentElement.classList.toggle("a11y-hc", hc);
    document.documentElement.classList.toggle("a11y-dys", dys);
    localStorage.setItem(FONT_KEY, String(font));
    localStorage.setItem(HC_KEY, hc ? "1" : "0");
    localStorage.setItem(DYS_KEY, dys ? "1" : "0");
  }, [font, hc, dys]);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        aria-label="Accessibility settings"
        className="hidden sm:grid fixed left-6 bottom-6 z-30 place-items-center h-12 w-12 rounded-full bg-slate-800 text-white shadow-xl hover:shadow-2xl print:hidden"
      >
        ♿
      </button>
      {open && (
        <div role="dialog" aria-label="Accessibility"
          className="fixed left-6 bottom-40 sm:bottom-20 z-40 w-72 rounded-2xl bg-white border-2 border-slate-300 shadow-2xl p-4 toast-fade-up print:hidden">
          <div className="text-xs font-black uppercase tracking-widest text-slate-600 mb-3">Accessibility</div>
          <div className="space-y-3">
            <div>
              <div className="text-xs font-bold mb-1">Font size · {font}%</div>
              <div className="flex gap-2">
                <button onClick={() => setFont(Math.max(80, font - 10))}
                  className="flex-1 rounded-lg border px-3 py-1.5 text-sm font-bold hover:bg-slate-50" style={{ borderColor: "var(--border)" }}>A−</button>
                <button onClick={() => setFont(100)}
                  className="flex-1 rounded-lg border px-3 py-1.5 text-sm font-bold hover:bg-slate-50" style={{ borderColor: "var(--border)" }}>A</button>
                <button onClick={() => setFont(Math.min(140, font + 10))}
                  className="flex-1 rounded-lg border px-3 py-1.5 text-sm font-bold hover:bg-slate-50" style={{ borderColor: "var(--border)" }}>A+</button>
              </div>
            </div>
            <label className="flex items-center justify-between gap-2 cursor-pointer rounded-lg border bg-slate-50 px-3 py-2" style={{ borderColor: "var(--border)" }}>
              <span className="text-xs font-bold">High contrast</span>
              <input type="checkbox" checked={hc} onChange={(e) => setHc(e.target.checked)} className="h-5 w-5 accent-slate-800" />
            </label>
            <label className="flex items-center justify-between gap-2 cursor-pointer rounded-lg border bg-slate-50 px-3 py-2" style={{ borderColor: "var(--border)" }}>
              <span className="text-xs font-bold">Dyslexia-friendly font</span>
              <input type="checkbox" checked={dys} onChange={(e) => setDys(e.target.checked)} className="h-5 w-5 accent-slate-800" />
            </label>
            <button
              onClick={() => { setFont(100); setHc(false); setDys(false); }}
              className="w-full text-xs font-bold text-slate-600 hover:underline mt-2"
            >
              Reset all
            </button>
          </div>
        </div>
      )}
    </>
  );
}
