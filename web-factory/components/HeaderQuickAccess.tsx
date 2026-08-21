"use client";

import { useEffect, useRef, useState } from "react";
import { useRecentlyViewed } from "./useRecentlyViewed";
import { useShortlist } from "./useShortlist";
import { pruneStaleRecent } from "@/lib/recentlyViewed";
import { clearShortlist, pruneStaleShortlist } from "@/lib/shortlist";
import { loadValidIds } from "@/lib/validIds";

export function HeaderQuickAccess() {
  const { items: recent } = useRecentlyViewed();
  const { items: shortlist } = useShortlist();
  const [openPanel, setOpenPanel] = useState<"recent" | "shortlist" | null>(null);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Drop entries for suppliers no longer in the current dataset (e.g. removed
  // in a data refresh) — otherwise a stale id lingers here forever and
  // clicking it just hits the /supplier/* catch-all redirect to the homepage.
  //
  // 이 컴포넌트는 루트 레이아웃에 있어서 사이트 전 페이지에서 마운트된다.
  // 예전에는 마운트 즉시 loadValidIds() → browse-index.json(2.0MB, 8,938건)을
  // 무조건 받았다. localStorage 가 빈 첫 방문자는 지울 게 없는데도 2MB 다운로드와
  // JSON.parse 를 전부 부담했다 — 모바일 첫 화면에서 가장 큰 비용이었다.
  // 이제 지울 대상이 실제로 있을 때만, 그것도 브라우저가 한가할 때 받는다.
  const storedCount = recent.length + shortlist.length;
  const pruned = useRef(false);
  useEffect(() => {
    if (storedCount === 0 || pruned.current) return;
    pruned.current = true;
    const run = () =>
      loadValidIds().then((validIds) => {
        if (validIds.size === 0) return;
        pruneStaleRecent(validIds);
        pruneStaleShortlist(validIds);
      });
    const ric = (window as unknown as {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
    }).requestIdleCallback;
    if (ric) {
      ric(run, { timeout: 5000 });
    } else {
      const t = setTimeout(run, 1500);
      return () => clearTimeout(t);
    }
  }, [storedCount]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpenPanel(null);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function shareShortlist() {
    const ids = shortlist.map((x) => x.id).join(",");
    const url = `${window.location.origin}/compare?ids=${ids}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => {
        // Clipboard API unavailable (non-HTTPS, permission denied, older Safari) —
        // same execCommand fallback ShortlistTray uses for this exact URL. Wrapped
        // in its own try/catch — if execCommand itself throws (deprecated/removed
        // in some browsers), the finally still removes the temp textarea instead
        // of leaving it stuck in the DOM.
        const el = document.createElement("textarea");
        el.value = url;
        el.style.position = "fixed";
        el.style.opacity = "0";
        document.body.appendChild(el);
        el.select();
        try {
          document.execCommand("copy");
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          // no fallback left — Share silently does nothing
        } finally {
          document.body.removeChild(el);
        }
      });
  }

  if (recent.length === 0 && shortlist.length === 0) return null;

  return (
    <div ref={ref} className="flex items-center gap-1">
      {recent.length > 0 && (
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenPanel(openPanel === "recent" ? null : "recent")}
            className="relative p-2.5 min-w-11 min-h-11 flex items-center justify-center rounded-lg hover:bg-[var(--gold-bg)] transition"
            aria-label={`Recently viewed (${recent.length})`}
          >
            <span aria-hidden className="text-base">🕒</span>
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[var(--gold)] text-white text-[9px] font-bold flex items-center justify-center tabular-nums">
              {recent.length}
            </span>
          </button>
          {openPanel === "recent" && (
            <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-[var(--border)] rounded-xl shadow-lg z-30 p-2">
              <div className="text-[10px] uppercase tracking-widest font-bold text-[var(--muted)] px-2 py-1.5">
                Recently viewed
              </div>
              {recent.slice(0, 5).map((r) => (
                <a
                  key={r.id}
                  href={`/supplier/${r.id}`}
                  className="block px-2 py-2 rounded-lg hover:bg-[var(--gold-bg)] transition"
                >
                  <div className="text-sm font-semibold truncate">{r.name}</div>
                  <div className="text-xs text-[var(--muted)]">
                    {r.cityLabel || "Thailand"} · Trust {r.trustScore}
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>
      )}
      {shortlist.length > 0 && (
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenPanel(openPanel === "shortlist" ? null : "shortlist")}
            className="relative p-2.5 min-w-11 min-h-11 flex items-center justify-center rounded-lg hover:bg-[var(--gold-bg)] transition"
            aria-label={`Shortlisted suppliers (${shortlist.length})`}
          >
            <span aria-hidden className="text-base">⚖️</span>
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[var(--gold)] text-white text-[9px] font-bold flex items-center justify-center tabular-nums">
              {shortlist.length}
            </span>
          </button>
          {openPanel === "shortlist" && (
            <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-[var(--border)] rounded-xl shadow-lg z-30 p-2">
              <div className="text-[10px] uppercase tracking-widest font-bold text-[var(--muted)] px-2 py-1.5">
                Shortlisted
              </div>
              {shortlist.slice(0, 5).map((s) => (
                <a
                  key={s.id}
                  href={`/supplier/${s.id}`}
                  className="block px-2 py-2 rounded-lg hover:bg-[var(--gold-bg)] transition"
                >
                  <div className="text-sm font-semibold truncate">{s.name}</div>
                  <div className="text-xs text-[var(--muted)]">{s.cityLabel}</div>
                </a>
              ))}
              <div className="flex gap-1.5 mt-1 pt-2 border-t border-[var(--border)]">
                <button
                  type="button"
                  onClick={shareShortlist}
                  className="flex-1 text-xs font-bold py-2.5 min-h-11 rounded-lg border border-[var(--border)] hover:border-[var(--gold)] transition"
                >
                  {copied ? "✓ Copied!" : "🔗 Share"}
                </button>
                <a
                  href="/compare"
                  className="flex-1 flex items-center justify-center text-center text-xs font-bold py-2.5 min-h-11 rounded-lg bg-[var(--gold)] text-white hover:opacity-90 transition"
                >
                  Compare →
                </a>
                <button
                  type="button"
                  onClick={clearShortlist}
                  className="text-xs font-bold py-2.5 min-h-11 px-3 rounded-lg border border-[var(--border)] hover:border-stone-700 transition"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
