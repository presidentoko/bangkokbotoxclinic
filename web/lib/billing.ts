// 결제 / MRR 계산 헬퍼. 순수 함수만 — Redis 의존성 없음.

import type { ClinicPartner, PartnerStatus, Payment } from "./partners";

export function makePaymentId(): string {
  return `pmt_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

/** 가장 최근 결제 (paid_at 기준). */
export function lastPayment(p: ClinicPartner): Payment | null {
  if (!p.payments || p.payments.length === 0) return null;
  return [...p.payments].sort((a, b) => b.paid_at.localeCompare(a.paid_at))[0];
}

/** 결제 누적 합계. */
export function totalPaid(p: ClinicPartner): number {
  return (p.payments ?? []).reduce((s, x) => s + (x.amount_thb || 0), 0);
}

/** 자동 상태 — 수동 status 설정되어 있으면 그거 우선, 없으면 결제 이력으로 계산. */
export function computedStatus(p: ClinicPartner, now: Date = new Date()): PartnerStatus {
  if (p.status) return p.status;
  if (p.plan_tier === "trial") return "trial";
  if (p.plan_tier === "pilot") return "active";

  // paid tier — last_payment 기준
  const last = lastPayment(p);
  if (!last) return "overdue";
  const days = (now.getTime() - new Date(last.paid_at).getTime()) / 86_400_000;
  if (days <= 35) return "active";
  if (days <= 60) return "overdue";
  return "churned";
}

/** MRR — active + paid tier 인 파트너들의 monthly_fee_thb 합. */
export function computeMRR(partners: ClinicPartner[]): number {
  return partners
    .filter((p) => computedStatus(p) === "active" && p.monthly_fee_thb)
    .reduce((s, p) => s + (p.monthly_fee_thb || 0), 0);
}

/** 상태별 파트너 수. */
export function countByStatus(partners: ClinicPartner[]): Record<PartnerStatus, number> {
  const out: Record<PartnerStatus, number> = { active: 0, trial: 0, overdue: 0, churned: 0 };
  for (const p of partners) out[computedStatus(p)]++;
  return out;
}

/** 이번 달 누적 수입. */
export function revenueThisMonth(partners: ClinicPartner[], now: Date = new Date()): number {
  const ym = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  let sum = 0;
  for (const p of partners) {
    for (const pmt of p.payments ?? []) {
      if (pmt.paid_at.startsWith(ym)) sum += pmt.amount_thb;
    }
  }
  return sum;
}

export const STATUS_META: Record<PartnerStatus, { label: string; color: string; bg: string }> = {
  active:  { label: "Active",  color: "text-green-400",  bg: "bg-green-400/10 border-green-400/30" },
  trial:   { label: "Trial",   color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/30" },
  overdue: { label: "Overdue", color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/30" },
  churned: { label: "Churned", color: "text-gray-500",   bg: "bg-gray-500/10 border-gray-500/30" },
};
