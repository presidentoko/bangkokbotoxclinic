import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSiteConfig } from "@/lib/site";
import { GUIDES, guideData, sourceLabel, baht } from "@/lib/dentalPriceGuide";

export const metadata: Metadata = {
  title: "Bangkok Dental Price Guides: Implants, Veneers, Whitening, Invisalign",
  description: "What Bangkok dental clinics list for implants, veneers, teeth whitening and Invisalign, compared from published prices.",
  alternates: { canonical: "/prices" },
};

export default function PricesIndex() {
  if (getSiteConfig().focus !== "dental") notFound();
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Bangkok dental price guides</h1>
      <p className="text-[var(--muted)] mb-8 max-w-2xl">
        List prices that Bangkok dental clinics published on HDmall or on their own websites, grouped so you can compare like with like. Each guide says where its prices come from and when they were collected.
      </p>
      <ul className="grid gap-4 sm:grid-cols-2">
        {GUIDES.map((g) => {
          const { proc, headline } = guideData(g);
          return (
            <li key={g.slug}>
              <a href={`/prices/${g.slug}`} className="block h-full rounded-xl border border-[var(--border)] bg-white p-4 hover:border-[var(--accent)] transition">
                <div className="font-bold mb-1">{g.title}</div>
                <div className="text-xs text-[var(--muted)] mb-3">{proc.n_packages} listings · {proc.n_clinics} clinics · {sourceLabel(proc)}</div>
                {headline && (
                  <div className="text-sm tabular-nums">
                    {headline.group}{headline.sub ? ` · ${headline.sub}` : ""}: {baht(headline.min)}–{baht(headline.max)}
                  </div>
                )}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
