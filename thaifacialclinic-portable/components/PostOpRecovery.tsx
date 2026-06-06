// Day 1 / 3 / 7 / 14 / 30 recovery expectations. Focus-aware.

import type { SiteFocus } from "@/lib/site";

type Row = { day: string; you: string; ok: string[]; not_yet: string[] };

const FOCUS_RECOVERY: Partial<Record<SiteFocus, Row[]>> = {
  botox: [
    { day: "Day 1",  you: "No visible change, possible tiny red dots", ok: ["Light makeup after 4h", "Walking", "Work"], not_yet: ["Lying flat 4h", "Massaging face", "Intense exercise"] },
    { day: "Day 3",  you: "First effect noticed", ok: ["Most activities"], not_yet: ["Judging final result"] },
    { day: "Day 14", you: "Full effect", ok: ["Everything resume normal"], not_yet: [] },
  ],
  filler: [
    { day: "Day 1",  you: "Mild swelling, possible bruise", ok: ["Ice 10min/hr", "Sleep elevated head"], not_yet: ["Massaging area", "Hot tub/sauna", "Alcohol"] },
    { day: "Day 3",  you: "Bruising peaks then fades", ok: ["Light makeup over bruise"], not_yet: ["Pressure on area"] },
    { day: "Day 7",  you: "Settled, true look visible", ok: ["Everything"], not_yet: [] },
  ],
  hifu: [
    { day: "Day 1",  you: "Mild redness, possibly tender", ok: ["Makeup", "Work", "Gentle skincare"], not_yet: ["Saunas", "Intense workouts"] },
    { day: "Day 7",  you: "All sensation gone", ok: ["Anything"], not_yet: [] },
    { day: "Month 2-3", you: "Visible lifting/tightening", ok: [], not_yet: [] },
  ],
  facial: [
    { day: "Day 1",  you: "Glowing skin, mild pink", ok: ["Mineral SPF", "Light skincare"], not_yet: ["Active acids (BHA/AHA)", "Direct sun"] },
    { day: "Day 3",  you: "Slight dryness", ok: ["Everything", "Light exfoliation"], not_yet: [] },
  ],
  laser: [
    { day: "Day 1",  you: "Redness like mild sunburn", ok: ["Cooling gel", "Mineral SPF50", "Gentle cleanser"], not_yet: ["Direct sun", "Hot shower on face", "Active ingredients"] },
    { day: "Day 3-7", you: "Scabs/flaking", ok: ["Don't pick — let fall naturally"], not_yet: ["Picking scabs"] },
    { day: "Day 14",  you: "Fresh new skin", ok: ["Resume normal skincare"], not_yet: ["Tanning"] },
    { day: "Day 30",  you: "Final result visible", ok: ["Everything (continue SPF)"], not_yet: [] },
  ],
  dental: [
    { day: "Day 1",  you: "Mild swelling/sore gum (implant)", ok: ["Cold compress", "Soft food", "Ibuprofen if approved"], not_yet: ["Hot food/drink", "Smoking", "Spitting hard"] },
    { day: "Day 3-7", you: "Swelling fades", ok: ["Light food chewing on other side"], not_yet: ["Hard biting on implant site"] },
    { day: "Day 14",  you: "Sutures dissolve / removed", ok: ["Normal eating mostly"], not_yet: ["Hard nuts/chips on site"] },
    { day: "Day 60-90", you: "Implant integrated, ready for crown", ok: ["Everything"], not_yet: [] },
  ],
  hair: [
    { day: "Day 1-3", you: "Scabs form on grafts, donor itches", ok: ["Sleep elevated, light walking", "Wash carefully day 3+ per surgeon"], not_yet: ["Touching grafts", "Hats", "Alcohol"] },
    { day: "Day 7-10", you: "Scabs fall off", ok: ["Loose cap OK from day 7", "Gentle shampoo"], not_yet: ["Picking scabs", "Direct sun"] },
    { day: "Day 14-30", you: "'Shock loss' — transplanted hair falls", ok: ["Don't panic — it's normal"], not_yet: ["Tight hats", "Tanning"] },
    { day: "Month 4-6", you: "New growth visible", ok: ["Anything"], not_yet: [] },
    { day: "Month 12-18", you: "Full final result", ok: [], not_yet: [] },
  ],
};

export default function PostOpRecovery({ focus }: { focus: SiteFocus }) {
  const rows = FOCUS_RECOVERY[focus];
  if (!rows) return null;

  return (
    <section className="rounded-2xl border bg-white p-5 sm:p-6" style={{ borderColor: "rgb(var(--border))" }}>
      <div className="mb-4">
        <div className="text-xs font-black uppercase tracking-widest text-[rgb(var(--muted))]">Recovery timeline</div>
        <h3 className="text-lg sm:text-xl font-black tracking-tight mt-1">What you can expect after</h3>
      </div>

      <div className="overflow-x-auto -mx-2 px-2">
        <table className="w-full text-xs border-separate" style={{ borderSpacing: "0 8px" }}>
          <thead>
            <tr>
              <th className="text-left font-bold uppercase text-[10px] tracking-widest text-[rgb(var(--muted))] pl-3">When</th>
              <th className="text-left font-bold uppercase text-[10px] tracking-widest text-[rgb(var(--muted))]">How you&apos;ll feel</th>
              <th className="text-left font-bold uppercase text-[10px] tracking-widest text-emerald-700">OK to do</th>
              <th className="text-left font-bold uppercase text-[10px] tracking-widest text-rose-700">Not yet</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="bg-slate-50">
                <td className="font-bold p-3 rounded-l-lg whitespace-nowrap align-top">{r.day}</td>
                <td className="p-3 align-top">{r.you}</td>
                <td className="p-3 align-top text-emerald-800">
                  <ul className="space-y-1">{r.ok.map((s, k) => <li key={k}>✓ {s}</li>)}</ul>
                </td>
                <td className="p-3 align-top text-rose-800 rounded-r-lg">
                  <ul className="space-y-1">{r.not_yet.map((s, k) => <li key={k}>✕ {s}</li>)}</ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
