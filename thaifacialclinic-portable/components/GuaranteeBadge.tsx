// Focus-aware warranty/guarantee stamp.

import type { SiteFocus } from "@/lib/site";

const TEXT: Partial<Record<SiteFocus, { title: string; body: string }>> = {
  botox:  { title: "Touch-up included",         body: "Free top-up at 2-week check if results uneven. Standard among Bangkok partners." },
  filler: { title: "Dissolve safety net",       body: "If you dislike result, certified clinics dissolve HA filler with hyaluronidase free of charge." },
  hifu:   { title: "Re-treat if no response",   body: "Some partners offer a free single repeat session if &lt; 50% response after 3 months." },
  facial: { title: "Satisfaction guarantee",    body: "First-session satisfaction policy at most HydraFacial certified clinics." },
  laser:  { title: "Touch-up policy",           body: "Most clinics include 1 free touch-up session if expected zones aren't covered." },
  dental: { title: "Implant lifetime warranty", body: "Most Bangkok implant clinics provide 5–10 year written warranty on the implant post. Crown: 5yr typical." },
  hair:   { title: "Graft survival guarantee",  body: "Top partners guarantee &gt; 85% graft survival. If lower at 12 months, free supplemental session." },
};

export default function GuaranteeBadge({ focus }: { focus: SiteFocus }) {
  const t = TEXT[focus];
  if (!t) return null;
  return (
    <section className="rounded-2xl border-2 border-amber-300 bg-gradient-to-br from-amber-50 to-yellow-50 p-5 flex items-start gap-3">
      <span className="text-4xl shrink-0">🏆</span>
      <div>
        <div className="text-xs font-black uppercase tracking-widest text-amber-700">Verified guarantee</div>
        <div className="font-black text-base mt-0.5">{t.title}</div>
        <p className="text-xs text-amber-900 mt-1.5 leading-relaxed" dangerouslySetInnerHTML={{ __html: t.body }} />
      </div>
    </section>
  );
}
