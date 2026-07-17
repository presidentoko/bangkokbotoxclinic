// Cross-promotion banner for thaimanufacturehub.com ("Something Bespoke")
// — bespoke Bangkok furniture studio, Korean-minimalist design + Thai
// craftsmanship. No creative asset supplied, so this is a text/CSS banner
// styled to echo that brand's own minimalist aesthetic (neutral tones,
// italic accent word) rather than Thaigle's orange system.
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
          <p className="text-sm text-neutral-500 max-w-md leading-relaxed">
            Custom furniture made in Bangkok — Korean minimalist design, Thai craftsmanship.
            50–70% below comparable luxury brands. No minimum order.
          </p>
        </div>
        <div className="flex items-center justify-center sm:justify-end px-6 pb-6 sm:pb-0 sm:pr-8 shrink-0">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-neutral-900 border-b border-neutral-400 group-hover:border-neutral-900 transition pb-0.5 whitespace-nowrap">
            View the collection
            <span className="group-hover:translate-x-0.5 transition">→</span>
          </span>
        </div>
      </div>
    </a>
  );
}
