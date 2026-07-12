"use client";
import { useEffect, useRef, useState } from "react";
import { ReportModal } from "./ReportModal";
import { subscribeCounts } from "@/lib/communityCounts";

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
  const [toast, setToast] = useState<string | null>(null);
  const interactedRef = useRef(false);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    const unsubscribe = subscribeCounts(restaurantId, (counts) => {
      if (interactedRef.current) return;
      setFlags(counts.flags);
      setUp(counts.up);
      setDown(counts.down);
    });
    return unsubscribe;
  }, [restaurantId]);

  const total = up + down;
  const agreePct = total > 0 ? Math.round((up / total) * 100) : null;

  async function handleFlag() {
    if (flagged) return;
    interactedRef.current = true;
    setFlagged(true);
    const newCount = flags + 1;
    setFlags(newCount);
    try {
      const res = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "flag", restaurantId }),
      });
      if (!res.ok) {
        setFlagged(false);
        setFlags((f) => f - 1);
      } else {
        setToast(
          newCount > 1
            ? `🚩 Flagged — you're one of ${newCount.toLocaleString()} who noticed.`
            : "🚩 Flagged — you're the first to notice this one."
        );
      }
    } catch {
      setFlagged(false);
      setFlags((f) => f - 1);
    }
  }

  async function handleVote(value: "up" | "down") {
    if (voted) return;
    interactedRef.current = true;
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
      } else {
        setToast(value === "up" ? "👍 Thanks — vote counted." : "👎 Thanks — we'll factor that in.");
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
          className={`flex items-center gap-1 text-xs px-2.5 min-h-[40px] rounded-lg border transition font-medium ${
            flagged
              ? "bg-red-50 border-red-200 text-red-500"
              : "border-[var(--border)] text-[var(--muted)] hover:border-red-300 hover:text-red-500 hover:bg-red-50"
          }`}
          title="Flag as influencer bait"
        >
          🚩 {flags > 0 && <span>{flags}</span>}
        </button>

        <button
          onClick={() => handleVote("up")}
          disabled={voted}
          className={`flex items-center gap-1 text-xs px-2.5 min-h-[40px] rounded-lg border transition font-medium ${
            voted
              ? "bg-green-50 border-green-200 text-green-600"
              : "border-[var(--border)] text-[var(--muted)] hover:border-green-300 hover:text-green-600 hover:bg-green-50"
          }`}
          title="Trust Score checks out"
        >
          👍 {agreePct !== null ? <span>{agreePct}% agree</span> : <span>Agree</span>}
        </button>

        <button
          onClick={() => handleVote("down")}
          disabled={voted}
          className={`flex items-center gap-1 text-xs px-2.5 min-h-[40px] rounded-lg border transition font-medium ${
            voted
              ? "bg-orange-50 border-orange-200 text-orange-500"
              : "border-[var(--border)] text-[var(--muted)] hover:border-orange-300 hover:text-orange-500 hover:bg-orange-50"
          }`}
          title="Doesn't match reality"
        >
          👎 {voted && <span>Noted</span>}
        </button>

        <button
          onClick={() => setShowReport(true)}
          className="ml-auto flex items-center gap-1 text-xs px-2.5 min-h-[40px] rounded-lg border border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent-light)] transition font-medium"
          title="Report an issue"
        >
          📨 Report
        </button>
      </div>

      {toast && (
        <p className="text-xs text-[var(--muted)] mt-1.5" role="status">{toast}</p>
      )}

      {showReport && (
        <ReportModal restaurantId={restaurantId} onClose={() => setShowReport(false)} />
      )}
    </>
  );
}
