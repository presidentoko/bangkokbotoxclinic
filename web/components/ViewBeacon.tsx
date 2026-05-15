"use client";
import { useEffect } from "react";

/**
 * Client-side profile view beacon — POSTs to /api/view once per mount.
 * Used on public clinic pages (SSG) where server-side counting won't work.
 */
export function ViewBeacon({ clinicId }: { clinicId: string }) {
  useEffect(() => {
    // Once-per-session de-dup to avoid inflated counts on tab switches / refreshes
    const key = `view:${clinicId}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch { /* sessionStorage unavailable — still fire */ }

    fetch("/api/view", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clinic_id: clinicId }),
      keepalive: true,
    }).catch(() => {});
  }, [clinicId]);

  return null;
}
