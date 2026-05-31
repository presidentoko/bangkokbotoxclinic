"use client";
// Drag-handle B/A photo reveal slider. RealSelf classic.
// Accepts {before, after} URLs. Keyboard: arrow keys move handle.

import { useEffect, useRef, useState } from "react";

export default function BeforeAfterSlider({
  before, after,
  beforeLabel = "Before",
  afterLabel = "After",
  alt = "Before / after",
}: {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
  alt?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(50);
  const [dragging, setDragging] = useState(false);

  function fromClientX(x: number) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const p = ((x - rect.left) / rect.width) * 100;
    setPct(Math.max(0, Math.min(100, p)));
  }

  useEffect(() => {
    if (!dragging) return;
    const move = (e: MouseEvent | TouchEvent) => {
      const x = "touches" in e ? e.touches[0].clientX : e.clientX;
      fromClientX(x);
    };
    const up = () => setDragging(false);
    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchend", up);
    };
  }, [dragging]);

  function onKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft")  setPct((p) => Math.max(0, p - 4));
    if (e.key === "ArrowRight") setPct((p) => Math.min(100, p + 4));
  }

  return (
    <div
      ref={ref}
      className="relative w-full aspect-[4/3] overflow-hidden rounded-xl select-none bg-slate-100 touch-none"
      onMouseDown={(e) => { setDragging(true); fromClientX(e.clientX); }}
      onTouchStart={(e) => { setDragging(true); fromClientX(e.touches[0].clientX); }}
      role="slider"
      aria-label="Before/after slider"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
      onKeyDown={onKey}
    >
      {/* After image (full background) */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={after} alt={`${alt} — after`} className="absolute inset-0 w-full h-full object-cover" referrerPolicy="no-referrer" />

      {/* Before image clipped */}
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={before} alt={`${alt} — before`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
      </div>

      {/* Labels */}
      <span className="absolute top-3 left-3 rounded-md bg-black/70 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1">{beforeLabel}</span>
      <span className="absolute top-3 right-3 rounded-md bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest px-2 py-1">{afterLabel}</span>

      {/* Drag handle line + circle */}
      <div className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.4)] pointer-events-none"
        style={{ left: `${pct}%`, transform: "translateX(-50%)" }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 grid place-items-center h-10 w-10 rounded-full bg-white shadow-xl border-2 border-emerald-500 cursor-ew-resize pointer-events-auto">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="text-emerald-700">
            <path d="M9 18l-6-6 6-6M15 6l6 6-6 6" />
          </svg>
        </div>
      </div>
    </div>
  );
}
