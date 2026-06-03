"use client";

import { useMemo, useState } from "react";
import type { Lang } from "@/lib/types";

const COPY: Record<Lang, {
  eyebrow: string; title: string; sub: string;
  procedure: string; grafts: string; range: string;
  loss_label: string; loss_options: { v: string; t: string; grafts: [number, number] }[];
  estimate: string; vs_korea: string; vs_us: string;
  caveat: string;
}> = {
  en: {
    eyebrow: "Cost calculator",
    title: "Estimate your hair-transplant cost",
    sub: "Real ranges from 230 Thai clinics. Not a quote — just a realistic starting point.",
    procedure: "Procedure", grafts: "Grafts needed", range: "Estimated cost (THB)",
    loss_label: "Or pick by hair-loss pattern",
    loss_options: [
      { v: "early",  t: "Early thinning (Norwood 2-3)", grafts: [1000, 1800] },
      { v: "mid",    t: "Receding + crown (Norwood 4-5)", grafts: [2000, 3000] },
      { v: "advanced", t: "Advanced loss (Norwood 6)", grafts: [3000, 4500] },
      { v: "severe", t: "Severe (Norwood 7)", grafts: [4500, 6500] },
    ],
    estimate: "Estimate",
    vs_korea: "vs. Korea",
    vs_us: "vs. US / UK",
    caveat: "Final price depends on doctor experience, density goals, donor area, anesthesia. Always get a written quote.",
  },
  ko: {
    eyebrow: "비용 계산기",
    title: "모발이식 비용 추정",
    sub: "태국 230 클리닉 실제 범위. 견적 아닌 현실적 시작점.",
    procedure: "시술", grafts: "필요 모낭 수", range: "추정 비용 (THB)",
    loss_label: "탈모 단계로 선택",
    loss_options: [
      { v: "early",  t: "초기 (노우드 2-3)", grafts: [1000, 1800] },
      { v: "mid",    t: "M자형 + 정수리 (노우드 4-5)", grafts: [2000, 3000] },
      { v: "advanced", t: "광범위 (노우드 6)", grafts: [3000, 4500] },
      { v: "severe", t: "심각 (노우드 7)", grafts: [4500, 6500] },
    ],
    estimate: "추정",
    vs_korea: "한국 대비",
    vs_us: "미국/영국 대비",
    caveat: "최종 가격은 의사 경력, 밀도 목표, 공여부, 마취 방식에 따라 달라짐. 반드시 서면 견적 받으세요.",
  },
  th: {
    eyebrow: "เครื่องคิดราคา",
    title: "ประมาณการค่าใช้จ่ายปลูกผม",
    sub: "ช่วงราคาจริงจาก 230 คลินิกไทย",
    procedure: "ขั้นตอน", grafts: "จำนวน Graft", range: "ค่าใช้จ่ายประมาณ (THB)",
    loss_label: "เลือกตามระดับการสูญเสียผม",
    loss_options: [
      { v: "early", t: "เริ่มต้น (Norwood 2-3)", grafts: [1000, 1800] },
      { v: "mid", t: "M shape + กลางหัว (Norwood 4-5)", grafts: [2000, 3000] },
      { v: "advanced", t: "ขั้นสูง (Norwood 6)", grafts: [3000, 4500] },
      { v: "severe", t: "รุนแรง (Norwood 7)", grafts: [4500, 6500] },
    ],
    estimate: "ประมาณ",
    vs_korea: "เทียบเกาหลี",
    vs_us: "เทียบ US/UK",
    caveat: "ราคาสุดท้ายขึ้นอยู่กับประสบการณ์แพทย์ ขอใบเสนอราคาเป็นลายลักษณ์อักษร",
  },
  zh: {
    eyebrow: "费用计算器",
    title: "估算植发费用",
    sub: "来自 230 家泰国诊所的真实范围",
    procedure: "项目", grafts: "所需毛囊", range: "估算费用 (THB)",
    loss_label: "按脱发程度选择",
    loss_options: [
      { v: "early", t: "早期 (Norwood 2-3)", grafts: [1000, 1800] },
      { v: "mid", t: "M型+头顶 (Norwood 4-5)", grafts: [2000, 3000] },
      { v: "advanced", t: "进阶 (Norwood 6)", grafts: [3000, 4500] },
      { v: "severe", t: "严重 (Norwood 7)", grafts: [4500, 6500] },
    ],
    estimate: "估算",
    vs_korea: "对比韩国",
    vs_us: "对比美/英",
    caveat: "最终价格取决于医生经验等。请获取书面报价。",
  },
  ar: {
    eyebrow: "حاسبة التكلفة",
    title: "احسب تكلفة زراعة الشعر",
    sub: "نطاقات حقيقية من 230 عيادة تايلاندية",
    procedure: "الإجراء", grafts: "البصيلات المطلوبة", range: "التكلفة المقدرة (THB)",
    loss_label: "أو حدد حسب نمط الصلع",
    loss_options: [
      { v: "early", t: "خفيف (Norwood 2-3)", grafts: [1000, 1800] },
      { v: "mid", t: "متوسط (Norwood 4-5)", grafts: [2000, 3000] },
      { v: "advanced", t: "متقدم (Norwood 6)", grafts: [3000, 4500] },
      { v: "severe", t: "شديد (Norwood 7)", grafts: [4500, 6500] },
    ],
    estimate: "تقدير",
    vs_korea: "مقابل كوريا",
    vs_us: "مقابل أمريكا/بريطانيا",
    caveat: "السعر النهائي يعتمد على خبرة الطبيب. احصل دائماً على عرض سعر كتابي.",
  },
};

// Per-graft pricing in THB (lo/hi range) — derived from Thai market 2025.
const PROCEDURES = [
  { v: "fue",  name: "FUE",  perGraftTHB: [40, 75]  as [number, number], note: "Most popular · natural-looking" },
  { v: "dhi",  name: "DHI",  perGraftTHB: [55, 95]  as [number, number], note: "Higher density · 30-50% more than FUE" },
  { v: "fut",  name: "FUT",  perGraftTHB: [30, 50]  as [number, number], note: "Older · most grafts in one go · linear scar" },
];

// Multipliers for cost comparison vs other countries (rough industry averages).
const VS_KOREA_MULT = 2.2;
const VS_US_MULT = 3.5;

function fmtTHB(n: number): string {
  if (n >= 1_000_000) return `฿${(n / 1_000_000).toFixed(1)}M`;
  return `฿${Math.round(n / 1000)}K`;
}

export default function CostCalculator({ lang }: { lang: Lang }) {
  const c = COPY[lang];
  const [proc, setProc] = useState("fue");
  const [grafts, setGrafts] = useState(2500);

  const procData = PROCEDURES.find((p) => p.v === proc)!;
  const [perLo, perHi] = procData.perGraftTHB;

  const { lo, hi, korea, us } = useMemo(() => {
    const lo = grafts * perLo;
    const hi = grafts * perHi;
    const mid = (lo + hi) / 2;
    return {
      lo, hi,
      korea: mid * VS_KOREA_MULT,
      us: mid * VS_US_MULT,
    };
  }, [grafts, perLo, perHi]);

  function setByLoss(g: [number, number]) {
    setGrafts(Math.round((g[0] + g[1]) / 2));
  }

  return (
    <section className="rounded-[2rem] border-2 bg-[rgb(var(--bg-elev))] p-6 shadow-premium sm:p-10" style={{ borderColor: "rgb(var(--border))" }}>
      <div className="text-center mb-8">
        <div className="eyebrow justify-center">{c.eyebrow}</div>
        <h2 className="mt-2 font-display text-3xl font-bold tracking-tighter-display sm:text-4xl">{c.title}</h2>
        <p className="mt-2 text-sm muted max-w-xl mx-auto">{c.sub}</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        {/* Controls */}
        <div className="space-y-6">
          {/* Procedure selector */}
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.15em] muted mb-3">{c.procedure}</div>
            <div className="grid grid-cols-3 gap-2">
              {PROCEDURES.map((p) => (
                <button key={p.v} type="button" onClick={() => setProc(p.v)}
                  className={`rounded-xl border-2 p-3 text-left transition ${
                    proc === p.v
                      ? "border-navy-700 bg-navy-50 dark:bg-navy-900/30 dark:border-gold-400"
                      : "border-[rgb(var(--border))] hover:border-navy-300"
                  }`}>
                  <div className="font-display text-lg font-bold">{p.name}</div>
                  <div className="text-[10px] muted leading-tight mt-0.5">{p.note}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Grafts slider */}
          <div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-[0.15em] muted">{c.grafts}</span>
              <span className="font-display text-2xl font-bold tabular-nums">{grafts.toLocaleString()}</span>
            </div>
            <input
              type="range" min={500} max={6500} step={100}
              value={grafts} onChange={(e) => setGrafts(Number(e.target.value))}
              className="w-full accent-navy-700 dark:accent-gold-400"
            />
            <div className="flex justify-between text-[10px] muted font-bold">
              <span>500</span><span>2,000</span><span>4,000</span><span>6,500</span>
            </div>
          </div>

          {/* Loss-pattern quick picker */}
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.15em] muted mb-2">{c.loss_label}</div>
            <div className="grid grid-cols-2 gap-2">
              {c.loss_options.map((o) => (
                <button key={o.v} type="button" onClick={() => setByLoss(o.grafts)}
                  className="rounded-lg border bg-[rgb(var(--bg))] p-2.5 text-left text-xs transition hover:border-navy-700"
                  style={{ borderColor: "rgb(var(--border))" }}>
                  <div className="font-semibold leading-tight">{o.t}</div>
                  <div className="text-[10px] muted mt-0.5 tabular-nums">{o.grafts[0].toLocaleString()}–{o.grafts[1].toLocaleString()}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Output */}
        <div className="space-y-4">
          <div className="rounded-2xl border-2 border-gold-400 bg-gradient-to-br from-gold-50 to-transparent p-6 dark:from-gold-950/30">
            <div className="text-[10px] font-bold uppercase tracking-[0.15em] text-gold-800 dark:text-gold-300">{c.range}</div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-display text-4xl font-bold tabular-nums text-gold-900 dark:text-gold-200 sm:text-5xl">
                {fmtTHB(lo)}–{fmtTHB(hi)}
              </span>
            </div>
            <div className="mt-2 text-xs muted tabular-nums">
              {grafts.toLocaleString()} grafts × ฿{perLo}–฿{perHi} / graft ({procData.name})
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="card p-4">
              <div className="text-[10px] font-bold uppercase tracking-wider muted">{c.vs_korea}</div>
              <div className="mt-1 font-display text-xl font-bold tabular-nums">{fmtTHB(korea)}</div>
              <div className="text-[10px] muted">~2.2× our price</div>
            </div>
            <div className="card p-4">
              <div className="text-[10px] font-bold uppercase tracking-wider muted">{c.vs_us}</div>
              <div className="mt-1 font-display text-xl font-bold tabular-nums">{fmtTHB(us)}</div>
              <div className="text-[10px] muted">~3.5× our price</div>
            </div>
          </div>

          <p className="text-[11px] muted leading-relaxed">{c.caveat}</p>
        </div>
      </div>
    </section>
  );
}
