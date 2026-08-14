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
  // 2026-07-31 감사: 이 파일이 web/(다른 프로젝트)에서 그대로 포팅되면서
  // "facial" 같은 저 사이트 전용 SiteFocus 값이 v로 남아있었음. 이
  // 사이트(thaifacialclinic.com)는 SiteFocus 대신 fue/dhi/fut/prp/smp/
  // eyebrow/beard/scalp-care 같은 실제 procedure 슬러그를 쓰는데 매칭이 안 돼
  // /c/facial(존재 안 함)로 링크돼 모든 클리닉 페이지에서 항상 404였음.
  // 이 컴포넌트는 focus="hair"로만 호출되므로(clinic/[slug]/page.tsx:424)
  // 실제 이 사이트 procedure 슬러그로 교체.
  hair: [
    { v: "prp" as SiteFocus, emoji: "💉", label: "PRP", tagline: "Non-surgical regrowth boost" },
    { v: "smp" as SiteFocus, emoji: "🖊️", label: "SMP", tagline: "Instant density, no surgery" },
    { v: "eyebrow" as SiteFocus, emoji: "✨", label: "Eyebrow", tagline: "Same FUE technique, for brows" },
  ],
};

// 2026-08-14 감사: href 가 `/c/${v}` 로 언어 프리픽스 없이 나가 /c/prp·/c/smp·
// /c/eyebrow 전부 404 였다 (실제 라우트는 /{lang}/c/*). 7-31 에 슬러그는 고쳤지만
// 프리픽스를 놓친 것. lang 을 받아 `/${lang}/c/${v}/` 로 낸다 (trailingSlash:true).
export default function AlternativeProcedures({ focus, lang = "en" }: { focus: SiteFocus; lang?: string }) {
  const items = CROSS[focus];
  if (!items || items.length === 0) return null;

  return (
    <section className="rounded-2xl border bg-white p-5" style={{ borderColor: "rgb(var(--border))" }}>
      <div className="mb-3">
        <div className="text-xs font-black uppercase tracking-widest text-[rgb(var(--muted))]">Also explore</div>
        <h3 className="text-base font-black mt-0.5">Pair well with what you&apos;re considering</h3>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        {items.map((it) => (
          <a key={it.v} href={`/${lang}/c/${it.v}/`}
            className="flex items-center gap-3 rounded-xl border bg-slate-50 hover:bg-white hover:border-slate-400 p-3 transition"
            style={{ borderColor: "rgb(var(--border))" }}>
            <span className="text-3xl shrink-0">{it.emoji}</span>
            <div className="min-w-0 flex-1">
              <div className="font-black text-sm">{it.label}</div>
              <div className="text-[11px] text-[rgb(var(--muted))]">{it.tagline}</div>
            </div>
            <span className="text-[rgb(var(--muted))]">→</span>
          </a>
        ))}
      </div>
    </section>
  );
}
