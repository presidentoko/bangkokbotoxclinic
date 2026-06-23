"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { searchPlaces, isUrl, detectPlatform } from "@/lib/search";
import type { SearchResult } from "@/lib/search";
import { plannerStore, CATEGORY_COLORS } from "@/lib/plan/store";
import type { Category } from "@/lib/plan/store";

type Mode = "idle" | "searching" | "resolving-link" | "confirm-match" | "miss" | "error";

type LinkResult = {
  status: string;
  matches?: SearchResult[];
  candidates?: string[];
  message?: string;
  fallback?: string;
  needsConfirmation?: boolean;
};

function usePlanCount() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const unsub = plannerStore.subscribe(() => setCount(plannerStore.getItemCount()));
    return unsub;
  }, []);
  return count;
}

export function HomeSearch({ lang = "en" }: { lang?: string }) {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("idle");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [linkResult, setLinkResult] = useState<LinkResult | null>(null);
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const planCount = usePlanCount();

  function handleInput(val: string) {
    setInput(val);
    setLinkResult(null);

    if (!val.trim()) {
      setMode("idle");
      setResults([]);
      return;
    }

    if (isUrl(val)) {
      setMode("idle");
      if (debounceTimer) clearTimeout(debounceTimer);
      return;
    }

    // Debounced text search
    if (debounceTimer) clearTimeout(debounceTimer);
    const t = setTimeout(() => {
      const found = searchPlaces(val, 5);
      setResults(found);
      setMode("searching");
    }, 200);
    setDebounceTimer(t);
  }

  async function handleSubmit() {
    const val = input.trim();
    if (!val) {
      router.push(`/${lang}/plan`);
      return;
    }

    if (isUrl(val)) {
      await resolveLink(val);
      return;
    }

    // Text search — single match → direct navigate
    const found = searchPlaces(val, 1);
    if (found.length === 1) {
      router.push(`/${lang}/place/${found[0].slug}`);
    } else if (found.length > 1) {
      setResults(found);
      setMode("searching");
    } else {
      // Miss
      setMode("miss");
    }
  }

  async function resolveLink(url: string) {
    setMode("resolving-link");
    try {
      const res = await fetch("/api/resolve-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = (await res.json()) as LinkResult;
      setLinkResult(data);

      if (data.status === "matched" && !data.needsConfirmation && data.matches?.[0]) {
        router.push(`/${lang}/place/${data.matches[0].slug}`);
      } else {
        setMode("confirm-match");
      }
    } catch {
      setMode("error");
    }
  }

  const platform = isUrl(input) ? detectPlatform(input) : null;

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* Search input */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => handleInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="Search place or paste TikTok / IG link…"
          className="w-full px-5 py-4 pr-14 rounded-2xl border-2 border-[var(--border)] focus:border-orange-400 focus:outline-none text-base bg-white shadow-sm transition"
        />
        <button
          onClick={handleSubmit}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition text-lg"
          aria-label="Search"
        >
          &rarr;
        </button>
      </div>

      {/* Mode hints */}
      {mode === "idle" && !input && (
        <div className="flex gap-2 mt-3 flex-wrap">
          <button
            onClick={() => router.push(`/${lang}/plan`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-xs font-bold text-orange-700 hover:bg-orange-100 transition"
          >
            Plan my day
          </button>
          <button
            onClick={() => { setInput(""); inputRef.current?.focus(); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-[var(--border)] text-xs font-medium text-[var(--muted)] hover:bg-gray-100 transition"
          >
            Paste link
          </button>
          {planCount > 0 && (
            <a
              href={`/${lang}/plan`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-xs font-bold text-teal-700"
            >
              Plan ({planCount})
            </a>
          )}
        </div>
      )}

      {/* Link platform detection */}
      {platform && mode === "idle" && (
        <div className="mt-3 flex items-center gap-2 text-sm text-[var(--muted)]">
          <span>{platform === "tiktok" ? "TikTok" : "Instagram"} link detected — press Enter to verify place</span>
        </div>
      )}

      {/* Resolving link */}
      {mode === "resolving-link" && (
        <div className="mt-3 flex items-center gap-2 text-sm text-[var(--muted)]">
          <span className="animate-spin inline-block">&#8987;</span>
          <span>Extracting place from link…</span>
        </div>
      )}

      {/* Text search results dropdown */}
      {mode === "searching" && results.length > 0 && (
        <div className="mt-2 bg-white border border-[var(--border)] rounded-2xl shadow-lg overflow-hidden">
          {results.map((r) => {
            const colors = CATEGORY_COLORS[r.category as Category];
            return (
              <a
                key={r.slug}
                href={`/${lang}/place/${r.slug}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition border-b border-[var(--border)] last:border-b-0"
              >
                <span
                  className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded-full shrink-0"
                  style={{ background: colors.bg, color: colors.text }}
                >
                  {r.category}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate">{r.name}</div>
                  <div className="text-xs text-[var(--muted)] truncate">{r.area}</div>
                </div>
                <span className="text-sm font-black shrink-0" style={{ color: "var(--score)" }}>
                  {r.localsScore}
                </span>
              </a>
            );
          })}
        </div>
      )}

      {/* Text search: no match */}
      {mode === "searching" && results.length === 0 && input && (
        <div className="mt-3 p-4 rounded-2xl border border-[var(--border)] bg-white text-sm">
          <div className="font-bold mb-1">Not in our database yet</div>
          <p className="text-[var(--muted)]">
            We&apos;ll add it to our verification queue. Paste a TikTok or IG link with this place
            to help us find it faster.
          </p>
        </div>
      )}

      {/* Miss state */}
      {mode === "miss" && (
        <div className="mt-3 p-4 rounded-2xl border border-[var(--border)] bg-white text-sm">
          <div className="font-bold mb-1">Not in our database yet</div>
          <p className="text-[var(--muted)]">
            We&apos;ll add it to our verification queue. Paste a TikTok or IG link with this place
            to help us find it faster.
          </p>
        </div>
      )}

      {/* Link result: confirmation needed */}
      {mode === "confirm-match" && linkResult && (
        <div className="mt-3 bg-white border border-[var(--border)] rounded-2xl p-4 shadow-sm">
          {linkResult.status === "matched" && linkResult.matches && (
            <>
              <div className="text-sm font-bold mb-3">Is this the place?</div>
              {linkResult.matches.map((m) => (
                <a
                  key={m.slug}
                  href={`/${lang}/place/${m.slug}`}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50 transition mb-2 border border-[var(--border)]"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm">{m.name}</div>
                    <div className="text-xs text-[var(--muted)]">
                      {m.area} · {m.subtype}
                    </div>
                  </div>
                  <span className="text-sm font-black" style={{ color: "var(--score)" }}>
                    {m.localsScore}
                  </span>
                  <span className="text-xs text-orange-600 font-bold shrink-0">Verify &rarr;</span>
                </a>
              ))}
              <button
                onClick={() => { setInput(""); setMode("idle"); setLinkResult(null); }}
                className="text-xs text-[var(--muted)] hover:text-[var(--fg)] mt-1"
              >
                Not the right place — type name instead
              </button>
            </>
          )}
          {(linkResult.status === "no_match" ||
            linkResult.status === "no_candidates" ||
            linkResult.status === "blocked" ||
            linkResult.status === "no_caption") && (
            <div>
              <div className="text-sm font-bold mb-1">
                {linkResult.status === "blocked"
                  ? "Link requires login"
                  : "Couldn't extract place from link"}
              </div>
              <p className="text-xs text-[var(--muted)] mb-3">
                {linkResult.fallback ?? "Please type the place name directly."}
              </p>
              {linkResult.status === "no_match" && (
                <div className="text-xs text-teal-700 font-bold">
                  Added to verification queue — we&apos;ll cover it soon
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Error */}
      {mode === "error" && (
        <div className="mt-3 p-3 rounded-xl border border-red-200 bg-red-50 text-sm text-red-700">
          Failed to resolve link. Please type the place name directly.
        </div>
      )}
    </div>
  );
}
