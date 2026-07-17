// Cross-promotion banner for thaimanufacturehub.com ("Something Bespoke").
// Copy reflects the turnkey design-build pivot (see
// 2026-07-17-interior-turnkey-pivot-design.md §2.1/§4) rather than the
// furniture-only positioning — headline is the plan's own target English
// tagline. Deliberately omits the old "50–70% below luxury brands" /
// customer-list claims: the plan flags those as needing re-verification
// and de-duplication against sister sites (Space K, Maison Lux) before
// reuse (§2.2, §10). CTA points at the bare domain (no /turnkey/ or
// /pricing subpages yet — those ship in Phase 2) with "Get a quote" so it
// doesn't promise a page structure that doesn't exist live yet.
export function BespokeBanner() {
  return (
    <a
      href="https://thaimanufacturehub.com/"
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="group block my-12 rounded-2xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 hover:border-neutral-300 transition overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row items-stretch">
        <div className="flex-1 px-6 py-6 sm:py-8">
          <div className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-2">
            Sponsored · Bangkok
          </div>
          <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-neutral-900 mb-1">
            Something <span className="italic">Bespoke</span>
          </h3>
          <p className="text-sm text-neutral-600 font-medium mb-1.5">
            Design · Build · Furniture — One Team, Published Prices
          </p>
          <p className="text-sm text-neutral-500 max-w-md leading-relaxed">
            Bangkok&apos;s Korean-designer turnkey studio — design, construction and custom furniture
            from one team, one contract. Per-sqm pricing published up front.
          </p>
        </div>
        <div className="flex items-center justify-center sm:justify-end px-6 pb-6 sm:pb-0 sm:pr-8 shrink-0">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-neutral-900 border-b border-neutral-400 group-hover:border-neutral-900 transition pb-0.5 whitespace-nowrap">
            Get a quote
            <span className="group-hover:translate-x-0.5 transition">→</span>
          </span>
        </div>
      </div>
    </a>
  );
}
