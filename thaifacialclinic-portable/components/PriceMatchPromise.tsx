// Trust badge — "we'll match any verified clinic's price for the same procedure".
// Pure presentational, reduces anxiety on detail page.

export default function PriceMatchPromise() {
  return (
    <section className="rounded-2xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50 p-5 sm:p-6">
      <div className="flex items-start gap-4">
        <span className="text-3xl shrink-0">🛡️</span>
        <div className="flex-1">
          <div className="text-xs font-black uppercase tracking-widest text-emerald-700 mb-1">Price-match promise</div>
          <h3 className="text-lg font-black mb-1.5">Found a lower verified price elsewhere?</h3>
          <p className="text-sm leading-relaxed text-[rgb(var(--muted))] mb-3">
            Send us a written quote from any Thailand clinic for the same procedure and credentials.
            If it&apos;s lower, we&apos;ll work with our partner to match it — or recommend the alternative honestly.
          </p>
          <ul className="text-xs space-y-1.5 mb-3">
            <li className="flex gap-2"><span>✓</span><span>Quote must be from a clinic with similar Trust Score (within 10pts)</span></li>
            <li className="flex gap-2"><span>✓</span><span>Same procedure + same doctor seniority</span></li>
            <li className="flex gap-2"><span>✓</span><span>Quote must be written (PDF, email, photo) — not just verbal</span></li>
          </ul>
          <a href="mailto:hello@bkkclinics.com?subject=Price-match request"
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 text-white px-4 py-2 text-sm font-black hover:bg-emerald-700">
            Submit a quote →
          </a>
        </div>
      </div>
    </section>
  );
}
