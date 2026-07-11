"use client";
import { useState, useEffect, useRef, useDeferredValue } from "react";
import Link from "next/link";

type HospitalResult = {
  slug: string; name: string; city: string | null; jci: number | null;
  min_price: string | null; pkg_count: number;
};
type PackageResult = {
  package_id: number; package_name: string; category: string; price: string | null;
  hospital_slug: string; hospital_name: string; jci: number | null;
};

export function SiteSearch({ locale }: { locale: string }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [hospitals, setHospitals] = useState<HospitalResult[]>([]);
  const [packages, setPackages] = useState<PackageResult[]>([]);
  const [loading, setLoading] = useState(false);
  const deferred = useDeferredValue(query);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = deferred.trim();
    if (q.length < 2) { setHospitals([]); setPackages([]); return; }
    let cancelled = false;
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((data: { hospitals: HospitalResult[]; packages: PackageResult[] }) => {
        if (cancelled) return;
        setHospitals(data.hospitals ?? []);
        setPackages(data.packages ?? []);
      })
      .catch(() => { if (!cancelled) { setHospitals([]); setPackages([]); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [deferred]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const hasResults = hospitals.length > 0 || packages.length > 0;

  return (
    <div ref={boxRef} className="relative w-full max-w-xs">
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Search hospitals or packages…"
          className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl text-base md:text-sm bg-white focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200"
        />
      </div>
      {open && query.trim().length >= 2 && (
        <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden max-h-96 overflow-y-auto">
          {loading && !hasResults && (
            <div className="px-4 py-3 text-sm text-slate-400">Searching…</div>
          )}
          {!loading && !hasResults && (
            <div className="px-4 py-3 text-sm text-slate-500">No results for &ldquo;{query}&rdquo;</div>
          )}
          {hospitals.length > 0 && (
            <div>
              <p className="px-4 pt-2 pb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Hospitals</p>
              {hospitals.map((h) => (
                <Link key={h.slug} href={`/${locale}/hospital/${h.slug}`} onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-4 py-2 hover:bg-slate-50 border-b last:border-0 border-slate-50">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{h.name}</p>
                    <p className="text-xs text-slate-500">{h.city || "Thailand"}</p>
                  </div>
                  <div className="text-end shrink-0 ms-2">
                    {h.jci === 1 && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-bold">JCI</span>}
                    {h.min_price && <p className="text-xs text-slate-500 whitespace-nowrap">฿{parseFloat(h.min_price).toLocaleString()}</p>}
                  </div>
                </Link>
              ))}
            </div>
          )}
          {packages.length > 0 && (
            <div>
              <p className="px-4 pt-2 pb-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wide">Packages</p>
              {packages.map((p) => (
                <Link key={p.package_id} href={`/${locale}/checkup/${p.category}/${p.hospital_slug}`} onClick={() => setOpen(false)}
                  className="flex items-center justify-between px-4 py-2 hover:bg-slate-50 border-b last:border-0 border-slate-50">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">{p.package_name}</p>
                    <p className="text-xs text-slate-500 truncate">{p.hospital_name}</p>
                  </div>
                  {p.price && <p className="text-xs text-slate-500 whitespace-nowrap ms-2">฿{parseFloat(p.price).toLocaleString()}</p>}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
