import type { Locale } from "@/lib/i18n";

/**
 * Visible rendering of the same {q, a} array that feeds a page's FAQPage
 * JSON-LD.
 *
 * Shared on purpose. The brand pages emitted `brandFaqLd` for 275 URLs while
 * showing none of those questions on the page — structured data describing
 * content that did not exist. Routing both the markup and the schema through
 * one array makes that class of mismatch impossible to reintroduce silently.
 */
export function FaqSection({
  faqs,
  locale,
  heading,
}: {
  faqs: { q: string; a: string }[];
  locale: Locale;
  heading?: string;
}) {
  if (faqs.length === 0) return null;
  return (
    <section className="space-y-3">
      <h2 className="font-serif-display text-lg font-semibold text-neutral-800">
        {heading ?? (locale === "th" ? "คำถามที่พบบ่อย" : "Frequently asked")}
      </h2>
      <div className="rounded-2xl border border-[#efe1db] bg-white shadow-sm shadow-rose-100 divide-y divide-[#f5ebe7]">
        {faqs.map((f) => (
          <details key={f.q} className="group px-5 py-4">
            <summary className="cursor-pointer list-none text-sm font-semibold text-neutral-900 flex items-start gap-2">
              <span
                aria-hidden="true"
                className="text-rose-400 transition-transform group-open:rotate-90"
              >
                ›
              </span>
              <span>{f.q}</span>
            </summary>
            <p className="mt-2 pl-5 text-sm text-neutral-600 leading-relaxed">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
