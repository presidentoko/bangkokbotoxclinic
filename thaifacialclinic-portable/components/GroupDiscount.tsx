"use client";
// Referral / group-trip discount widget. Generates a unique referral code stored in localStorage.

import { useEffect, useState } from "react";

function genCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

export default function GroupDiscount() {
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let c = localStorage.getItem("referral_code_v1");
    if (!c) { c = genCode(); localStorage.setItem("referral_code_v1", c); }
    setCode(c);
  }, []);

  if (!code) return null;
  const link = typeof window !== "undefined" ? `${window.location.origin}/?ref=${code}` : `?ref=${code}`;

  function copy() {
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <section className="rounded-2xl border-2 border-pink-300 bg-gradient-to-br from-pink-50 to-rose-50 p-5 sm:p-6">
      <div className="flex items-start gap-3 mb-4">
        <span className="text-3xl shrink-0">👯</span>
        <div className="flex-1">
          <h3 className="text-lg font-black tracking-tight">Travel with a friend → save 10% each</h3>
          <p className="text-sm text-[rgb(var(--muted))] mt-1">
            When two patients book together using your code, both clinics offer 10% off (or a complimentary upgrade — varies by clinic).
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border-2 border-pink-200 p-3 flex items-center gap-2">
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-widest text-pink-700">Your referral link</div>
          <div className="font-mono text-sm font-bold truncate">{link}</div>
        </div>
        <button onClick={copy}
          className="rounded-lg bg-pink-600 text-white px-4 py-2 text-xs font-bold hover:bg-pink-700 whitespace-nowrap shrink-0">
          {copied ? "✓ Copied" : "Copy link"}
        </button>
      </div>

      <p className="text-[11px] text-[rgb(var(--muted))] mt-3 leading-relaxed">
        Discount applies once both bookings are confirmed by participating clinics. Cannot combine with other promotions.
      </p>
    </section>
  );
}
