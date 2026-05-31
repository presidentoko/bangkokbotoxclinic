// Focus-aware "what to expect in your age group" outcome card.

import type { SiteFocus } from "@/lib/site";

type Row = { age: string; expect: string; trick?: string };

const FOCUS_AGE: Partial<Record<SiteFocus, Row[]>> = {
  botox: [
    { age: "20s",   expect: "Preventative — micro-doses keep dynamic wrinkles from etching in.",                 trick: "Skip if no movement-set wrinkles. Wait." },
    { age: "30s",   expect: "Sweet spot — 20–30 units treats forming forehead/11s effectively.",                  trick: "Combine with skin booster every 4 months." },
    { age: "40s",   expect: "Pair with filler — botox alone won't restore lost volume.",                          trick: "Get HIFU + filler consult on same trip." },
    { age: "50s+",  expect: "Smaller doses + HIFU/filler for full effect. Skin laxity is the main concern.",      trick: "Botox is a polish, not a foundation, in this age." },
  ],
  filler: [
    { age: "20s",   expect: "Lip filler popular. Avoid cheek/jaw — bone hasn't matured.",                          trick: "Conservative ml under skilled hand." },
    { age: "30s",   expect: "Cheek + tear-trough start. Maintains youthful structure.",                            trick: "Build slowly across 2-3 sessions." },
    { age: "40s+",  expect: "Volume restoration. Full-face approach often needed.",                                trick: "Pair with HIFU same trip — 1+1=3." },
  ],
  hifu: [
    { age: "30s",   expect: "Preventative tightening — collagen production still strong.",                         trick: "Single annual session enough." },
    { age: "40s",   expect: "Visible lift on jawline, brows. Most popular age." },
    { age: "50s+",  expect: "Combine with filler for full lift effect. HIFU alone may be subtle.",                  trick: "2 sessions/year + maintenance." },
  ],
  dental: [
    { age: "40s",   expect: "Implant timing sweet spot — natural teeth + bone density both still good.",            trick: "Don't wait — bone loss accelerates after 60." },
    { age: "50s+",  expect: "All-on-4 or implant-supported denture for multi-tooth replacement.",                   trick: "Get CBCT scan first to check bone." },
    { age: "60s+",  expect: "Bone-graft may be needed before implant — adds 4-6 months to timeline.",               trick: "Ask about zygomatic implants if upper jaw bone insufficient." },
  ],
  hair: [
    { age: "20s",   expect: "Norwood 2-3. Best graft survival, donor density high. Often only 1,500-2,000 grafts.", trick: "Combine with minoxidil/finasteride — surgery + meds." },
    { age: "30s",   expect: "Norwood 3-4. 2,500-3,500 grafts typical. Sweet age for results.",                      trick: "Plan donor carefully — you may need 2nd session later." },
    { age: "40s+",  expect: "Norwood 5-6. Larger session 3,500-4,500 grafts. Donor management critical.",            trick: "Avoid surgeons pushing >5,000 in one session — over-harvest risk." },
  ],
  facial: [
    { age: "20s+",  expect: "Anytime — maintenance is calendar-driven, not age-driven.", trick: "Build a 4-6 week cadence." },
  ],
  laser: [
    { age: "20s-30s", expect: "Best for active acne, light pigment.",                       trick: "3-6 sessions for stubborn pigment." },
    { age: "40s+",     expect: "Pico for sun-spots and skin tone evening.",                  trick: "Avoid if active melasma without specialist." },
  ],
};

export default function AgeGroupResults({ focus }: { focus: SiteFocus }) {
  const rows = FOCUS_AGE[focus];
  if (!rows) return null;

  return (
    <section className="rounded-2xl border bg-white p-5" style={{ borderColor: "var(--border)" }}>
      <div className="mb-3">
        <div className="text-xs font-black uppercase tracking-widest text-[var(--muted)]">By age group</div>
        <h3 className="text-base font-black mt-0.5">What to expect in your age range</h3>
      </div>
      <ul className="space-y-2">
        {rows.map((r, i) => (
          <li key={i} className="rounded-xl border bg-slate-50 p-3.5" style={{ borderColor: "var(--border)" }}>
            <div className="flex items-baseline gap-2 mb-1.5">
              <span className="rounded-full bg-blue-100 text-blue-800 text-[10px] font-black uppercase tracking-widest px-2 py-0.5">
                Age {r.age}
              </span>
            </div>
            <p className="text-sm leading-relaxed">{r.expect}</p>
            {r.trick && <p className="text-xs text-blue-700 mt-1.5"><strong>Tip:</strong> {r.trick}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}
