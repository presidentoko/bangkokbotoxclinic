import Link from "next/link";
import { t, concernLabel, type Locale } from "@/lib/i18n";
import { getRanking } from "@/lib/data";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = (await params).locale as Locale;
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">{t(locale, "site_name")}</h1>
      <p className="text-gray-600">{t(locale, "tagline")}</p>
      <div className="grid grid-cols-2 gap-4">
        {(["acne", "whitening"] as const).map((c) => (
          <Link
            key={c}
            href={`/${locale}/${c}`}
            className="rounded border p-6 hover:bg-gray-50"
          >
            <div className="text-lg font-semibold">{concernLabel(locale, c)}</div>
            <div className="text-sm text-gray-500">
              {getRanking(c).length} {t(locale, "product")}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
