"use client";
export function ResetPrefsButton() {
  return (
    <button
      onClick={() => { localStorage.removeItem("snsstopper_prefs"); window.location.reload(); }}
      className="px-8 py-3.5 rounded-2xl bg-[var(--accent)] text-white font-bold text-base hover:opacity-90 transition"
    >
      맞춤 추천 받기 →
    </button>
  );
}
