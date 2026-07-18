"use client";
import { useEffect, useRef, useState } from "react";
import { SearchBar, type SearchableEntity } from "@/components/SearchBar";
import { fetchSearchIndex } from "@/lib/searchIndexClient";
import { useLocale } from "@/hooks/useLocale";

// Sitewide search entry point — most SEO-landed traffic arrives on a
// restaurant/hub page, not the homepage, and previously had no way to
// search from there at all (search only existed on the 3 home heroes).
export function SearchOverlay() {
  const [open, setOpen] = useState(false);
  const [entities, setEntities] = useState<SearchableEntity[]>([]);
  const locale = useLocale();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    fetchSearchIndex().then(setEntities);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => panelRef.current?.querySelector("input")?.focus(), 50);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      clearTimeout(t);
    };
  }, [open]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Search"
        className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[var(--fg)] hover:text-[var(--accent)] transition"
      >
        <span className="text-lg leading-none" aria-hidden>🔍</span>
      </button>
      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div ref={panelRef} className="absolute top-0 left-0 right-0 bg-[var(--card)] shadow-2xl p-4 pt-6">
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <SearchBar entities={entities} hrefBase="/restaurant" lang={locale} />
                </div>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close search"
                  className="min-h-[44px] min-w-[44px] flex items-center justify-center text-xl text-[var(--muted)] hover:text-[var(--fg)]"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
