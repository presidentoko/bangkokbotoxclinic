import Link from "next/link";

/**
 * What this page is not.
 *
 * A site that publishes medical prices and screening guides under no named
 * author, with no clinician reviewing it, is exactly the profile Google's
 * health quality standards exist to catch. Saying plainly that the site is a
 * price and directory reference rather than medical advice is not a
 * disclaimer in the legal sense — it is correct self-classification, and it is
 * the one quality signal available to a site that genuinely has no clinical
 * staff. Claiming a medical reviewer we do not have would be the same error as
 * the two dozen hospital names in the guides that turned out not to exist.
 */
export function NotMedicalAdvice({ locale }: { locale: string }) {
  return (
    <aside className="mt-10 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
      <p>
        <strong className="text-slate-800">What this page is.</strong> A price and directory
        reference, compiled from published hospital listings and Thailand&apos;s official hospital
        register. It does not recommend a test, interpret a result, or advise whether a check-up is
        right for you — ask a doctor those. No clinician reviews this site and nothing on it is paid
        for.{" "}
        <Link href={`/${locale}/editorial`} className="text-blue-700 hover:underline">
          How the data is collected
        </Link>
      </p>
    </aside>
  );
}
