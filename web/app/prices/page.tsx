import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSiteConfig } from "@/lib/site";
import { GUIDES, PRICE_GUIDE_FOCUS, guideData, groupUnit, baht } from "@/lib/aestheticPriceGuide";

export const metadata: Metadata = {
  title: "Bangkok Botox, Filler & HIFU Price Guides",
  description: "What Bangkok clinics list for Botox, fillers and HIFU, compared from package prices they published on HDmall.",
  alternates: { canonical: "/prices" },
};

export default function PricesIndex() {
  if (!PRICE_GUIDE_FOCUS.has(getSiteConfig().focus)) notFound();
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Bangkok Botox, filler and HIFU price guides</h1>
      <p className="text-[var(--muted)] mb-8 max-w-2xl">
        List prices that Bangkok clinics published on HDmall, grouped so you can compare like with like. Each guide says where its prices come from and when they were collected.
      </p>
      <ul className="grid gap-4 sm:grid-cols-3">
        {GUIDES.map((g) => {
          const { proc, headline } = guideData(g);
          return (
            <li key={g.slug}>
              <a href={`/prices/${g.slug}`} className="block h-full rounded-xl border border-[var(--border)] bg-white p-4 hover:border-[var(--accent)] transition">
                <div className="font-bold mb-1">{g.title}</div>
                <div className="text-xs text-[var(--muted)] mb-3">{proc.n_packages} listings · {proc.n_clinics} clinics · HDmall</div>
                {headline && headline.median != null && (
                  <div className="text-sm tabular-nums">
                    {headline.group}: typical {baht(headline.median)}{groupUnit(headline)}
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
