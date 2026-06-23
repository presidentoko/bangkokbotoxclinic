"use client";
import { useState } from "react";
import { ReportModal } from "./ReportModal";

export function CommunityButtons({
  restaurantId,
  initialFlags = 0,
  initialUp = 0,
  initialDown = 0,
}: {
  restaurantId: string;
  initialFlags?: number;
  initialUp?: number;
  initialDown?: number;
}) {
  const [flags, setFlags] = useState(initialFlags);
  const [up, setUp] = useState(initialUp);
  const [down, setDown] = useState(initialDown);
  const [flagged, setFlagged] = useState(false);
  const [voted, setVoted] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const total = up + down;
  const agreePct = total > 0 ? Math.round((up / total) * 100) : null;

  async function handleFlag() {
    if (flagged) return;
    setFlagged(true);
    setFlags((f) => f + 1);
    const res = await fetch("/api/community", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "flag", restaurantId }),
    });
    if (!res.ok) {
      setFlagged(false);
      setFlags((f) => f - 1);
    }
  }

  async function handleVote(value: "up" | "down") {
    if (voted) return;
    setVoted(true);
    if (value === "up") setUp((v) => v + 1);
    else setDown((v) => v + 1);
    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "vote", restaurantId, value }),
      });
      if (!res.ok) {
        setVoted(false);
        if (value === "up") setUp((v) => v - 1);
        else setDown((v) => v - 1);
      }
    } catch {
      setVoted(false);
      if (value === "up") setUp((v) => v - 1);
      else setDown((v) => v - 1);
    }
  }

  return (
    <>
      <div className="flex gap-1.5 pt-2 border-t border-[var(--border)] mt-2">
        <button
          onClick={handleFlag}
          disabled={flagged}
          className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition font-medium ${
            flagged
              ? "bg-red-50 border-red-200 text-red-500"
              : "border-[var(--border)] text-[var(--muted)] hover:border-red-300 hover:text-red-500 hover:bg-red-50"
          }`}
          title="인플루언서 낚시 신고"
        >
          🚩 {flags > 0 && <span>{flags}</span>}
        </button>

        <button
          onClick={() => handleVote("up")}
          disabled={voted}
          className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition font-medium ${
            voted
              ? "bg-green-50 border-green-200 text-green-600"
              : "border-[var(--border)] text-[var(--muted)] hover:border-green-300 hover:text-green-600 hover:bg-green-50"
          }`}
          title="Trust Score 맞아요"
        >
          👍 {agreePct !== null ? <span>{agreePct}% 동의</span> : <span>맞아요</span>}
        </button>

        <button
          onClick={() => handleVote("down")}
          disabled={voted}
          className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border transition font-medium ${
            voted
              ? "bg-orange-50 border-orange-200 text-orange-500"
              : "border-[var(--border)] text-[var(--muted)] hover:border-orange-300 hover:text-orange-500 hover:bg-orange-50"
          }`}
          title="실제랑 달라요"
        >
          👎 {voted && <span>반영됨</span>}
        </button>

        <button
          onClick={() => setShowReport(true)}
          className="ml-auto flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg border border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent-light)] transition font-medium"
          title="제보하기"
        >
          📨 제보
        </button>
      </div>

      {showReport && (
        <ReportModal restaurantId={restaurantId} onClose={() => setShowReport(false)} />
      )}
    </>
  );
}
