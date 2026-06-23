"use client";
import { useState } from "react";

const CATEGORIES = [
  { value: "paid", label: "광고비 받은 거 알아요" },
  { value: "disappointing", label: "실제 가보니 별로였어요" },
  { value: "fake_reviews", label: "리뷰 조작 의심돼요" },
  { value: "other", label: "기타" },
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

  async function submit() {
    if (!category) return;
    setLoading(true);
    await fetch("/api/community", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "report", restaurantId, category, text }),
    });
    setSent(true);
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full sm:max-w-md bg-[var(--card)] rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl">
        {sent ? (
          <div className="text-center py-6">
            <div className="text-3xl mb-3">📨</div>
            <p className="font-bold text-[var(--fg)]">제보 감사해요!</p>
            <p className="text-sm text-[var(--muted)] mt-1">검토 후 반영할게요.</p>
            <button
              onClick={onClose}
              className="mt-5 w-full py-2.5 rounded-xl bg-[var(--accent)] text-white font-bold text-sm"
            >
              닫기
            </button>
          </div>
        ) : (
          <>
            <h3 className="font-serif-display text-xl text-[var(--fg)] mb-4">어떤 제보인가요?</h3>
            <div className="space-y-2 mb-4">
              {CATEGORIES.map((c) => (
                <label key={c.value} className="flex items-center gap-3 cursor-pointer">
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
              placeholder="추가 내용 (선택)"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              maxLength={500}
              className="w-full border border-[var(--border)] rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:border-[var(--accent)] bg-[var(--bg)]"
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={onClose}
                className="flex-1 py-2.5 rounded-xl border border-[var(--border)] text-sm text-[var(--muted)] font-medium"
              >
                취소
              </button>
              <button
                onClick={submit}
                disabled={!category || loading}
                className="flex-1 py-2.5 rounded-xl bg-[var(--accent)] text-white font-bold text-sm disabled:opacity-40"
              >
                {loading ? "전송 중..." : "제보 보내기"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
