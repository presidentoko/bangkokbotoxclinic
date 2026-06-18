import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found — Thai Supply Hub",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="text-5xl font-bold mb-4 text-[var(--muted)]">404</div>
      <h1 className="text-2xl font-bold mb-3">Page not found</h1>
      <p className="text-[var(--muted)] mb-8">
        This supplier listing may have moved or been removed from our directory.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <a href="/" className="px-5 py-2.5 rounded-lg bg-emerald-700 text-white font-bold hover:bg-emerald-800">
          Browse all suppliers
        </a>
        <a href="/c/manufacturer" className="px-5 py-2.5 rounded-lg border border-[var(--border)] font-medium hover:bg-gray-50">
          Manufacturers
        </a>
        <a href="/c/auto_parts" className="px-5 py-2.5 rounded-lg border border-[var(--border)] font-medium hover:bg-gray-50">
          Auto Parts
        </a>
        <a href="/c/plastic" className="px-5 py-2.5 rounded-lg border border-[var(--border)] font-medium hover:bg-gray-50">
          Plastic &amp; Injection Molding
        </a>
      </div>
    </div>
  );
}
