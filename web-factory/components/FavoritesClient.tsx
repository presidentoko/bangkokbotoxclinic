"use client";

import Link from "next/link";
import { useFavorites } from "./useFavorites";
import { removeFavorite, clearFavorites } from "@/lib/favorites";

// Lists the suppliers saved on this device. Cross-links to /compare and /quote
// rather than embedding the RFQ form (favorites is "save for later", not "quote now").
export function FavoritesClient() {
  const { items, mounted } = useFavorites();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <nav className="text-sm text-stone-500 mb-4" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-stone-900">Home</Link>
        <span className="mx-2">›</span>
        <span className="text-stone-900 font-bold">Saved</span>
      </nav>

      <h1 className="text-2xl font-bold text-stone-900 mb-1">Saved suppliers</h1>
      <p className="text-sm text-stone-600 mb-6">
        Suppliers you&apos;ve saved on this device. Compare them side by side or request a
        quote from your shortlist.
      </p>

      {!mounted ? null : items.length === 0 ? (
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-8 text-center">
          <p className="text-stone-600 mb-3">You haven&apos;t saved any suppliers yet.</p>
          <Link href="/" className="text-amber-800 font-bold hover:underline">Browse suppliers →</Link>
        </div>
      ) : (
        <>
          <div className="bg-white border border-stone-200 rounded-xl divide-y divide-stone-100 mb-6">
            {items.map((s) => (
              <div key={s.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <Link href={`/supplier/${s.id}`} className="font-bold text-stone-900 hover:text-amber-800 truncate block">
                    {s.name}
                  </Link>
                  {s.cityLabel && <div className="text-xs text-stone-500 truncate">{s.cityLabel}</div>}
                </div>
                <button
                  type="button"
                  onClick={() => removeFavorite(s.id)}
                  className="text-stone-400 hover:text-red-600 text-sm shrink-0"
                  aria-label={`Remove ${s.name}`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/compare"
              className="inline-flex items-center justify-center py-2.5 px-4 rounded-lg text-sm font-bold bg-stone-900 text-white hover:bg-stone-800"
            >
              Compare suppliers
            </Link>
            <Link
              href="/quote"
              className="inline-flex items-center justify-center py-2.5 px-4 rounded-lg text-sm font-bold border border-stone-300 text-stone-900 hover:border-stone-900"
            >
              Request a bulk quote
            </Link>
            <button
              type="button"
              onClick={() => clearFavorites()}
              className="text-sm text-stone-500 hover:text-red-600"
            >
              Clear all
            </button>
            <span className="text-xs text-stone-400">{items.length} saved</span>
          </div>
        </>
      )}
    </div>
  );
}
