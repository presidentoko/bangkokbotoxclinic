import type { Metadata } from "next";
import Link from "next/link";
import { hreflangMap } from "@/lib/i18n";
import { getStatsForHome } from "@/lib/db";

export const revalidate = 86400;

const BASE = "https://www.bangkoktopclinic.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  void locale;
  return {
    title: "About BangkokCheckup — How We Compare Hospital Prices",
    description: "BangkokCheckup scrapes health check-up prices directly from hospital websites in Thailand. No paid rankings, no ads, no middlemen. Learn how our comparison tool works.",
    alternates: {
      canonical: `${BASE}/${locale}/about`,
      languages: hreflangMap(`/about`),
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  let stats = { hospitalCount: 235, packageCount: 2353, jciCount: 9 };
  try {
    stats = await getStatsForHome();
  } catch {
    // use fallback
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <nav className="text-sm text-slate-400 mb-6 flex items-center gap-2">
        <Link href={`/${locale}`} className="hover:text-blue-600">Home</Link>
        <span>›</span>
        <span className="text-slate-600">About</span>
      </nav>

      <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
        About BangkokCheckup
      </h1>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8 text-slate-700 leading-relaxed">
        BangkokCheckup is an independent, ad-free price comparison tool for health check-up packages at hospitals across Thailand.
        We scrape prices directly from hospital websites — no paid placements, no affiliate fees influencing rankings.
      </div>

      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { val: stats.hospitalCount.toString(), label: "Hospitals tracked" },
          { val: stats.packageCount.toLocaleString(), label: "Packages indexed" },
          { val: stats.jciCount.toString(), label: "JCI hospitals" },
        ].map(({ val, label }) => (
          <div key={label} className="bg-white border border-slate-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-700">{val}</p>
            <p className="text-xs text-slate-400 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-8 text-slate-700 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-3">How we collect prices</h2>
          <p>
            Our web scrapers run weekly and pull current prices directly from each hospital&apos;s official health check-up pages.
            We parse the package name, price, and inclusions (blood tests, X-ray, ultrasound, MRI, cancer markers, etc.) and store them in our database.
            No manual entry — prices are machine-read from the source.
          </p>
          <p className="mt-3">
            When a hospital updates its prices on their website, our next scrape run picks up the change. The &quot;last updated&quot; timestamp on each package reflects when our system last confirmed the price was current.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-3">What &quot;No paid rankings&quot; means</h2>
          <p>
            Hospitals cannot pay to appear higher in our comparison tables. The default sort is by price (lowest first). Hospitals cannot pay for badge placement, featured listings, or editorial mentions.
            The JCI badge you see on hospital cards is based on official JCI accreditation data, not a paid feature.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-3">Accuracy disclaimer</h2>
          <p>
            Prices are scraped from public hospital websites and are as accurate as those pages. Hospitals may update prices between our scrape cycles, offer promotions not reflected on their website, or have different pricing for walk-ins vs. bookings.
            <strong> Always confirm the final price directly with the hospital before booking.</strong>
          </p>
          <p className="mt-3">
            Found a price that looks wrong? Use the &quot;⚑ Report&quot; button on any package card or{" "}
            <Link href={`/${locale}/enquiry`} className="text-blue-600 hover:underline">contact us</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-3">Languages</h2>
          <p>
            BangkokCheckup is available in 6 languages: English, Chinese (Simplified), Japanese, Thai, Korean, and Arabic.
            The hospital data (names, prices, package details) is in the language the hospital uses on their website.
            Our UI labels, guides, and FAQs are translated for each language.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-3">Contact</h2>
          <p>
            For booking assistance, personalised package recommendations, or to report incorrect pricing, use our{" "}
            <Link href={`/${locale}/enquiry`} className="text-blue-600 hover:underline">enquiry form</Link>.
          </p>
        </section>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: "About BangkokCheckup",
        url: `${BASE}/${locale}/about`,
        mainEntity: {
          "@type": "Organization",
          name: "BangkokCheckup",
          url: BASE,
          description: "Independent health check-up price comparison for Thailand hospitals. Prices scraped from hospital websites. No paid rankings.",
          foundingDate: "2024",
          knowsAbout: ["Health check-up prices Thailand", "Bangkok hospitals", "Medical tourism Thailand"],
        },
      }) }} />
    </div>
  );
}
