"use client";
export function ResetPrefsButton() {
  return (
    <button
      onClick={() => {
        try {
          localStorage.removeItem("snsstopper_prefs");
          localStorage.removeItem("snsstopper_onboarding_skipped");
        } catch {}
        window.location.reload();
      }}
      className="px-8 py-3.5 rounded-2xl bg-[var(--accent)] text-white font-bold text-base hover:opacity-90 transition"
    >
      Get personalized picks →
    </button>
  );
}
