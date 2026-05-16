"use client";
import { useState, useMemo } from "react";

/**
 * 영업 시연용 ROI 계산기.
 * 클리닉이 자기 avg ticket / 월 trial 리드 입력 → 예상 MRR / ROI 자동 계산.
 * 데모 페이지에 박혀서 "이 가격이 말이 되는지" 보여줌.
 */
export function RoiCalculator({ defaultTicket = 18000 }: { defaultTicket?: number }) {
  const [ticket, setTicket] = useState(defaultTicket);
  const [leadsPerMonth, setLeadsPerMonth] = useState(15);
  const [closeRate, setCloseRate] = useState(40); // %

  const { closedLeads, revenue, costPerLead, costMonthly, profit, roiMultiple, recommendedPlan } = useMemo(() => {
    const closed = Math.round(leadsPerMonth * (closeRate / 100));
    const rev = closed * ticket;
    const perLead = closed * 200;
    const monthly = 8000;
    // 어느 게 더 싼지
    const plan = perLead < monthly ? "per_lead" : "monthly";
    const cost = Math.min(perLead, monthly);
    const prof = rev - cost;
    const multi = cost > 0 ? prof / cost : 0;
    return {
      closedLeads: closed,
      revenue: rev,
      costPerLead: perLead,
      costMonthly: monthly,
      profit: prof,
      roiMultiple: multi,
      recommendedPlan: plan,
    };
  }, [ticket, leadsPerMonth, closeRate]);

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-white to-blue-50 border-2 border-emerald-200 rounded-2xl p-6 my-8 shadow-md">
      <div className="mb-4">
        <h3 className="text-xl font-black tracking-tight mb-1">💰 ROI Calculator</h3>
        <p className="text-sm text-[var(--muted)]">Adjust the sliders. See your projected return.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-5 mb-6">
        <CalcSlider
          label="Your average procedure ticket"
          value={ticket}
          min={3000}
          max={150000}
          step={1000}
          onChange={setTicket}
          format={(v) => `฿${v.toLocaleString()}`}
        />
        <CalcSlider
          label="Leads from our directory / month"
          value={leadsPerMonth}
          min={1}
          max={60}
          step={1}
          onChange={setLeadsPerMonth}
          format={(v) => `${v} leads`}
        />
        <CalcSlider
          label="Your close rate"
          value={closeRate}
          min={10}
          max={80}
          step={5}
          onChange={setCloseRate}
          format={(v) => `${v}%`}
        />
      </div>

      {/* Results */}
      <div className="bg-white rounded-xl border border-[var(--border)] p-5 mb-4">
        <div className="grid sm:grid-cols-4 gap-4 text-center">
          <Metric label="Closed bookings" value={closedLeads.toString()} hint="from leads" />
          <Metric label="Revenue" value={`฿${(revenue / 1000).toFixed(0)}K`} hint="per month" color="#059669" />
          <Metric label="Our cost" value={`฿${(Math.min(costPerLead, costMonthly) / 1000).toFixed(1)}K`} hint={recommendedPlan === "per_lead" ? "pay-per-lead" : "monthly"} color="#6b7280" />
          <Metric label="Your profit" value={`฿${(profit / 1000).toFixed(0)}K`} hint={`${roiMultiple.toFixed(1)}× ROI`} color="#0891b2" big />
        </div>
      </div>

      {/* Plan recommendation */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm flex items-start gap-3">
        <span className="text-2xl">{recommendedPlan === "per_lead" ? "🎯" : "📈"}</span>
        <div>
          <p className="font-bold text-emerald-900 mb-1">
            Recommended plan: {recommendedPlan === "per_lead" ? "Pay-per-lead (฿200/lead)" : "Monthly unlimited (฿8,000/month)"}
          </p>
          <p className="text-emerald-800 text-xs leading-relaxed">
            {recommendedPlan === "per_lead"
              ? `At your volume (${closedLeads} closes/mo), pay-per-lead is cheaper. Switch to monthly when you regularly close 40+ leads.`
              : `At your volume (${closedLeads} closes/mo), the ฿8K monthly unlimited beats per-lead pricing. Best for high-velocity clinics.`}
          </p>
        </div>
      </div>

      <p className="text-[10px] text-[var(--muted)] mt-3 text-center">
        Estimates only. Actual ROI depends on your clinic&apos;s conversion process and lead handling speed.
      </p>
    </div>
  );
}

function CalcSlider({
  label, value, min, max, step, onChange, format,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-2xl font-black tabular-nums mb-2">{format(value)}</div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-emerald-600"
      />
      <div className="flex justify-between text-[10px] text-[var(--muted)] mt-1">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

function Metric({ label, value, hint, color, big }: { label: string; value: string; hint: string; color?: string; big?: boolean }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-1">{label}</div>
      <div className={`font-black tabular-nums ${big ? "text-3xl md:text-4xl" : "text-xl md:text-2xl"}`} style={{ color: color ?? "var(--fg)" }}>{value}</div>
      <div className="text-[10px] text-[var(--muted)] mt-1">{hint}</div>
    </div>
  );
}
