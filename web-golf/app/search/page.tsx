import { loadMasterDb } from "@/lib/data";
import { RestaurantCard } from "@/components/RestaurantCard";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export async function generateMetadata(
  { searchParams }: { searchParams: Promise<{ query?: string; q?: string }> }
): Promise<Metadata> {
  const sp = await searchParams;
  const q = sp.query ?? sp.q ?? "";
  return {
    title: q ? `"${q}" — Golf Course Search` : "Search Golf Courses in Thailand",
    description: `Search Thailand golf courses, driving ranges, and resorts. Find the best courses near ${q || "Bangkok, Phuket, Chiang Mai"}.`,
    robots: { index: false, follow: true },
  };
}

export default async function SearchPage(
  { searchParams }: { searchParams: Promise<{ query?: string; q?: string }> }
) {
  const sp = await searchParams;
  const rawQ = (sp.query ?? sp.q ?? "").trim();
  const q = rawQ.toLowerCase();

  const db = await loadMasterDb();
  const courses = db.restaurants ?? [];

  const results = q.length >= 2
    ? courses.filter((c) =>
        c.name.toLowerCase().includes(q) ||
        (c.district && c.district.toLowerCase().includes(q)) ||
        (c.city_label && c.city_label.toLowerCase().includes(q)) ||
        (c.address && c.address.toLowerCase().includes(q))
      ).slice(0, 60)
    : [];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-sm text-[var(--muted)] mb-6">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>Search</span>
      </nav>

      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          {rawQ ? `Results for "${rawQ}"` : "Search Golf Courses"}
        </h1>
        {results.length > 0 && (
          <p className="text-sm text-[var(--muted)]">{results.length} course{results.length !== 1 ? "s" : ""} found</p>
        )}
      </header>

      <form action="/search" method="get" className="mb-8">
        <div className="flex gap-2 max-w-lg">
          <input
            type="text"
            name="query"
            defaultValue={rawQ}
            placeholder="Course name, district, or city..."
            className="flex-1 border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            autoFocus
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-emerald-700 text-white text-sm font-bold rounded-xl hover:bg-emerald-800 transition"
          >
            Search
          </button>
        </div>
      </form>

      {rawQ.length >= 2 && results.length === 0 && (
        <div className="p-8 text-center border border-[var(--border)] rounded-2xl text-[var(--muted)]">
          <p className="font-medium mb-1">No results for &ldquo;{rawQ}&rdquo;</p>
          <p className="text-sm">Try a shorter search term, course name, or district.</p>
        </div>
      )}

      {results.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((c) => (
            <RestaurantCard key={c.id} r={c} />
          ))}
        </div>
      )}

      {!rawQ && (
        <div className="text-[var(--muted)] text-sm space-y-2">
          <p>Search across 639 golf courses, driving ranges, and resorts in Thailand.</p>
          <p>Try: <a href="/search?query=Bangkok" className="underline hover:text-[var(--fg)]">Bangkok</a> · <a href="/search?query=Phuket" className="underline hover:text-[var(--fg)]">Phuket</a> · <a href="/search?query=Alpine" className="underline hover:text-[var(--fg)]">Alpine</a></p>
        </div>
      )}

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Search", url: "/search" },
      ]} />
    </div>
  );
}
