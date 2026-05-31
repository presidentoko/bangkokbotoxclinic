// Cross-sell strip — "Considering X? Also see Y, Z" focus-aware.

import type { SiteFocus } from "@/lib/site";

const CROSS: Partial<Record<SiteFocus, { v: SiteFocus; emoji: string; label: string; tagline: string }[]>> = {
  botox: [
    { v: "filler", emoji: "💋", label: "Filler",  tagline: "Volume where botox can't reach" },
    { v: "hifu",   emoji: "⚡", label: "HIFU",     tagline: "Tighten skin without injection" },
    { v: "laser",  emoji: "🔬", label: "Pico laser", tagline: "Brighten pigment + acne scars" },
  ],
  filler: [
    { v: "botox", emoji: "💉", label: "Botox",   tagline: "Smooth dynamic wrinkles" },
    { v: "hifu",  emoji: "⚡", label: "HIFU",    tagline: "Lift skin without volume change" },
    { v: "facial", emoji: "✨", label: "HydraFacial", tagline: "Maintain skin between visits" },
  ],
  hifu: [
    { v: "laser",  emoji: "🔬", label: "Pico laser", tagline: "Brightens pigment HIFU can't" },
    { v: "filler", emoji: "💋", label: "Filler",     tagline: "Add volume HIFU just lifts" },
    { v: "botox",  emoji: "💉", label: "Botox",      tagline: "For dynamic wrinkles" },
  ],
  facial: [
    { v: "laser",  emoji: "🔬", label: "Laser",       tagline: "For deeper pigment/scarring" },
    { v: "hifu",   emoji: "⚡", label: "HIFU",        tagline: "Add skin tightening" },
  ],
  laser: [
    { v: "facial", emoji: "✨", label: "HydraFacial", tagline: "Maintenance between sessions" },
    { v: "hifu",   emoji: "⚡", label: "HIFU",        tagline: "Add skin tightening" },
  ],
  dental: [
    { v: "facial", emoji: "✨", label: "Facial",      tagline: "Combine smile + skin trip" },
  ],
  hair: [
    { v: "facial", emoji: "✨", label: "HydraFacial", tagline: "Recovery-day spa session" },
  ],
};

export default function AlternativeProcedures({ focus }: { focus: SiteFocus }) {
  const items = CROSS[focus];
  if (!items || items.length === 0) return null;

  return (
    <section className="rounded-2xl border bg-white p-5" style={{ borderColor: "var(--border)" }}>
      <div className="mb-3">
        <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">Also explore</div>
        <h3 className="text-base font-black mt-0.5">Pair well with what you&apos;re considering</h3>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {items.map((it) => (
          <a key={it.v} href={`/c/${it.v}`}
            className="flex items-center gap-3 rounded-xl border bg-slate-50 hover:bg-white hover:border-slate-400 p-3 transition"
            style={{ borderColor: "var(--border)" }}>
            <span className="text-3xl shrink-0">{it.emoji}</span>
            <div className="min-w-0 flex-1">
              <div className="font-black text-sm">{it.label}</div>
              <div className="text-[11px] text-[var(--muted)]">{it.tagline}</div>
            </div>
            <span className="text-[var(--muted)]">→</span>
          </a>
        ))}
      </div>
    </section>
  );
}
