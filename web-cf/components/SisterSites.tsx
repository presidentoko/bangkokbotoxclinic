// Sister-site footer strip — focus-aware. botox sees dental+hair links, dental sees botox+hair, etc.

import type { SiteFocus } from "@/lib/site";

const SISTERS: Record<SiteFocus, { url: string; emoji: string; label: string; sub: string }> = {
  botox:  { url: "https://www.bangkokbotoxclinic.com/", emoji: "💉", label: "Bangkok Botox Clinic",  sub: "Botox · filler · HIFU directory" },
  filler: { url: "https://www.bangkokfillers.com/",     emoji: "💋", label: "Bangkok Fillers",        sub: "HA filler specialists" },
  hifu:   { url: "https://www.haifacialclinic.com/",     emoji: "⚡", label: "HIFU Bangkok",           sub: "Ulthera / Thermage" },
  facial: { url: "https://www.bangkokfacial.com/",       emoji: "✨", label: "Bangkok Facial",         sub: "HydraFacial · LED" },
  laser:  { url: "https://www.bangkoklaserclinic.com/",  emoji: "🔬", label: "Bangkok Laser Clinic",   sub: "Pico · CO2 · IPL" },
  dental: { url: "https://www.bangkokbestclinic.com/",   emoji: "🦷", label: "Bangkok Best Clinic",    sub: "Dental · implants" },
  hair:   { url: "https://thaifacialclinic.com/",        emoji: "💇", label: "Hair by TFC",            sub: "Hair transplant directory" },
  all:    { url: "https://bkkclinics.com/",              emoji: "🏥", label: "Bangkok Clinics",        sub: "All-clinic hub" },
};

export default function SisterSites({ focus }: { focus: SiteFocus }) {
  const sisters = (Object.keys(SISTERS) as SiteFocus[]).filter((k) => k !== focus && k !== "all").map((k) => SISTERS[k]);
  // Top picks: in this 3-site reality, show botox + dental + hair (not the placeholder ones)
  const live = sisters.filter((s) => ["bangkokbotoxclinic", "bangkokbestclinic", "thaifacialclinic"].some((d) => s.url.includes(d)));

  if (live.length === 0) return null;

  return (
    <section className="border-t mt-12" style={{ borderColor: "var(--border)" }}>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)] text-center mb-3">
          Our sister sites · Thai Facial Clinic Group
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {live.map((s) => (
            <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer me"
              className="flex items-center gap-3 rounded-xl border bg-white p-4 hover:border-black transition"
              style={{ borderColor: "var(--border)" }}>
              <span className="text-2xl shrink-0">{s.emoji}</span>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-sm">{s.label}</div>
                <div className="text-xs text-[var(--muted)]">{s.sub}</div>
              </div>
              <span className="text-[var(--muted)]">→</span>
            </a>
          ))}
          <a href="https://www.bangkoktopclinic.com/?ref=sister" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl border p-4 hover:border-black transition"
            style={{ borderColor: "var(--border)", background: "linear-gradient(105deg,#f0f9ff,#fff)" }}>
            <span className="text-2xl shrink-0">🏥</span>
            <div className="min-w-0 flex-1">
              <div className="font-bold text-sm">BangkokTopClinic</div>
              <div className="text-xs text-[var(--muted)]">Clinic owner? Free dashboard →</div>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
