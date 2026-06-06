// Sister-site footer strip — SEO cross-link + user discovery.
// Hair site links out to botox + dental. They link back via their own copy.
// "rel=me" tells Google these are run by the same entity.

export default function SisterSites() {
  return (
    <section className="border-t mt-12" style={{ borderColor: "rgb(var(--border))" }}>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="text-[10px] font-black uppercase tracking-widest text-[rgb(var(--muted))] text-center mb-3">
          Our sister sites · Thai Facial Clinic Group
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <a
            href="https://www.bangkokbotoxclinic.com/"
            target="_blank"
            rel="noopener noreferrer me"
            className="flex items-center gap-3 rounded-xl border bg-[rgb(var(--bg-elev))] p-4 hover:border-navy-700 transition"
            style={{ borderColor: "rgb(var(--border))" }}
          >
            <span className="text-2xl shrink-0">💉</span>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-sm">Bangkok Botox Clinic</div>
              <div className="text-xs text-[rgb(var(--muted))]">Botox · filler · HIFU directory</div>
            </div>
            <span className="text-[rgb(var(--muted))]">→</span>
          </a>
          <a
            href="https://www.bangkokbestclinic.com/"
            target="_blank"
            rel="noopener noreferrer me"
            className="flex items-center gap-3 rounded-xl border bg-[rgb(var(--bg-elev))] p-4 hover:border-navy-700 transition"
            style={{ borderColor: "rgb(var(--border))" }}
          >
            <span className="text-2xl shrink-0">🦷</span>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-sm">Bangkok Best Clinic</div>
              <div className="text-xs text-[rgb(var(--muted))]">Dental · implants · veneers directory</div>
            </div>
            <span className="text-[rgb(var(--muted))]">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
