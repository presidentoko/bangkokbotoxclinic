import type { Metadata } from "next";
import Link from "next/link";
import { type Locale, catLabel, CATEGORIES } from "@/lib/i18n";
import { getPackagesByCategory, type PackageRow } from "@/lib/db";
// PackageRow used for type annotation below

export const revalidate = 86400;

export function generateStaticParams() {
  return CATEGORIES.map((type) => ({ type }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; type: string }>;
}): Promise<Metadata> {
  const { locale, type } = await params;
  const label = catLabel(locale as Locale, type);
  return {
    title: `${label} Health Check-Up Bangkok — Compare Prices`,
    description: `Compare ${label.toLowerCase()} health check-up packages across Bangkok hospitals. Real prices, JCI-accredited, MRI/CT included.`,
  };
}

function Flag({ val }: { val: number | null }) {
  if (val === 1) return <span className="text-emerald-600">✓</span>;
  if (val === 0) return <span className="text-slate-300">✗</span>;
  return <span className="text-amber-400">?</span>;
}

export default async function CheckupTypePage({
  params,
}: {
  params: Promise<{ locale: string; type: string }>;
}) {
  const { locale, type } = await params;
  const loc = locale as Locale;

  const rows: PackageRow[] = [];
  try {
    const fetched = await getPackagesByCategory(type, "price");
    rows.push(...fetched);
  } catch {
    // DB not ready
  }

  const label = catLabel(loc, type);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <nav className="text-sm text-slate-400 mb-4 flex items-center gap-2">
        <Link href={`/${locale}`} className="hover:text-blue-600">Home</Link>
        <span>›</span>
        <span className="text-slate-600">{label} check-up</span>
      </nav>

      <h1 className="text-2xl font-bold text-slate-900 mb-1">{label} Health Check-Up Bangkok</h1>
      <p className="text-slate-500 mb-6">Sorted by price · {rows.length} package{rows.length !== 1 ? "s" : ""}</p>

      <div className="mb-6">
        <Link
          href={`/${locale}/compare?category=${type}`}
          className="inline-block bg-blue-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-colors"
        >
          Compare all in a table →
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="text-slate-400">No packages found for this category yet.</p>
      ) : (
        <div className="space-y-4">
          {rows.map((row) => {
            const price = row.price ? `฿${parseFloat(row.price).toLocaleString()}` : "TBC";
            const bookUrl = row.source_url || row.checkup_url || "#";
            return (
              <div key={row.package_id} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div>
                    <Link
                      href={`/${locale}/hospital/${row.hospital_slug}`}
                      className="font-bold text-slate-800 hover:text-blue-700"
                    >
                      {row.hospital_name}
                    </Link>
                    {row.jci === 1 && (
                      <span className="ml-2 bg-blue-100 text-blue-800 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">JCI</span>
                    )}
                    {row.area && <p className="text-sm text-slate-500 mt-0.5">📍 {row.area}</p>}
                    <p className="text-slate-700 mt-1">{row.package_name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-blue-700">{price}</p>
                    {row.rating && (
                      <p className="text-sm text-amber-500">★ {parseFloat(row.rating).toFixed(1)}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 mt-3">
                  <span><Flag val={row.has_blood} /> Blood</span>
                  <span><Flag val={row.has_ultrasound} /> Ultrasound</span>
                  <span><Flag val={row.has_ct} /> CT</span>
                  <span><Flag val={row.has_mri} /> MRI</span>
                  <span><Flag val={row.has_cancer_marker} /> Cancer markers</span>
                  <span><Flag val={row.has_doctor_consult} /> Doctor</span>
                  <span><Flag val={row.has_interpreter} /> Interpreter</span>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <a
                    href={`/api/track?pkg=${row.package_id}&url=${encodeURIComponent(bookUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Book / Enquire
                  </a>
                  <Link
                    href={`/${locale}/checkup/${type}/${row.hospital_slug}`}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Full details →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
