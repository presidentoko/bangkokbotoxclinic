"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { PackageRow } from "@/lib/db";

const KEY = "bkk_saved_packages";

function getSavedIds(): number[] {
  try {
    const v = localStorage.getItem(KEY);
    return v ? (JSON.parse(v) as number[]) : [];
  } catch { return []; }
}

function Flag({ val }: { val: number | null }) {
  if (val === 1) return <span className="text-emerald-500 font-bold">✓</span>;
  return <span className="text-slate-200">—</span>;
}

function PackageCard({ pkg, locale, onRemove }: { pkg: PackageRow; locale: string; onRemove: (id: number) => void }) {
  const bookUrl = pkg.checkup_url ?? pkg.source_url ?? "#";
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0">
            <Link href={`/${locale}/hospital/${pkg.hospital_slug}`} className="font-bold text-slate-800 hover:text-blue-700 leading-snug block">
              {pkg.hospital_name}
            </Link>
            <p className="text-sm text-slate-500 truncate">{pkg.package_name}</p>
            {pkg.category && (
              <span className="text-[11px] bg-violet-100 text-violet-700 font-medium px-2 py-0.5 rounded-full">{pkg.category}</span>
            )}
          </div>
          <div className="text-right shrink-0">
            {pkg.price
              ? <p className="text-xl font-bold text-blue-700">฿{parseFloat(pkg.price).toLocaleString()}</p>
              : <p className="text-sm text-slate-400 italic">Contact for price</p>}
            {pkg.jci === 1 && <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded uppercase">JCI</span>}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-1 text-center text-xs mt-3">
          {[
            { label: "Blood", val: pkg.has_blood },
            { label: "X-Ray", val: pkg.has_xray },
            { label: "Ultrasound", val: pkg.has_ultrasound },
            { label: "Cancer", val: pkg.has_cancer_marker },
          ].map((f) => (
            <div key={f.label} className="bg-slate-50 rounded py-1.5">
              <div className="text-[10px] text-slate-400 mb-0.5">{f.label}</div>
              <Flag val={f.val} />
            </div>
          ))}
        </div>
      </div>

      <div className="px-5 pb-4 pt-2 flex items-center gap-2">
        <a href={`/api/track?pkg=${pkg.package_id}&url=${encodeURIComponent(bookUrl)}`}
          target="_blank" rel="noopener noreferrer"
          className="flex-1 bg-blue-600 text-white text-sm font-bold py-2.5 rounded-xl text-center hover:bg-blue-700 transition-colors">
          Book / Enquire →
        </a>
        <button
          onClick={() => onRemove(pkg.package_id)}
          className="text-sm text-slate-400 border border-slate-200 px-3 py-2.5 rounded-xl hover:border-red-300 hover:text-red-400 transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

export default function SavedPage() {
  const params = useParams();
  const locale = (params.locale as string) ?? "en";
  const [packages, setPackages] = useState<PackageRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ids = getSavedIds();
    if (!ids.length) { setLoading(false); return; }
    fetch(`/api/packages?ids=${ids.join(",")}`)
      .then((r) => r.json())
      .then((data) => { setPackages(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function remove(id: number) {
    try {
      const saved = new Set(getSavedIds());
      saved.delete(id);
      localStorage.setItem(KEY, JSON.stringify([...saved]));
    } catch { /* ignore */ }
    setPackages((prev) => prev.filter((p) => p.package_id !== id));
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <nav className="text-sm text-slate-400 mb-6 flex items-center gap-2">
        <Link href={`/${locale}`} className="hover:text-blue-600">Home</Link>
        <span>›</span>
        <span className="text-slate-600">Saved packages</span>
      </nav>

      <h1 className="text-2xl font-bold text-slate-900 mb-2">Saved packages</h1>
      <p className="text-slate-500 text-sm mb-8">
        Packages you starred. Saved locally in your browser — they won&apos;t sync between devices.
      </p>

      {loading ? (
        <div className="text-center py-20 text-slate-300 text-4xl">⏳</div>
      ) : packages.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-slate-300 text-5xl mb-4">☆</p>
          <p className="text-slate-500 font-medium mb-2">No saved packages yet</p>
          <p className="text-slate-400 text-sm mb-6">Tap the ☆ on any package to save it for later.</p>
          <Link href={`/${locale}/compare`}
            className="bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors">
            Browse packages →
          </Link>
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-400 mb-4">{packages.length} saved package{packages.length !== 1 ? "s" : ""}</p>
          <div className="space-y-4">
            {packages.map((pkg) => (
              <PackageCard key={pkg.package_id} pkg={pkg} locale={locale} onRemove={remove} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href={`/${locale}/compare`} className="text-sm text-blue-600 hover:underline">
              ← Browse more packages
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
