// Inline accordion of FAQs. Pure HTML <details>/<summary> for SEO + a11y win.
// Pass faqs from clinic-faq lib or build from HOME_FAQS.

export type FaqItem = { q: string; a: string };

export default function FAQAccordion({
  faqs,
  title = "Common questions",
}: {
  faqs: FaqItem[];
  title?: string;
}) {
  if (!faqs || faqs.length === 0) return null;
  return (
    <section className="rounded-2xl border bg-white p-5 sm:p-6" style={{ borderColor: "rgb(var(--border))" }}>
      <h3 className="text-lg sm:text-xl font-black tracking-tight mb-4">{title}</h3>
      <div className="space-y-2">
        {faqs.map((f, i) => (
          <details key={i} className="group rounded-xl border bg-slate-50 px-4 py-3" style={{ borderColor: "rgb(var(--border))" }}>
            <summary className="cursor-pointer font-bold text-sm flex items-center justify-between gap-3 list-none">
              <span>{f.q}</span>
              <span className="text-[rgb(var(--muted))] group-open:rotate-180 transition shrink-0">⌄</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-[rgb(var(--muted))]">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
