import { loadMasterDb } from "@/lib/data";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Industrial Estates in Thailand — Verified Tenants",
  description:
    "All Thai industrial estates with B2B tenants we've mapped — Amata, WHA, Pinthong, Rojana, Nava Nakorn, Bang Plee, and more. Capital, registered date, and TSIC industry codes per tenant.",
  alternates: { canonical: "/estate" },
};

export default async function EstateIndexPage() {
  const db = await loadMasterDb();

  type EstateEntry = {
    slug: string;
    name: string;
    totalCount: number;
    verifiedCount: number;
    sampleTenants: { name: string; id: string }[];
    photo: string | null;
  };
  const map = new Map<string, EstateEntry>();
  for (const s of db.suppliers) {
    if (!s.estate_slug || !s.estate_name) continue;
    let e = map.get(s.estate_slug);
    if (!e) {
      e = { slug: s.estate_slug, name: s.estate_name, totalCount: 0, verifiedCount: 0, sampleTenants: [], photo: null };
      map.set(s.estate_slug, e);
    }
    e.totalCount++;
    if (s.verified) e.verifiedCount++;
    if (e.sampleTenants.length < 3) e.sampleTenants.push({ name: s.name, id: s.id });
    if (!e.photo && s.hero_image) e.photo = s.hero_image;
  }
  const estates = Array.from(map.values())
    .sort((a, b) => b.totalCount - a.totalCount);

  return (
    <article className="max-w-6xl mx-auto px-4 py-8 bg-white">
      <nav className="text-sm text-stone-500 mb-4" aria-label="Breadcrumb">
        <a href="/" className="hover:text-stone-900">Home</a>
        <span className="mx-2">›</span>
        <span className="text-stone-900 font-medium">Industrial Estates</span>
      </nav>

      <header className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider mb-3">
          🏘 {estates.length} estates mapped
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">Industrial estates in Thailand</h1>
        <p className="text-base md:text-lg text-stone-600 max-w-3xl">
          Thailand&apos;s industrial estates operate under the Industrial Estate Authority of Thailand (IEAT) and host export-
          oriented manufacturers — typically with tax incentives, customs facilities, and pre-vetted infrastructure. We&apos;ve
          mapped the tenants we&apos;ve identified in each estate, with DBD-verified business records where available.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {estates.map((e) => (
          <a key={e.slug} href={`/estate/${e.slug}`}
             className="group block bg-white border border-stone-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-emerald-300 hover:-translate-y-0.5 transition">
            {e.photo && (
              <div className="relative w-full bg-stone-100 overflow-hidden" style={{ aspectRatio: "16/9" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={e.photo} alt={e.name} loading="lazy" referrerPolicy="no-referrer"
                     className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                  <div className="text-white font-bold text-lg leading-tight">{e.name}</div>
                </div>
              </div>
            )}
            <div className="p-5">
              {!e.photo && (
                <h2 className="font-bold text-lg text-stone-900 group-hover:text-emerald-700 leading-tight mb-1">{e.name}</h2>
              )}
              <div className="text-xs text-stone-600 flex items-center gap-2 mb-3 flex-wrap">
                <span className="font-bold text-stone-900">{e.totalCount} tenant{e.totalCount === 1 ? "" : "s"}</span>
                {e.verifiedCount > 0 && (
                  <>
                    <span>·</span>
                    <span className="text-emerald-700 font-bold">✓ {e.verifiedCount} DBD-verified</span>
                  </>
                )}
              </div>
              <ul className="text-xs text-stone-600 space-y-0.5 list-disc list-inside">
                {e.sampleTenants.map((t) => (
                  <li key={t.id} className="line-clamp-1">{t.name}</li>
                ))}
              </ul>
            </div>
          </a>
        ))}
      </div>

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Industrial Estates", url: "/estate" },
      ]} />
      <CollectionPageJsonLd
        name="Industrial estates in Thailand"
        description={`${estates.length} Thai industrial estates with mapped B2B tenants.`}
        url="/estate"
        numberOfItems={estates.length}
      />
    </article>
  );
}
