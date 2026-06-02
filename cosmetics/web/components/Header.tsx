import Link from "next/link";
import { t, concernLabel, type Locale } from "@/lib/i18n";
export function Header({ locale }: { locale: Locale }) {
  const other = locale === "th" ? "en" : "th";
  return (
    <header className="border-b">
      <nav className="mx-auto max-w-5xl flex items-center gap-4 p-4 text-sm">
        <Link href={`/${locale}`} className="font-bold">{t(locale, "site_name")}</Link>
        <Link href={`/${locale}/acne`}>{concernLabel(locale, "acne")}</Link>
        <Link href={`/${locale}/whitening`}>{concernLabel(locale, "whitening")}</Link>
        <Link href={`/${locale}/methodology`} className="ml-auto">{t(locale, "methodology")}</Link>
        <Link href={`/${other}`} className="uppercase">{other}</Link>
      </nav>
    </header>
  );
}
