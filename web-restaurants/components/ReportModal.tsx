"use client";
import { useState } from "react";

const CATEGORIES = [
  { value: "paid", label: "This looks like paid promotion" },
  { value: "disappointing", label: "Visited — it wasn't like this" },
  { value: "fake_reviews", label: "I suspect fake reviews" },
  { value: "other", label: "Other" },
];

export function ReportModal({
  restaurantId,
  onClose,
}: {
  restaurantId: string;
  onClose: () => void;
}) {
  const [category, setCategory] = useState("");
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function submit() {
    if (!category) return;
    setLoading(true);
    setError(false);
    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "report", restaurantId, category, text }),
      });
      if (res.ok) setSent(true);
      else setError(true);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-[var(--card)] rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl">
        {sent ? (
          <div className="text-center py-6">
            <div className="text-3xl mb-3">📨</div>
            <p className="font-bold text-[var(--fg)]">Thanks for the report!</p>
            <p className="text-sm text-[var(--muted)] mt-1">We'll review it and update the listing.</p>
            <button
              onClick={onClose}
              className="mt-5 w-full min-h-[44px] py-2.5 rounded-xl bg-[var(--accent)] text-white font-bold text-sm"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h3 className="font-serif-display text-xl text-[var(--fg)] mb-4">What's the issue?</h3>
            <div className="space-y-2 mb-4">
              {CATEGORIES.map((c) => (
                <label key={c.value} className="flex items-center gap-3 cursor-pointer min-h-[44px]">
                  <input
                    type="radio"
                    name="category"
                    value={c.value}
                    checked={category === c.value}
                    onChange={() => setCategory(c.value)}
                    className="accent-[var(--accent)]"
                  />
                  <span className="text-sm text-[var(--fg)]">{c.label}</span>
                </label>
              ))}
            </div>
            <textarea
              placeholder="Additional details (optional)"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              maxLength={500}
              className="w-full border border-[var(--border)] rounded-xl px-3 py-2 text-base resize-none focus:outline-none focus:border-[var(--accent)] bg-[var(--bg)]"
            />
            {error && (
              <p className="text-sm text-red-600 mt-2">
                Couldn't send that — please try again in a bit.
              </p>
            )}
            <div className="flex gap-2 mt-3">
              <button
                onClick={onClose}
                className="flex-1 min-h-[44px] py-2.5 rounded-xl border border-[var(--border)] text-sm text-[var(--muted)] font-medium"
              >
                Cancel
              </button>
              <button
                onClick={submit}
                disabled={!category || loading}
                className="flex-1 min-h-[44px] py-2.5 rounded-xl bg-[var(--accent)] text-white font-bold text-sm disabled:opacity-40"
              >
                {loading ? "Sending..." : "Send report"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
