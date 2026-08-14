"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Lang } from "@/lib/site";
import { tFor } from "@/lib/i18n";
import { loadPlacesIndex } from "@/lib/places-index-client";

const QUALITY_MIN_RATING = 4.5;
const QUALITY_MIN_REVIEWS = 20;

export function SurpriseMeButton({ lang }: { lang: Lang }) {
  const t = tFor(lang);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  async function onClick() {
    setLoading(true);
    setFailed(false);
    try {
      const all = await loadPlacesIndex();
      const pool = all.filter((p) => (p.rating ?? 0) >= QUALITY_MIN_RATING && p.reviewCount >= QUALITY_MIN_REVIEWS);
      const pick = pool[Math.floor(Math.random() * pool.length)];
      if (pick) router.push(`/${lang}/place/${pick.id}`);
      // A rejected loadPlacesIndex() used to throw out of this async click
      // handler with no catch -- an unhandled promise rejection, and the
      // button silently sat on "Picking…" forever.
    } catch {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 backdrop-blur text-on-ink font-semibold px-5 py-2.5 min-h-11 hover:bg-white/10 transition disabled:opacity-60 disabled:pointer-events-none"
      >
        {loading ? t.home.surpriseLoading : t.home.surpriseMe}
      </button>
      {failed && <p className="text-xs text-on-ink/80">{t.home.surpriseError}</p>}
    </div>
  );
}
