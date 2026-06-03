// RealSelf-style Q&A community feed. Seed questions per focus.
// Doctor-style replies are clearly labeled "Editorial answer".

import type { SiteFocus } from "@/lib/site";

type Q = { q: string; askedBy: string; ago: string; a: string };

const SEED_Q: Partial<Record<SiteFocus, Q[]>> = {
  botox: [
    { q: "How many units do I really need for forehead + 11s?", askedBy: "Nadine, 34", ago: "2 days ago",
      a: "Most patients need 20–25 units total for forehead lines (typically 8–12 units) plus glabellar 11s (10–15 units). Lower if you have light wrinkles, higher if deep static lines. Always ask the doctor to under-dose on the first visit." },
    { q: "Is Korean botox (Botulax, Nabota) safe?", askedBy: "Min-jun", ago: "6 days ago",
      a: "Korean botulinum toxin brands are approved by KFDA and used in tens of millions of cosmetic procedures globally. They generally onset slightly faster and cost less than Allergan. The trade-off is shorter studied longevity data outside Korea." },
    { q: "How long until I see results?", askedBy: "Anon",  ago: "1 week ago",
      a: "Botox onset is 3–5 days. Full effect at 14 days. Don't judge results until 2 weeks. Most patients re-treat every 3–4 months." },
  ],
  filler: [
    { q: "Why do my lips look swollen for a week?", askedBy: "Em, 28", ago: "3 days ago",
      a: "Lip filler swelling peaks 48 hours after injection and drops dramatically by day 4. By day 7 you should see your true result. Ice for 10 minutes per hour the first day reduces swelling significantly." },
    { q: "Can I fly right after fillers?", askedBy: "Sara", ago: "5 days ago",
      a: "Most clinics recommend waiting 24–48 hours before flying. Cabin pressure can increase swelling. If your trip is short, schedule fillers at the start so you have time to recover before flying back." },
  ],
  dental: [
    { q: "Single implant — 1 trip or 2?", askedBy: "James", ago: "1 day ago",
      a: "Most Bangkok clinics now offer single-visit implants if you have enough bone density. Post + temp crown placed in 1 visit, then 2-month healing remotely, then a quick second trip for the permanent crown. Ask your clinic if they support remote temp crown." },
    { q: "All-on-4 vs individual implants?", askedBy: "Karen", ago: "4 days ago",
      a: "All-on-4 (or All-on-6) uses 4–6 implants per arch to support a full denture. It's faster and cheaper than placing individual implants for each tooth, but each implant per tooth lasts longer and is easier to repair individually. Discuss your bone density + age before deciding." },
    { q: "Are Bangkok lab crowns as good as US/Korea?", askedBy: "Mike", ago: "2 weeks ago",
      a: "Top Bangkok clinics use the same German/Japanese materials (Straumann, Nobel, Ivoclar) as US/Korea. The difference is labor cost. For aesthetic-critical front teeth, ask about local lab + technician credentials." },
  ],
  hair: [
    { q: "FUE vs DHI — which gives more density?", askedBy: "Tom", ago: "2 days ago",
      a: "DHI typically achieves higher density per session because grafts go directly into incisions without pre-made channels — less time outside the body, better survival. But it's 30–50% more expensive per graft and requires more skilled technicians." },
    { q: "When can I wear a hat after?", askedBy: "Hassan", ago: "1 week ago",
      a: "Most surgeons say avoid tight hats for 7 days, loose-fitting (baseball cap with adjustable strap, not pressed against forehead) is OK from day 4. Beanie/snug hats: wait 10–14 days minimum to avoid graft displacement." },
    { q: "Will my donor area look thin?", askedBy: "Alex", ago: "2 weeks ago",
      a: "FUE removes grafts in random pattern across donor, so density loss is barely visible if extraction is done conservatively (<25% of donor capacity). Avoid surgeons who advertise 'mega-sessions' >4,500 grafts in one go — they often over-harvest donor." },
  ],
  hifu: [
    { q: "How painful is HIFU really?", askedBy: "Lyn", ago: "5 days ago",
      a: "Pain varies by area. Jaw + cheekbones: moderate (similar to a strong rubber band snap). Forehead + neck: mild. Most clinics offer Pronox (laughing gas) for free if you ask. No downtime after." },
  ],
  facial: [
    { q: "HydraFacial vs basic facial — worth the upcharge?", askedBy: "Soo-min", ago: "3 days ago",
      a: "HydraFacial machine costs the clinic ~฿500K+ and uses patented serums, so prices reflect that. The clean-extract-hydrate combo in one session is more effective than DIY at home, but a skilled hand-extraction facial from a senior aesthetician can match results at lower cost." },
  ],
  laser: [
    { q: "How many Pico sessions for melasma?", askedBy: "Anon", ago: "1 week ago",
      a: "Melasma is the hardest pigment to treat — typically 6–10 Pico sessions, 4 weeks apart, combined with daily SPF50 and tranexamic acid. Some patients see no improvement; ask the clinic about their melasma-specific success rate." },
  ],
};

export default function QnaCommunity({ focus }: { focus: SiteFocus }) {
  const qs = SEED_Q[focus];
  if (!qs || qs.length === 0) return null;

  return (
    <section className="rounded-2xl border bg-white overflow-hidden" style={{ borderColor: "rgb(var(--border))" }}>
      <div className="px-5 py-4 border-b flex items-baseline justify-between gap-3 flex-wrap" style={{ borderColor: "rgb(var(--border))" }}>
        <div>
          <div className="text-xs font-black uppercase tracking-widest text-[rgb(var(--muted))]">Community Q&amp;A</div>
          <h3 className="text-lg sm:text-xl font-black mt-0.5">Patients ask · we answer</h3>
        </div>
        <a href="mailto:hello@bkkclinics.com?subject=Question for the community"
          className="text-xs font-bold text-emerald-700 hover:underline whitespace-nowrap">
          Submit a question →
        </a>
      </div>

      <ul className="divide-y" style={{ borderColor: "rgb(var(--border))" }}>
        {qs.map((q, i) => (
          <li key={i} className="p-5">
            <div className="flex items-start gap-3 mb-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-blue-100 text-blue-700 font-black text-sm shrink-0">Q</span>
              <div className="flex-1">
                <div className="font-bold text-sm leading-snug">{q.q}</div>
                <div className="text-[10px] text-[rgb(var(--muted))] mt-0.5">Asked by {q.askedBy} · {q.ago}</div>
              </div>
            </div>
            <div className="flex items-start gap-3 ml-1">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-100 text-emerald-700 font-black text-sm shrink-0">A</span>
              <div className="flex-1">
                <p className="text-sm leading-relaxed">{q.a}</p>
                <div className="mt-1.5">
                  <span className="inline-block rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">Editorial answer</span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
