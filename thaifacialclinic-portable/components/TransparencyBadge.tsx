// Editorial integrity pledges. Builds long-term trust.
import type { Lang } from "@/lib/types";

export default function TransparencyBadge({ lang }: { lang: Lang }) {
  const pledges = [
    { emoji: "🛡", title: "We never delete negative reviews",  body: "Even from paying partners. They earn rank, never edit content." },
    { emoji: "📊", title: "Trust Score is a public formula",   body: "Audit at any time. We publish the methodology." },
    { emoji: "💰", title: "Sponsored slots are clearly marked",  body: "Paid placement is visible — not buried in fake organic." },
    { emoji: "🚫", title: "No 'reputation management' upsells", body: "We don't help clinics hide problems. We surface them." },
  ];
  return (
    <section className="rounded-2xl border-2 border-slate-300 bg-white p-5 sm:p-6">
      <div className="mb-4">
        <div className="text-xs font-black uppercase tracking-widest text-slate-700">Editorial integrity</div>
        <h3 className="text-lg sm:text-xl font-black tracking-tight mt-1">Pledges we keep</h3>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2">
        {pledges.map((p, i) => (
          <li key={i} className="flex items-start gap-3 rounded-xl bg-slate-50 border border-slate-200 p-3">
            <span className="text-2xl shrink-0">{p.emoji}</span>
            <div>
              <div className="font-black text-sm">{p.title}</div>
              <p className="text-xs text-[rgb(var(--muted))] mt-1 leading-relaxed">{p.body}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="text-[11px] text-[rgb(var(--muted))] mt-3 leading-relaxed">
        {/* 언어 프리픽스 없이 "/about"만 있어서 trailingSlash:true 사이트에서
            308→404 체인이었음 (2026-07-31 감사, 이전 감사 때 못 잡힘 —
            컴포넌트가 안 받던 lang prop을 새로 추가). */}
        Reading our <a href={`/${lang}/about/`} className="underline font-bold">methodology</a> takes 2 minutes. Worth it before any booking.
      </p>
    </section>
  );
}
