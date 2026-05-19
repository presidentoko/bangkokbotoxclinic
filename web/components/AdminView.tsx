"use client";
import { useState, useCallback, useMemo, useEffect } from "react";
import { ComposeOutreachModal } from "@/components/ComposeOutreachModal";

// ─── Types ──────────────────────────────────────────────────────────────────

type DbSummary = {
  generated_at: string;
  total_clinics: number;
  with_reviews_scraped: number;
  city_counts: Record<string, number>;
};

type PartnerStatus = "active" | "trial" | "overdue" | "churned";
type PlanTier = "trial" | "pilot" | "paid";

type Payment = {
  id: string;
  amount_thb: number;
  paid_at: string;
  method: "promptpay" | "bank_transfer" | "card" | "cash" | "other";
  period_start?: string;
  period_end?: string;
  note?: string;
};

type PartnerRecord = {
  clinic_id: string;
  plan_tier: PlanTier;
  status?: PartnerStatus;
  contact_email?: string;
  line_user_id?: string;
  monthly_fee_thb?: number;
  monthly_ticket_avg_thb?: number;
  started_at?: string;
  notes?: string;
  payments?: Payment[];
};

type EnrichedPartner = PartnerRecord & {
  clinic_name: string;
  clinic_rating: number | null;
  clinic_city: string | null;
};

type SponsoredMap = {
  editors_pick: string[];
  recommended: string[];
  featured: string[];
};

type ClinicName = { id: string; name: string; city: string };

type Props = {
  db: DbSummary;
  partners: EnrichedPartner[];
  sponsored: SponsoredMap;
  clinicNames: ClinicName[];
};

// ─── Constants ──────────────────────────────────────────────────────────────

const TABS = ["Overview", "Outreach", "Partners", "Leads", "Ads"] as const;
type Tab = (typeof TABS)[number];

type OutreachOutcome =
  | "sent" | "read_no_reply" | "REPLIED_EN" | "HANDOFF_TO_THAI_TEAM"
  | "MEETING_SCHEDULED" | "SIGNED"
  | "dead_not_interested" | "dead_no_reply" | "dead_hostile" | "ghosted";

type OutreachRecord = {
  clinic_id: string;
  clinic_name: string;
  staff?: string;
  channel: "LINE" | "FB_MESSENGER" | "WEBSITE_FORM" | "EMAIL" | "OTHER";
  template: "T1" | "T2" | "T3" | "T4" | "T5";
  outcome: OutreachOutcome;
  sent_at: string;
  replied_at?: string;
  next_action?: string;
  note?: string;
  last_updated: string;
};

const OUTCOME_META: Record<OutreachOutcome, { label: string; color: string; bg: string }> = {
  sent:                 { label: "Sent",           color: "text-gray-300",   bg: "bg-gray-800 border-gray-700" },
  read_no_reply:        { label: "Read, no reply", color: "text-gray-400",   bg: "bg-gray-700 border-gray-600" },
  REPLIED_EN:           { label: "Replied (EN)",   color: "text-blue-300",   bg: "bg-blue-900/40 border-blue-700/40" },
  HANDOFF_TO_THAI_TEAM: { label: "→ Thai team",    color: "text-amber-300",  bg: "bg-amber-900/40 border-amber-700/40" },
  MEETING_SCHEDULED:    { label: "Meeting set",    color: "text-purple-300", bg: "bg-purple-900/40 border-purple-700/40" },
  SIGNED:               { label: "✓ Signed",       color: "text-green-300",  bg: "bg-green-900/50 border-green-700/50" },
  dead_not_interested:  { label: "Declined",       color: "text-gray-500",   bg: "bg-gray-900 border-gray-800" },
  dead_no_reply:        { label: "No reply",       color: "text-gray-600",   bg: "bg-gray-900 border-gray-800" },
  dead_hostile:         { label: "Hostile",        color: "text-red-400",    bg: "bg-red-900/30 border-red-700/40" },
  ghosted:              { label: "Ghosted",        color: "text-orange-300", bg: "bg-orange-900/30 border-orange-700/40" },
};

const STATUS_META: Record<PartnerStatus, { label: string; color: string; bg: string }> = {
  active:  { label: "Active",  color: "text-green-400",  bg: "bg-green-400/10 border-green-400/40" },
  trial:   { label: "Trial",   color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/40" },
  overdue: { label: "Overdue", color: "text-orange-400", bg: "bg-orange-400/10 border-orange-400/40" },
  churned: { label: "Churned", color: "text-gray-500",   bg: "bg-gray-500/10 border-gray-500/40" },
};

// ─── Helpers ────────────────────────────────────────────────────────────────

function adminKey(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem("admin_pk") ?? "";
}

function lastPayment(p: PartnerRecord): Payment | null {
  if (!p.payments || p.payments.length === 0) return null;
  return [...p.payments].sort((a, b) => b.paid_at.localeCompare(a.paid_at))[0];
}

function computedStatus(p: PartnerRecord, now: Date = new Date()): PartnerStatus {
  if (p.status) return p.status;
  if (p.plan_tier === "trial") return "trial";
  if (p.plan_tier === "pilot") return "active";
  const last = lastPayment(p);
  if (!last) return "overdue";
  const days = (now.getTime() - new Date(last.paid_at).getTime()) / 86_400_000;
  if (days <= 35) return "active";
  if (days <= 60) return "overdue";
  return "churned";
}

function computeMRR(partners: PartnerRecord[]): number {
  return partners
    .filter((p) => computedStatus(p) === "active" && p.monthly_fee_thb)
    .reduce((s, p) => s + (p.monthly_fee_thb || 0), 0);
}

function revenueThisMonth(partners: PartnerRecord[]): number {
  const ym = new Date().toISOString().slice(0, 7);
  let s = 0;
  for (const p of partners) for (const pmt of p.payments ?? []) if (pmt.paid_at.startsWith(ym)) s += pmt.amount_thb;
  return s;
}

function countByStatus(partners: PartnerRecord[]): Record<PartnerStatus, number> {
  const out: Record<PartnerStatus, number> = { active: 0, trial: 0, overdue: 0, churned: 0 };
  for (const p of partners) out[computedStatus(p)]++;
  return out;
}

async function copyToClipboard(text: string): Promise<void> {
  try { await navigator.clipboard.writeText(text); } catch {
    const el = document.createElement("textarea");
    el.value = text; document.body.appendChild(el); el.select();
    document.execCommand("copy"); document.body.removeChild(el);
  }
}

// ─── Root ───────────────────────────────────────────────────────────────────

export default function AdminView({ db, partners: initialPartners, sponsored: initialSponsored, clinicNames }: Props) {
  const [tab, setTab] = useState<Tab>("Overview");
  const [partners, setPartners] = useState<EnrichedPartner[]>(initialPartners);

  const reloadPartners = useCallback(async () => {
    const res = await fetch("/api/admin/partners", {
      headers: { "x-admin-key": adminKey() },
      cache: "no-store",
    });
    if (!res.ok) return;
    const j = (await res.json()) as { partners: PartnerRecord[] };
    setPartners(j.partners.map((p) => {
      const c = clinicNames.find((x) => x.id === p.clinic_id);
      return { ...p, clinic_name: c?.name ?? p.clinic_id, clinic_rating: null, clinic_city: c?.city ?? null };
    }));
  }, [clinicNames]);

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-[10px] sm:text-xs text-gray-500 tracking-widest uppercase">admin</span>
        <span className="text-[10px] sm:text-xs text-gray-600">{new Date().toISOString().slice(0, 10)}</span>
      </div>

      {/* Tabs — horizontal scroll on mobile if overflow */}
      <div className="flex gap-1 border-b border-gray-800 overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0 scrollbar-thin">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-t-lg transition whitespace-nowrap ${
              tab === t ? "bg-gray-800 text-white" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Overview" && <OverviewTab db={db} partners={partners} />}
      {tab === "Outreach" && <OutreachTab clinicNames={clinicNames} />}
      {tab === "Partners" && (
        <PartnersTab
          partners={partners}
          clinicNames={clinicNames}
          onChange={reloadPartners}
        />
      )}
      {tab === "Leads"    && <LeadsTab partners={partners} clinicNames={clinicNames} />}
      {tab === "Ads"      && <AdsTab initial={initialSponsored} clinicNames={clinicNames} />}
    </div>
  );
}

// ─── Overview Tab — MRR, revenue, DB freshness ──────────────────────────────

function OverviewTab({ db, partners }: { db: DbSummary; partners: EnrichedPartner[] }) {
  const mrr = useMemo(() => computeMRR(partners), [partners]);
  const revMonth = useMemo(() => revenueThisMonth(partners), [partners]);
  const statusCount = useMemo(() => countByStatus(partners), [partners]);

  const age = useMemo(() => {
    const diff = Date.now() - new Date(db.generated_at).getTime();
    const h = Math.floor(diff / 3_600_000);
    if (h < 48) return { text: `${h}h ago`, stale: h > 24 };
    return { text: `${Math.floor(h / 24)}d ago`, stale: true };
  }, [db.generated_at]);

  const topCities = useMemo(
    () => Object.entries(db.city_counts).sort((a, b) => b[1] - a[1]).slice(0, 10),
    [db.city_counts]
  );
  const coveragePct = Math.round((db.with_reviews_scraped / db.total_clinics) * 100);

  return (
    <div className="space-y-8">
      {/* Revenue widgets */}
      <div>
        <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-3">Revenue</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <BigStat label="MRR" value={`฿${mrr.toLocaleString()}`} hint="active paid partners" color="text-green-400" />
          <BigStat label="This month" value={`฿${revMonth.toLocaleString()}`} hint="total paid this month" color="text-emerald-400" />
          <BigStat label="Partners" value={partners.length.toString()} hint={`${statusCount.active} active · ${statusCount.trial} trial`} />
          <BigStat label="Overdue" value={statusCount.overdue.toString()} hint="check Partners tab" color={statusCount.overdue > 0 ? "text-orange-400" : "text-gray-500"} />
        </div>
      </div>

      {/* Status breakdown */}
      <div>
        <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-3">Partner status</h3>
        <div className="flex gap-2 flex-wrap">
          {(Object.keys(STATUS_META) as PartnerStatus[]).map((s) => (
            <div key={s} className={`px-3 py-2 rounded-lg border ${STATUS_META[s].bg}`}>
              <span className={`text-xs font-bold uppercase tracking-widest ${STATUS_META[s].color}`}>{STATUS_META[s].label}</span>
              <span className="ml-2 text-sm font-mono text-gray-200">{statusCount[s]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Data stats */}
      <div>
        <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-3">Data</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <BigStat label="Total clinics" value={db.total_clinics.toLocaleString()} />
          <BigStat label="Reviews scraped" value={`${coveragePct}%`} hint={`${db.with_reviews_scraped.toLocaleString()} clinics`} />
          <BigStat label="Cities" value={Object.keys(db.city_counts).length.toString()} />
          <BigStat
            label="DB freshness"
            value={age.text}
            hint={new Date(db.generated_at).toLocaleString().slice(0, 16)}
            color={age.stale ? "text-orange-400" : "text-gray-200"}
          />
        </div>
      </div>

      {/* Top cities */}
      <div>
        <h3 className="text-xs text-gray-500 uppercase tracking-widest mb-3">Top cities</h3>
        <div className="space-y-2">
          {topCities.map(([city, count]) => {
            const pct = Math.round((count / db.total_clinics) * 100);
            return (
              <div key={city} className="flex items-center gap-3">
                <span className="w-28 text-sm text-gray-300 truncate">{city}</span>
                <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs text-gray-500 w-12 text-right">{count.toLocaleString()}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Sales / outreach */}
      <ProspectExporter />
    </div>
  );
}

// ─── Prospect Exporter ──────────────────────────────────────────────────────

function ProspectExporter() {
  const [minTrust, setMinTrust] = useState(75);
  const [minReviews, setMinReviews] = useState(50);
  const [city, setCity] = useState("");
  const [limit, setLimit] = useState(100);
  const [downloading, setDownloading] = useState(false);
  const [preview, setPreview] = useState<{ count: number; rows: { clinic_id: string; name: string; phone: string; district: string; trust_score: number; pitch_hook: string }[] } | null>(null);
  const [composeFor, setComposeFor] = useState<{ id: string; name: string } | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [queue, setQueue] = useState<{ id: string; name: string }[]>([]);
  const [queueIdx, setQueueIdx] = useState(0);

  const visibleRows = preview?.rows.slice(0, 10) ?? [];
  const allVisibleSelected = visibleRows.length > 0 && visibleRows.every((r) => selected.has(r.clinic_id));
  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allVisibleSelected) {
        visibleRows.forEach((r) => next.delete(r.clinic_id));
      } else {
        visibleRows.forEach((r) => next.add(r.clinic_id));
      }
      return next;
    });
  };
  const toggleOne = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const startQueue = () => {
    if (!preview) return;
    const rows = preview.rows.filter((r) => selected.has(r.clinic_id)).map((r) => ({ id: r.clinic_id, name: r.name }));
    if (rows.length === 0) return;
    setQueue(rows);
    setQueueIdx(0);
  };
  const inQueue = queue.length > 0;
  const queueCurrent = inQueue ? queue[queueIdx] : null;

  async function fetchPreview() {
    setDownloading(true);
    const qs = new URLSearchParams({
      min_trust: String(minTrust),
      min_reviews: String(minReviews),
      city,
      limit: String(limit),
      format: "json",
    }).toString();
    const res = await fetch(`/api/admin/prospects?${qs}`, {
      headers: { "x-admin-key": adminKey() },
    });
    setDownloading(false);
    if (!res.ok) return;
    const j = await res.json();
    setPreview(j);
  }

  function downloadCSV() {
    const qs = new URLSearchParams({
      min_trust: String(minTrust),
      min_reviews: String(minReviews),
      city,
      limit: String(limit),
    }).toString();
    window.location.href = `/api/admin/prospects?${qs}`;
  }

  return (
    <div className="bg-gray-900 border border-emerald-500/30 rounded-xl p-5 space-y-4">
      <div>
        <h3 className="text-sm font-bold text-emerald-300 mb-1">🎯 Prospect export (sales outreach)</h3>
        <p className="text-xs text-gray-500">Trust-qualified clinics not yet partners. Filter, preview, download CSV for cold outreach.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Min Trust</label>
          <input type="number" value={minTrust} onChange={(e) => setMinTrust(parseInt(e.target.value) || 75)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-gray-100" />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Min reviews</label>
          <input type="number" value={minReviews} onChange={(e) => setMinReviews(parseInt(e.target.value) || 50)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-gray-100" />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">City (optional)</label>
          <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Bangkok" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-gray-100" />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Limit</label>
          <input type="number" value={limit} onChange={(e) => setLimit(parseInt(e.target.value) || 100)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-sm text-gray-100" />
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={fetchPreview} disabled={downloading} className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-300 transition">
          {downloading ? "..." : "Preview"}
        </button>
        <button onClick={downloadCSV} className="bg-emerald-600 hover:bg-emerald-500 rounded-lg px-4 py-2 text-sm text-white font-semibold transition">
          ↓ Download CSV
        </button>
        <span className="text-xs text-gray-500 self-center ml-2">
          💡 Tip: select rows + <span className="text-purple-400 font-bold">📩 Compose queue</span> to send sequentially. Templates auto-fill per clinic — no more SALES_PITCH.md copy-paste.
        </span>
      </div>
      {preview && (
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-3 max-h-80 overflow-x-auto">
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <p className="text-xs text-gray-500">{preview.count} prospects match. Top 10 shown.</p>
            {selected.size > 0 && (
              <button
                onClick={startQueue}
                className="text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white rounded-lg px-3 py-1.5"
              >
                📩 Compose queue ({selected.size}) →
              </button>
            )}
          </div>
          <table className="w-full text-xs min-w-[640px]">
            <thead className="text-gray-600">
              <tr>
                <th className="text-left p-1 w-6">
                  <input type="checkbox" checked={allVisibleSelected} onChange={toggleAll} className="cursor-pointer" />
                </th>
                <th className="text-left p-1">Clinic</th>
                <th className="text-left p-1">District</th>
                <th className="text-right p-1">Trust</th>
                <th className="text-left p-1">Hook</th>
                <th className="text-right p-1">Action</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((r) => (
                <tr key={r.clinic_id} className={`border-t border-gray-800 ${selected.has(r.clinic_id) ? "bg-purple-950/30" : ""}`}>
                  <td className="p-1">
                    <input
                      type="checkbox"
                      checked={selected.has(r.clinic_id)}
                      onChange={() => toggleOne(r.clinic_id)}
                      className="cursor-pointer"
                    />
                  </td>
                  <td className="p-1 text-gray-300 truncate max-w-[140px]">{r.name}</td>
                  <td className="p-1 text-gray-500">{r.district}</td>
                  <td className="p-1 text-right text-emerald-400 tabular-nums">{r.trust_score}</td>
                  <td className="p-1 text-gray-400 truncate max-w-[280px]">{r.pitch_hook}</td>
                  <td className="p-1 text-right whitespace-nowrap">
                    <button
                      onClick={() => setComposeFor({ id: r.clinic_id, name: r.name })}
                      title="Compose outreach"
                      className="text-[10px] px-2 py-0.5 rounded bg-indigo-600 hover:bg-indigo-500 text-white mr-1"
                    >
                      📩
                    </button>
                    <a
                      href={`/dashboard/${r.clinic_id}`}
                      target="_blank"
                      rel="noopener"
                      title="Preview clinic dashboard"
                      className="text-[10px] px-2 py-0.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700"
                    >
                      👁
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Single compose */}
      {composeFor && !inQueue && (
        <ComposeOutreachModal
          clinicId={composeFor.id}
          clinicName={composeFor.name}
          onClose={() => setComposeFor(null)}
          onSent={() => setComposeFor(null)}
        />
      )}

      {/* Queue compose */}
      {inQueue && queueCurrent && (
        <ComposeOutreachModal
          key={queueCurrent.id}
          clinicId={queueCurrent.id}
          clinicName={queueCurrent.name}
          queuePosition={queueIdx + 1}
          queueTotal={queue.length}
          onNext={() => {
            if (queueIdx + 1 >= queue.length) {
              // Queue done
              setQueue([]);
              setQueueIdx(0);
              setSelected(new Set());
            } else {
              setQueueIdx(queueIdx + 1);
            }
          }}
          onClose={() => { setQueue([]); setQueueIdx(0); }}
          onSent={() => { setQueue([]); setQueueIdx(0); setSelected(new Set()); }}
        />
      )}
    </div>
  );
}

// ─── Partners Tab ───────────────────────────────────────────────────────────

function PartnersTab({
  partners, clinicNames, onChange,
}: {
  partners: EnrichedPartner[];
  clinicNames: ClinicName[];
  onChange: () => Promise<void>;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [showBulk, setShowBulk] = useState(false);
  const [paymentFor, setPaymentFor] = useState<string | null>(null);
  const [historyFor, setHistoryFor] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  async function handleAdd(data: PartnerRecord) {
    setSaving(true);
    const res = await fetch("/api/admin/partners", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey() },
      body: JSON.stringify(data),
    });
    const j = (await res.json()) as { ok: boolean; error?: string };
    setSaving(false);
    if (j.ok) {
      setMsg("Partner added!");
      setShowAdd(false);
      await onChange();
    } else {
      setMsg(j.error === "already_exists" ? "Already a partner." : j.error ?? "Error");
    }
    setTimeout(() => setMsg(""), 3000);
  }

  async function patchPartner(clinic_id: string, patch: Partial<PartnerRecord>) {
    await fetch("/api/admin/partners", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey() },
      body: JSON.stringify({ clinic_id, ...patch }),
    });
    await onChange();
  }

  async function handleDelete(clinic_id: string, name: string) {
    if (!confirm(`Remove ${name} as partner? Payment history will be lost.`)) return;
    await fetch("/api/admin/partners", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey() },
      body: JSON.stringify({ clinic_id }),
    });
    await onChange();
  }

  async function recordPayment(p: Omit<Payment, "id"> & { clinic_id: string }) {
    setSaving(true);
    const res = await fetch("/api/admin/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey() },
      body: JSON.stringify(p),
    });
    setSaving(false);
    if (res.ok) {
      setMsg("Payment recorded.");
      setPaymentFor(null);
      await onChange();
    } else {
      setMsg("Failed to record payment");
    }
    setTimeout(() => setMsg(""), 3000);
  }

  async function deletePayment(clinic_id: string, payment_id: string) {
    if (!confirm("Delete this payment record?")) return;
    await fetch("/api/admin/payments", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey() },
      body: JSON.stringify({ clinic_id, payment_id }),
    });
    await onChange();
  }

  async function copyLink(clinic_id: string) {
    const url = `${window.location.origin}/dashboard/${clinic_id}`;
    await copyToClipboard(url);
    setCopied(clinic_id);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{partners.length} partner{partners.length !== 1 ? "s" : ""}</span>
        <div className="flex gap-2">
          <button
            onClick={() => setShowBulk(true)}
            className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-3 py-2 text-xs text-gray-300 transition"
          >
            📋 Bulk import
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="bg-indigo-600 hover:bg-indigo-500 rounded-lg px-4 py-2 text-sm text-white font-semibold transition"
          >
            + Add Partner
          </button>
        </div>
      </div>

      {showBulk && (
        <BulkImportForm
          onClose={() => setShowBulk(false)}
          onDone={async () => { setShowBulk(false); await onChange(); }}
        />
      )}

      {msg && <p className="text-sm text-green-400">{msg}</p>}

      {showAdd && (
        <AddPartnerForm
          clinicNames={clinicNames}
          existingIds={partners.map((p) => p.clinic_id)}
          onSave={handleAdd}
          onCancel={() => setShowAdd(false)}
          saving={saving}
        />
      )}

      {partners.length === 0 && !showAdd && (
        <p className="text-gray-600 text-sm py-8 text-center">No partners yet. Add your first clinic above.</p>
      )}

      <div className="space-y-3">
        {partners.map((p) => {
          const status = computedStatus(p);
          const meta = STATUS_META[status];
          const last = lastPayment(p);
          return (
            <div key={p.clinic_id} className={`border rounded-xl p-4 space-y-3 ${meta.bg}`}>
              {/* Header row */}
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${meta.color}`}>{meta.label}</span>
                    <span className="font-semibold text-gray-100">{p.clinic_name}</span>
                    {p.clinic_city && <span className="text-xs text-gray-500">{p.clinic_city}</span>}
                  </div>
                  <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                    {p.started_at && <span>since {p.started_at}</span>}
                    {p.monthly_fee_thb && <span className="text-green-400">฿{p.monthly_fee_thb.toLocaleString()}/mo</span>}
                    {last && <span>last paid {last.paid_at} (฿{last.amount_thb.toLocaleString()})</span>}
                    {p.contact_email && <span>✉ {p.contact_email}</span>}
                    {p.line_user_id && <span>LINE</span>}
                  </div>
                </div>

                <select
                  value={p.plan_tier}
                  onChange={(e) => patchPartner(p.clinic_id, { plan_tier: e.target.value as PlanTier })}
                  className="bg-gray-900 border border-gray-700 rounded-lg px-2 py-1 text-xs font-mono font-semibold text-gray-300 focus:outline-none"
                >
                  <option value="trial">trial</option>
                  <option value="pilot">pilot</option>
                  <option value="paid">paid</option>
                </select>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => copyLink(p.clinic_id)}
                  className="text-xs bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-indigo-300 transition"
                >
                  {copied === p.clinic_id ? "✓ Copied!" : "📋 Copy dashboard link"}
                </button>
                <a
                  href={`/dashboard/${p.clinic_id}`}
                  target="_blank"
                  rel="noopener"
                  className="text-xs bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-gray-400 transition"
                >
                  Open →
                </a>
                <button
                  onClick={() => setPaymentFor(paymentFor === p.clinic_id ? null : p.clinic_id)}
                  className="text-xs bg-green-900/40 hover:bg-green-900/60 border border-green-700/40 rounded-lg px-3 py-1.5 text-green-300 transition"
                >
                  💰 Record payment
                </button>
                {p.payments && p.payments.length > 0 && (
                  <button
                    onClick={() => setHistoryFor(historyFor === p.clinic_id ? null : p.clinic_id)}
                    className="text-xs bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-gray-400 transition"
                  >
                    History ({p.payments.length})
                  </button>
                )}
                <button
                  onClick={() => handleDelete(p.clinic_id, p.clinic_name)}
                  className="text-xs bg-gray-900 hover:bg-red-900/30 border border-gray-700 hover:border-red-700/50 rounded-lg px-3 py-1.5 text-gray-600 hover:text-red-400 transition"
                >
                  Remove
                </button>
              </div>

              {/* Inline forms */}
              {paymentFor === p.clinic_id && (
                <RecordPaymentForm
                  partner={p}
                  onSave={(pmt) => recordPayment({ clinic_id: p.clinic_id, ...pmt })}
                  onCancel={() => setPaymentFor(null)}
                  saving={saving}
                />
              )}
              {historyFor === p.clinic_id && p.payments && (
                <PaymentHistory
                  payments={p.payments}
                  onDelete={(id) => deletePayment(p.clinic_id, id)}
                />
              )}

              {/* Editable fields (always visible inline) */}
              <details className="text-xs">
                <summary className="cursor-pointer text-gray-500 hover:text-gray-300 transition">Edit contact & fee</summary>
                <PartnerFieldsEditor partner={p} onSave={(patch) => patchPartner(p.clinic_id, patch)} />
              </details>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Bulk CSV import ────────────────────────────────────────────────────────

type BulkRow = {
  clinic_id: string;
  plan_tier?: "trial" | "pilot" | "paid";
  contact_email?: string;
  line_user_id?: string;
  monthly_fee_thb?: number;
  monthly_ticket_avg_thb?: number;
  started_at?: string;
  notes?: string;
};

const BULK_TEMPLATE = `clinic_id,plan_tier,contact_email,line_user_id,monthly_fee_thb,monthly_ticket_avg_thb,started_at,notes
0x30e29ef6...:0x15b0...,paid,clinic@example.com,Uabc123,8000,15000,2026-05-15,Imported
0x30e29ec...:0x256a...,pilot,info@another.com,,5000,12000,2026-05-15,`;

function parseCSV(text: string): { rows: BulkRow[]; errors: string[] } {
  const errors: string[] = [];
  const lines = text.trim().split(/\r?\n/).filter((l) => l.trim() && !l.trim().startsWith("#"));
  if (lines.length === 0) return { rows: [], errors: ["empty input"] };
  const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
  const idxOf = (name: string) => header.indexOf(name);
  const idIdx = idxOf("clinic_id");
  if (idIdx === -1) {
    errors.push("first row must include 'clinic_id' column");
    return { rows: [], errors };
  }
  const rows: BulkRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const fields = parseCSVLine(lines[i]);
    if (fields.length < header.length) {
      // pad missing fields with empty strings
      while (fields.length < header.length) fields.push("");
    }
    const clinic_id = fields[idIdx]?.trim();
    if (!clinic_id) {
      errors.push(`row ${i + 1}: missing clinic_id`);
      continue;
    }
    const get = (col: string): string => {
      const j = idxOf(col);
      return j === -1 ? "" : (fields[j] ?? "").trim();
    };
    const tier = get("plan_tier").toLowerCase();
    const row: BulkRow = {
      clinic_id,
      plan_tier: ["trial", "pilot", "paid"].includes(tier) ? (tier as "trial" | "pilot" | "paid") : "trial",
      contact_email: get("contact_email") || undefined,
      line_user_id: get("line_user_id") || undefined,
      monthly_fee_thb: parseNum(get("monthly_fee_thb")),
      monthly_ticket_avg_thb: parseNum(get("monthly_ticket_avg_thb")),
      started_at: get("started_at") || undefined,
      notes: get("notes") || undefined,
    };
    rows.push(row);
  }
  return { rows, errors };
}

function parseCSVLine(line: string): string[] {
  const out: string[] = [];
  let cur = "", inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') { inQ = !inQ; continue; }
    if (c === "," && !inQ) { out.push(cur); cur = ""; continue; }
    cur += c;
  }
  out.push(cur);
  return out;
}

function parseNum(s: string): number | undefined {
  const v = s.replace(/[^0-9.-]/g, "");
  if (!v) return undefined;
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : undefined;
}

function BulkImportForm({ onClose, onDone }: { onClose: () => void; onDone: () => Promise<void> }) {
  const [text, setText] = useState("");
  const [preview, setPreview] = useState<BulkRow[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ imported: number; total: number; results: { clinic_id: string; ok: boolean; reason?: string }[] } | null>(null);

  function doPreview() {
    const { rows, errors } = parseCSV(text);
    setPreview(rows);
    setErrors(errors);
    setResult(null);
  }

  async function doImport() {
    setImporting(true);
    const res = await fetch("/api/admin/partners-bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey() },
      body: JSON.stringify({ rows: preview }),
    });
    const j = await res.json();
    setImporting(false);
    if (res.ok) {
      setResult(j);
      // 1.5초 후 자동 닫기 (성공한 경우)
      if (j.imported === j.total) setTimeout(() => onDone(), 1500);
    } else {
      setErrors([j.error ?? "import failed"]);
    }
  }

  return (
    <div className="bg-gray-900 border border-indigo-500/40 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-indigo-300">Bulk import partners from CSV</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-300 text-xs">✕ Cancel</button>
      </div>

      <div className="text-xs text-gray-500 space-y-1">
        <p>Required column: <code className="text-indigo-300">clinic_id</code>.</p>
        <p>Optional: <code>plan_tier</code> (trial/pilot/paid), <code>contact_email</code>, <code>line_user_id</code>, <code>monthly_fee_thb</code>, <code>monthly_ticket_avg_thb</code>, <code>started_at</code>, <code>notes</code></p>
        <button onClick={() => setText(BULK_TEMPLATE)} className="text-indigo-400 hover:underline">📋 Insert template</button>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste CSV (header row required, comma-separated)..."
        rows={8}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs font-mono text-gray-100 focus:outline-none focus:border-indigo-500"
      />

      <div className="flex gap-2">
        <button onClick={doPreview} disabled={!text.trim()} className="bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-300 transition disabled:opacity-40">Preview</button>
        {preview.length > 0 && (
          <button onClick={doImport} disabled={importing} className="bg-indigo-600 hover:bg-indigo-500 rounded-lg px-4 py-2 text-sm text-white font-semibold transition disabled:opacity-40">
            {importing ? "Importing…" : `Import ${preview.length} partner${preview.length !== 1 ? "s" : ""}`}
          </button>
        )}
      </div>

      {errors.length > 0 && (
        <div className="bg-red-950/40 border border-red-700/40 rounded-lg p-3 text-xs text-red-300 space-y-1">
          {errors.map((e, i) => <div key={i}>⚠ {e}</div>)}
        </div>
      )}

      {preview.length > 0 && !result && (
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-3">
          <p className="text-xs text-gray-500 mb-2">Preview ({preview.length} rows):</p>
          <div className="max-h-48 overflow-auto">
            <table className="w-full text-xs min-w-[480px]">
              <thead className="text-gray-600">
                <tr>
                  <th className="text-left p-1">clinic_id</th>
                  <th className="text-left p-1">tier</th>
                  <th className="text-left p-1">email</th>
                  <th className="text-right p-1">฿/mo</th>
                </tr>
              </thead>
              <tbody>
                {preview.slice(0, 50).map((r, i) => (
                  <tr key={i} className="border-t border-gray-800">
                    <td className="p-1 font-mono text-gray-400 truncate max-w-[200px]">{r.clinic_id}</td>
                    <td className="p-1 text-gray-300">{r.plan_tier}</td>
                    <td className="p-1 text-gray-400">{r.contact_email ?? "—"}</td>
                    <td className="p-1 text-right text-green-400 tabular-nums">{r.monthly_fee_thb?.toLocaleString() ?? "—"}</td>
                  </tr>
                ))}
                {preview.length > 50 && (
                  <tr><td colSpan={4} className="p-1 text-gray-600 text-center">… and {preview.length - 50} more</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {result && (
        <div className={`border rounded-lg p-3 text-xs space-y-1 ${result.imported === result.total ? "bg-green-950/40 border-green-700/40 text-green-300" : "bg-yellow-950/40 border-yellow-700/40 text-yellow-300"}`}>
          <p className="font-semibold">✓ Imported {result.imported} of {result.total} partners</p>
          {result.results.filter((r) => !r.ok).slice(0, 10).map((r, i) => (
            <div key={i} className="text-gray-500">- <span className="font-mono">{r.clinic_id.slice(0, 30)}</span>: {r.reason}</div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Partner sub-components ─────────────────────────────────────────────────

function AddPartnerForm({
  clinicNames, existingIds, onSave, onCancel, saving,
}: {
  clinicNames: ClinicName[];
  existingIds: string[];
  onSave: (p: PartnerRecord) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ClinicName | null>(null);
  const [tier, setTier] = useState<PlanTier>("trial");
  const [email, setEmail] = useState("");
  const [line, setLine] = useState("");
  const [ticket, setTicket] = useState("");
  const [monthlyFee, setMonthlyFee] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim() || selected) return [];
    const q = search.toLowerCase();
    return clinicNames
      .filter((c) => !existingIds.includes(c.id) && (c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)))
      .slice(0, 8);
  }, [search, selected, clinicNames, existingIds]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    onSave({
      clinic_id: selected.id,
      plan_tier: tier,
      contact_email: email || undefined,
      line_user_id: line || undefined,
      monthly_ticket_avg_thb: ticket ? parseInt(ticket, 10) : undefined,
      monthly_fee_thb: monthlyFee ? parseInt(monthlyFee, 10) : undefined,
    });
  }

  return (
    <div className="bg-gray-900 border border-indigo-500/40 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-indigo-300">Add new partner</h3>
        <button onClick={onCancel} className="text-xs text-gray-500 hover:text-gray-300">✕ Close</button>
      </div>

      {/* Step 1: Pick clinic */}
      <div>
        <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 block">
          Step 1 — Find the clinic {selected ? "✓" : ""}
        </label>
        <div className="relative">
          {selected ? (
            <div className="flex items-center justify-between bg-gray-800 rounded-lg px-4 py-2.5 border border-green-500/40">
              <span className="text-sm text-gray-100 truncate">
                <span className="text-green-400 mr-2">✓</span>
                {selected.name}
                <span className="text-gray-500 text-xs ml-2">{selected.city}</span>
              </span>
              <button type="button" onClick={() => { setSelected(null); setSearch(""); }} className="text-gray-500 hover:text-red-400 text-xs ml-2 shrink-0">Change</button>
            </div>
          ) : (
            <>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Type clinic name (e.g., Glam Clinic)..."
                autoFocus
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500"
              />
              {search.trim() && filtered.length === 0 && (
                <p className="text-xs text-orange-400 mt-2">
                  No clinic matches &ldquo;{search}&rdquo;.
                  {existingIds.length > 0 && " (Maybe already a partner?)"}
                </p>
              )}
              {filtered.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-gray-900 border-2 border-indigo-500/60 rounded-xl shadow-2xl overflow-hidden max-h-64 overflow-y-auto">
                  <div className="text-[10px] text-gray-500 px-3 pt-2 pb-1 uppercase tracking-widest">Click a clinic to select</div>
                  {filtered.map((c) => (
                    <button
                      key={c.id} type="button"
                      onClick={() => { setSelected(c); setSearch(""); }}
                      className="w-full text-left px-4 py-2 hover:bg-indigo-900/40 text-sm border-t border-gray-800"
                    >
                      <span className="text-gray-100 font-medium">{c.name}</span>
                      <span className="ml-2 text-gray-500 text-xs">{c.city}</span>
                    </button>
                  ))}
                </div>
              )}
              {!search.trim() && (
                <p className="text-xs text-gray-600 mt-2">
                  💡 Tip: Start typing — clinics appear as you search. Need help finding one? Check the prospect export CSV.
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Step 2 header — visible only when clinic selected */}
      {selected && (
        <div className="border-t border-gray-800 pt-4">
          <label className="text-[10px] uppercase tracking-widest text-gray-500 mb-2 block">
            Step 2 — Set partner details
          </label>
        </div>
      )}

      {selected && (
        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <Field label="Plan tier">
              <select value={tier} onChange={(e) => setTier(e.target.value as PlanTier)} className={SEL_CLS}>
                <option value="trial">Trial (free)</option>
                <option value="pilot">Pilot</option>
                <option value="paid">Paid</option>
              </select>
            </Field>
            <Field label="Monthly fee (฿)">
              <input type="number" value={monthlyFee} onChange={(e) => setMonthlyFee(e.target.value)} placeholder="e.g. 8000" className={INP_CLS} />
            </Field>
            <Field label="Avg ticket (฿)">
              <input type="number" value={ticket} onChange={(e) => setTicket(e.target.value)} placeholder="e.g. 15000" className={INP_CLS} />
            </Field>
          </div>
          <Field label="Contact email (for lead notifications)">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="clinic@example.com" className={INP_CLS} />
          </Field>
          <Field label="LINE user ID (optional)">
            <input value={line} onChange={(e) => setLine(e.target.value)} placeholder="Uxxxxxxxx" className={INP_CLS} />
          </Field>
          <div className="flex gap-2 pt-1">
            <button type="submit" disabled={saving} className={BTN_PRIMARY}>{saving ? "Saving…" : "Add partner"}</button>
            <button type="button" onClick={onCancel} className={BTN_GHOST}>Cancel</button>
          </div>
        </form>
      )}

    </div>
  );
}

function RecordPaymentForm({
  partner, onSave, onCancel, saving,
}: {
  partner: EnrichedPartner;
  onSave: (p: Omit<Payment, "id">) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [amount, setAmount] = useState((partner.monthly_fee_thb ?? 0).toString());
  const [paidAt, setPaidAt] = useState(new Date().toISOString().slice(0, 10));
  const [method, setMethod] = useState<Payment["method"]>("promptpay");
  const [note, setNote] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || !paidAt) return;
    onSave({ amount_thb: parseInt(amount, 10), paid_at: paidAt, method, note: note || undefined });
  }

  return (
    <form onSubmit={submit} className="bg-gray-950 border border-green-700/40 rounded-xl p-4 space-y-3">
      <div className="text-xs uppercase tracking-widest text-green-400 font-semibold">Record payment</div>
      <div className="grid grid-cols-3 gap-3">
        <Field label="Amount (฿)">
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required className={INP_CLS} />
        </Field>
        <Field label="Paid on">
          <input type="date" value={paidAt} onChange={(e) => setPaidAt(e.target.value)} required className={INP_CLS} />
        </Field>
        <Field label="Method">
          <select value={method} onChange={(e) => setMethod(e.target.value as Payment["method"])} className={SEL_CLS}>
            <option value="promptpay">PromptPay</option>
            <option value="bank_transfer">Bank transfer</option>
            <option value="card">Card</option>
            <option value="cash">Cash</option>
            <option value="other">Other</option>
          </select>
        </Field>
      </div>
      <Field label="Note (optional)">
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. June invoice" className={INP_CLS} />
      </Field>
      <div className="flex gap-2">
        <button type="submit" disabled={saving} className={BTN_PRIMARY}>{saving ? "…" : "Save payment"}</button>
        <button type="button" onClick={onCancel} className={BTN_GHOST}>Cancel</button>
      </div>
    </form>
  );
}

function PaymentHistory({ payments, onDelete }: { payments: Payment[]; onDelete: (id: string) => void }) {
  const sorted = [...payments].sort((a, b) => b.paid_at.localeCompare(a.paid_at));
  const total = payments.reduce((s, p) => s + p.amount_thb, 0);
  return (
    <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 space-y-2">
      <div className="text-xs uppercase tracking-widest text-gray-500 font-semibold flex justify-between">
        <span>Payment history</span>
        <span className="text-green-400 normal-case tracking-normal">Total ฿{total.toLocaleString()}</span>
      </div>
      <div className="space-y-1.5">
        {sorted.map((p) => (
          <div key={p.id} className="flex items-center justify-between bg-gray-900 rounded-lg px-3 py-2 text-xs">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="font-mono text-gray-400">{p.paid_at}</span>
              <span className="text-green-400 font-bold">฿{p.amount_thb.toLocaleString()}</span>
              <span className="text-gray-500 uppercase tracking-widest text-[10px]">{p.method.replace("_", " ")}</span>
              {p.note && <span className="text-gray-600 italic">{p.note}</span>}
            </div>
            <button onClick={() => onDelete(p.id)} className="text-gray-700 hover:text-red-400 transition">✕</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function PartnerFieldsEditor({
  partner, onSave,
}: { partner: EnrichedPartner; onSave: (patch: Partial<PartnerRecord>) => Promise<void> }) {
  const [email, setEmail] = useState(partner.contact_email ?? "");
  const [line, setLine] = useState(partner.line_user_id ?? "");
  const [monthlyFee, setMonthlyFee] = useState(partner.monthly_fee_thb?.toString() ?? "");
  const [ticket, setTicket] = useState(partner.monthly_ticket_avg_thb?.toString() ?? "");
  const [notes, setNotes] = useState(partner.notes ?? "");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await onSave({
      contact_email: email || undefined,
      line_user_id: line || undefined,
      monthly_fee_thb: monthlyFee ? parseInt(monthlyFee, 10) : undefined,
      monthly_ticket_avg_thb: ticket ? parseInt(ticket, 10) : undefined,
      notes: notes || undefined,
    });
    setSaving(false);
  }

  return (
    <div className="mt-3 bg-gray-950 border border-gray-800 rounded-xl p-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Field label="Monthly fee (฿)">
          <input type="number" value={monthlyFee} onChange={(e) => setMonthlyFee(e.target.value)} className={INP_CLS} />
        </Field>
        <Field label="Avg ticket (฿)">
          <input type="number" value={ticket} onChange={(e) => setTicket(e.target.value)} className={INP_CLS} />
        </Field>
      </div>
      <Field label="Contact email"><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={INP_CLS} /></Field>
      <Field label="LINE user ID"><input value={line} onChange={(e) => setLine(e.target.value)} className={INP_CLS} /></Field>
      <Field label="Notes (internal)">
        <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} className={`${INP_CLS} resize-y`} />
      </Field>
      <button onClick={save} disabled={saving} className={BTN_PRIMARY}>{saving ? "…" : "Save"}</button>
    </div>
  );
}

// ─── Leads Tab ──────────────────────────────────────────────────────────────

type LeadsSummary = { total: number; by_clinic: { clinic_id: string; count: number }[] };

function LeadsTab({ partners, clinicNames }: { partners: EnrichedPartner[]; clinicNames: ClinicName[] }) {
  const [data, setData] = useState<LeadsSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const nameOf = useCallback(
    (id: string) => {
      const p = partners.find((x) => x.clinic_id === id);
      if (p) return p.clinic_name;
      return clinicNames.find((c) => c.id === id)?.name ?? id;
    },
    [partners, clinicNames]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/admin/leads-summary", { headers: { "x-admin-key": adminKey() } });
      if (!res.ok) { setErr("Unauthorized — re-login"); return; }
      const j = (await res.json()) as LeadsSummary;
      setData(j);
    } catch {
      setErr("Fetch failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="space-y-4">
      {loading && <p className="text-gray-500 text-sm">Loading…</p>}
      {err && <p className="text-red-400 text-sm">{err}</p>}
      {data && (
        <>
          <div className="text-3xl font-bold text-indigo-400">
            {data.total.toLocaleString()} <span className="text-sm text-gray-500 font-normal">total leads</span>
          </div>
          {data.by_clinic.length === 0 && (
            <p className="text-gray-600 text-sm">No leads yet.</p>
          )}
          <div className="space-y-2">
            {data.by_clinic.sort((a, b) => b.count - a.count).map(({ clinic_id, count }) => (
              <div key={clinic_id} className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5">
                <div>
                  <span className="text-sm text-gray-300">{nameOf(clinic_id)}</span>
                  <span className="ml-2 text-xs text-gray-600 font-mono">{clinic_id}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold font-mono text-indigo-300">{count}</span>
                  <a href={`/dashboard/${clinic_id}`} target="_blank" rel="noopener" className="text-xs text-gray-600 hover:text-gray-400 transition">→</a>
                </div>
              </div>
            ))}
          </div>
          <button onClick={load} className="text-xs text-gray-600 hover:text-gray-400 transition">Refresh</button>
        </>
      )}
    </div>
  );
}

// ─── Ads Tab — Redis-backed, no env vars ────────────────────────────────────

type AdTier = "editors_pick" | "recommended" | "featured";

const AD_TIER_META: Record<AdTier, { label: string; color: string; ring: string }> = {
  editors_pick: { label: "Editor's Pick ★", color: "text-yellow-400", ring: "ring-yellow-500/30" },
  recommended:  { label: "Recommended ✓",   color: "text-cyan-400",   ring: "ring-cyan-500/30" },
  featured:     { label: "Featured ◆",      color: "text-purple-400", ring: "ring-purple-500/30" },
};

function AdsTab({ initial, clinicNames }: { initial: SponsoredMap; clinicNames: ClinicName[] }) {
  const [ids, setIds] = useState<SponsoredMap>(initial);
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return clinicNames.filter((c) => c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)).slice(0, 8);
  }, [search, clinicNames]);

  function addId(tier: AdTier, id: string) {
    setIds((prev) => ({ ...prev, [tier]: Array.from(new Set([...prev[tier], id])) }));
    setSearch("");
    setDirty(true);
  }
  function removeId(tier: AdTier, id: string) {
    setIds((prev) => ({ ...prev, [tier]: prev[tier].filter((x) => x !== id) }));
    setDirty(true);
  }

  async function save() {
    setSaving(true);
    const res = await fetch("/api/admin/sponsored", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey() },
      body: JSON.stringify(ids),
    });
    setSaving(false);
    if (res.ok) {
      setSavedAt(new Date().toLocaleTimeString());
      setDirty(false);
    }
  }

  const nameOf = useCallback(
    (id: string) => clinicNames.find((c) => c.id === id)?.name ?? id,
    [clinicNames]
  );

  return (
    <div className="space-y-6">
      {/* Sticky save bar */}
      <div className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">
        <div>
          {dirty ? (
            <span className="text-sm text-orange-400">● Unsaved changes</span>
          ) : savedAt ? (
            <span className="text-sm text-green-400">✓ Saved at {savedAt}</span>
          ) : (
            <span className="text-sm text-gray-500">Changes apply within 5 minutes to public pages.</span>
          )}
        </div>
        <button
          onClick={save}
          disabled={!dirty || saving}
          className={`text-sm font-semibold rounded-lg px-4 py-2 transition ${
            dirty ? "bg-indigo-600 hover:bg-indigo-500 text-white" : "bg-gray-800 text-gray-600 cursor-not-allowed"
          }`}
        >
          {saving ? "Saving…" : "Save & publish"}
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search clinic to add to a sponsored slot…"
          className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500"
        />
        {filtered.length > 0 && (
          <div className="absolute left-0 right-0 top-full mt-1 z-10 bg-gray-900 border border-gray-700 rounded-xl shadow-xl overflow-hidden">
            {filtered.map((c) => (
              <div key={c.id} className="px-4 py-2 hover:bg-gray-800 text-sm">
                <span className="text-gray-200">{c.name}</span>
                <span className="ml-2 text-gray-500 text-xs">{c.city}</span>
                <div className="flex gap-2 mt-1 flex-wrap">
                  {(["editors_pick", "recommended", "featured"] as AdTier[]).map((tier) => (
                    <button
                      key={tier} onClick={() => addId(tier, c.id)}
                      className={`text-xs border border-gray-700 rounded px-2 py-0.5 hover:bg-gray-700 ${AD_TIER_META[tier].color}`}
                    >
                      + {AD_TIER_META[tier].label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tier cards */}
      {(["editors_pick", "recommended", "featured"] as AdTier[]).map((tier) => {
        const meta = AD_TIER_META[tier];
        return (
          <div key={tier} className={`bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3 ring-1 ${meta.ring}`}>
            <span className={`font-semibold text-sm ${meta.color}`}>{meta.label}</span>
            {ids[tier].length === 0 && <p className="text-xs text-gray-600">No clinics in this slot.</p>}
            <div className="space-y-1.5">
              {ids[tier].map((id) => (
                <div key={id} className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-1.5">
                  <div className="text-sm">
                    <span className="text-gray-200">{nameOf(id)}</span>
                    <span className="ml-2 text-gray-600 text-xs font-mono">{id}</span>
                  </div>
                  <button onClick={() => removeId(tier, id)} className="text-gray-600 hover:text-red-400 text-xs ml-4 transition">✕</button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Shared atoms ───────────────────────────────────────────────────────────

const INP_CLS = "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-indigo-500";
const SEL_CLS = "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-indigo-500";
const BTN_PRIMARY = "bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 rounded-lg px-4 py-2 text-sm text-white font-semibold transition";
const BTN_GHOST = "text-sm text-gray-500 hover:text-gray-300 px-4 py-2";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs text-gray-500 mb-1 block">{label}</label>
      {children}
    </div>
  );
}

function BigStat({ label, value, hint, color }: { label: string; value: string; hint?: string; color?: string }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className={`text-xl font-bold ${color ?? "text-gray-100"}`}>{value}</div>
      {hint && <div className="text-[10px] text-gray-600 mt-1 truncate">{hint}</div>}
    </div>
  );
}

// ─── Outreach Tab — Cold sales CRM ──────────────────────────────────────────

type EnrichedClinicCtx = {
  trust_score: number;
  district: string;
  rating: number;
  total_reviews: number;
  unanswered_neg_reviews: number;
  rank_district: number;
  district_total: number;
};

type EnrichedOutreachRecord = OutreachRecord & { enriched: EnrichedClinicCtx | null };

function OutreachTab({ clinicNames }: { clinicNames: ClinicName[] }) {
  const [records, setRecords] = useState<EnrichedOutreachRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "dead" | OutreachOutcome>("active");
  const [search, setSearch] = useState("");
  const [composeFor, setComposeFor] = useState<{ id: string; name: string } | null>(null);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/outreach", {
      cache: "no-store",
      headers: { "x-admin-key": adminKey() },
    });
    setLoading(false);
    if (!res.ok) return;
    const j = (await res.json()) as { records: EnrichedOutreachRecord[] };
    setRecords(j.records);
  }

  useEffect(() => { load(); }, []);

  async function upsert(r: Omit<OutreachRecord, "last_updated">) {
    // Strip enriched (read-only context from API, not part of the persisted record)
    // if it accidentally rode along via {...record} spread in QuickStatusChange.
    const cleaned: Omit<OutreachRecord, "last_updated"> = {
      clinic_id: r.clinic_id,
      clinic_name: r.clinic_name,
      staff: r.staff,
      channel: r.channel,
      template: r.template,
      outcome: r.outcome,
      sent_at: r.sent_at,
      replied_at: r.replied_at,
      next_action: r.next_action,
      note: r.note,
    };
    await fetch("/api/admin/outreach", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey() },
      body: JSON.stringify(cleaned),
    });
    await load();
  }

  async function remove(clinic_id: string) {
    if (!confirm("Remove this outreach record?")) return;
    await fetch("/api/admin/outreach", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey() },
      body: JSON.stringify({ clinic_id }),
    });
    await load();
  }

  const filtered = useMemo(() => {
    let out = records;
    if (filter === "active") {
      out = out.filter((r) => !["dead_not_interested", "dead_no_reply", "dead_hostile", "ghosted", "SIGNED"].includes(r.outcome));
    } else if (filter === "dead") {
      out = out.filter((r) => ["dead_not_interested", "dead_no_reply", "dead_hostile", "ghosted"].includes(r.outcome));
    } else if (filter !== "all") {
      out = out.filter((r) => r.outcome === filter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter((r) => r.clinic_name.toLowerCase().includes(q) || r.clinic_id.toLowerCase().includes(q));
    }
    return out;
  }, [records, filter, search]);

  const stats = useMemo(() => {
    const total = records.length;
    const signed = records.filter((r) => r.outcome === "SIGNED").length;
    const replied = records.filter((r) => ["REPLIED_EN", "HANDOFF_TO_THAI_TEAM", "MEETING_SCHEDULED", "SIGNED", "dead_not_interested", "ghosted"].includes(r.outcome)).length;
    const active = records.filter((r) => !["dead_not_interested", "dead_no_reply", "dead_hostile", "ghosted", "SIGNED"].includes(r.outcome)).length;
    const handoff = records.filter((r) => r.outcome === "HANDOFF_TO_THAI_TEAM").length;
    return { total, signed, replied, active, handoff };
  }, [records]);

  const REPLY_OUTCOMES = ["REPLIED_EN", "HANDOFF_TO_THAI_TEAM", "MEETING_SCHEDULED", "SIGNED", "dead_not_interested", "ghosted"];
  const templateStats = useMemo(() => {
    const groups: Record<string, { sent: number; replied: number; signed: number }> = {};
    for (const r of records) {
      const g = groups[r.template] ?? { sent: 0, replied: 0, signed: 0 };
      g.sent += 1;
      if (REPLY_OUTCOMES.includes(r.outcome)) g.replied += 1;
      if (r.outcome === "SIGNED") g.signed += 1;
      groups[r.template] = g;
    }
    return groups;
  }, [records]);

  return (
    <div className="space-y-5">
      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <BigStat label="Total contacted" value={stats.total.toString()} />
        <BigStat label="Active pipeline" value={stats.active.toString()} hint="not dead or signed" color="text-indigo-400" />
        <BigStat label="Replied" value={stats.replied.toString()} hint={stats.total > 0 ? `${Math.round(stats.replied / stats.total * 100)}% reply rate` : "—"} />
        <BigStat label="Handoffs to Thai" value={stats.handoff.toString()} color="text-amber-400" />
        <BigStat label="✓ Signed" value={stats.signed.toString()} color="text-green-400" hint={stats.total > 0 ? `${Math.round(stats.signed / stats.total * 100)}% close rate` : "—"} />
      </div>

      {/* Template performance — which message gets best reply / close rate */}
      {Object.keys(templateStats).length > 0 && (
        <details className="bg-gray-900 border border-gray-800 rounded-xl">
          <summary className="cursor-pointer px-4 py-3 text-sm font-bold text-gray-300 hover:text-gray-100 flex items-center justify-between">
            <span>📊 Template performance — which one is winning?</span>
            <span className="text-xs text-gray-500">click to expand</span>
          </summary>
          <div className="px-4 pb-4 overflow-x-auto">
            <table className="w-full text-xs min-w-[480px]">
              <thead className="text-gray-600">
                <tr>
                  <th className="text-left p-1.5">Template</th>
                  <th className="text-right p-1.5">Sent</th>
                  <th className="text-right p-1.5">Replied</th>
                  <th className="text-right p-1.5">Reply rate</th>
                  <th className="text-right p-1.5">Signed</th>
                  <th className="text-right p-1.5">Close rate</th>
                </tr>
              </thead>
              <tbody>
                {(["T1", "T2", "T3", "T4", "T5"] as const).map((id) => {
                  const g = templateStats[id];
                  if (!g) return null;
                  const replyPct = g.sent > 0 ? Math.round((g.replied / g.sent) * 100) : 0;
                  const closePct = g.sent > 0 ? Math.round((g.signed / g.sent) * 100) : 0;
                  return (
                    <tr key={id} className="border-t border-gray-800">
                      <td className="p-1.5 text-gray-200 font-mono">{id}</td>
                      <td className="p-1.5 text-right text-gray-300 tabular-nums">{g.sent}</td>
                      <td className="p-1.5 text-right text-blue-300 tabular-nums">{g.replied}</td>
                      <td className={`p-1.5 text-right tabular-nums font-bold ${replyPct >= 30 ? "text-emerald-400" : replyPct >= 15 ? "text-amber-300" : "text-gray-500"}`}>
                        {g.sent > 0 ? `${replyPct}%` : "—"}
                      </td>
                      <td className="p-1.5 text-right text-green-300 tabular-nums">{g.signed}</td>
                      <td className={`p-1.5 text-right tabular-nums font-bold ${closePct >= 10 ? "text-emerald-400" : closePct >= 3 ? "text-amber-300" : "text-gray-500"}`}>
                        {g.sent > 0 ? `${closePct}%` : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="text-[10px] text-gray-600 mt-2">
              Reply ≥ 30% = green, 15-30% = amber. Close ≥ 10% = green, 3-10% = amber. Use the winning template more.
            </p>
          </div>
        </details>
      )}

      {/* Controls */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex gap-2 items-center flex-wrap">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clinic name…"
            className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-100 w-48 focus:outline-none focus:border-indigo-500"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as "all" | "active" | "dead" | OutreachOutcome)}
            className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-100 focus:outline-none"
          >
            <option value="active">Active pipeline</option>
            <option value="all">All records</option>
            <option value="dead">Dead</option>
            <option value="SIGNED">✓ Signed</option>
            <option value="REPLIED_EN">Replied (EN)</option>
            <option value="HANDOFF_TO_THAI_TEAM">Handoff → Thai</option>
            <option value="MEETING_SCHEDULED">Meeting set</option>
            <option value="sent">Sent (no reply yet)</option>
          </select>
        </div>
        <button onClick={() => setShowAdd(true)} className="bg-indigo-600 hover:bg-indigo-500 rounded-lg px-4 py-1.5 text-sm text-white font-semibold transition">
          + Log outreach
        </button>
      </div>

      {showAdd && (
        <OutreachLogForm
          clinicNames={clinicNames}
          onSave={async (r) => { await upsert(r); setShowAdd(false); }}
          onCancel={() => setShowAdd(false)}
        />
      )}

      {loading && <p className="text-gray-500 text-sm">Loading…</p>}
      {!loading && filtered.length === 0 && (
        <p className="text-gray-600 text-sm py-8 text-center">No records match. Click + Log outreach to add the first one.</p>
      )}

      <div className="space-y-2">
        {filtered.map((r) => {
          const meta = OUTCOME_META[r.outcome];
          return (
            <div key={r.clinic_id} className={`border rounded-xl p-3 ${meta.bg}`}>
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${meta.color}`}>{meta.label}</span>
                    <span className="font-semibold text-gray-100 truncate">{r.clinic_name}</span>
                    <span className="text-[10px] text-gray-500 font-mono">{r.template}</span>
                    <span className="text-[10px] text-gray-500">{r.channel}</span>
                    {r.enriched && (
                      <>
                        <span className={`text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded ${r.enriched.trust_score >= 75 ? "bg-emerald-900/40 text-emerald-300" : r.enriched.trust_score >= 50 ? "bg-amber-900/40 text-amber-300" : "bg-gray-800 text-gray-500"}`}>
                          Trust {r.enriched.trust_score}
                        </span>
                        {r.enriched.rank_district > 0 && (
                          <span className="text-[10px] text-gray-500 tabular-nums">
                            #{r.enriched.rank_district}/{r.enriched.district_total} in {r.enriched.district || "area"}
                          </span>
                        )}
                        {r.enriched.unanswered_neg_reviews >= 3 && (
                          <span className="text-[10px] font-bold tabular-nums px-1.5 py-0.5 rounded bg-red-900/40 text-red-300">
                            🚨 {r.enriched.unanswered_neg_reviews} unanswered negs
                          </span>
                        )}
                      </>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 flex flex-wrap gap-3">
                    <span>Sent {r.sent_at.slice(0, 10)}</span>
                    {r.replied_at && <span className="text-blue-300">Replied {r.replied_at.slice(0, 10)}</span>}
                    {r.staff && <span>by {r.staff}</span>}
                    {r.next_action && <span className="text-orange-300">Next: {r.next_action}</span>}
                  </div>
                  {r.note && <p className="text-xs text-gray-400 mt-1.5 italic">&ldquo;{r.note}&rdquo;</p>}
                </div>
                <div className="flex gap-1 items-center">
                  <button
                    onClick={() => setComposeFor({ id: r.clinic_id, name: r.clinic_name })}
                    title="Compose new outreach"
                    className="text-xs px-2 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white"
                  >
                    📩
                  </button>
                  <a
                    href={`/dashboard/${r.clinic_id}`}
                    target="_blank"
                    rel="noopener"
                    title="Preview clinic dashboard"
                    className="text-xs px-2 py-1 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-700"
                  >
                    👁
                  </a>
                  <QuickStatusChange record={r} onSave={upsert} />
                  <button onClick={() => remove(r.clinic_id)} className="text-gray-600 hover:text-red-400 text-xs ml-1 px-2">✕</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {composeFor && (
        <ComposeOutreachModal
          clinicId={composeFor.id}
          clinicName={composeFor.name}
          onClose={() => setComposeFor(null)}
          onSent={() => { setComposeFor(null); load(); }}
        />
      )}
    </div>
  );
}

function QuickStatusChange({ record, onSave }: { record: OutreachRecord; onSave: (r: Omit<OutreachRecord, "last_updated">) => Promise<void> }) {
  return (
    <select
      value={record.outcome}
      onChange={(e) => {
        const next = e.target.value as OutreachOutcome;
        const patch: Omit<OutreachRecord, "last_updated"> = {
          ...record,
          outcome: next,
        };
        if (["REPLIED_EN", "HANDOFF_TO_THAI_TEAM", "MEETING_SCHEDULED", "SIGNED"].includes(next) && !record.replied_at) {
          patch.replied_at = new Date().toISOString();
        }
        onSave(patch);
      }}
      onClick={(e) => e.stopPropagation()}
      className="bg-gray-950 border border-gray-700 rounded text-[10px] px-1 py-0.5 text-gray-300"
    >
      {(Object.keys(OUTCOME_META) as OutreachOutcome[]).map((k) => (
        <option key={k} value={k}>{OUTCOME_META[k].label}</option>
      ))}
    </select>
  );
}

function OutreachLogForm({
  clinicNames, onSave, onCancel,
}: {
  clinicNames: ClinicName[];
  onSave: (r: Omit<OutreachRecord, "last_updated">) => Promise<void>;
  onCancel: () => void;
}) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ClinicName | null>(null);
  const [staff, setStaff] = useState(() =>
    typeof window === "undefined" ? "" : localStorage.getItem("outreach_staff_name") ?? ""
  );
  const [channel, setChannel] = useState<OutreachRecord["channel"]>("LINE");
  const [template, setTemplate] = useState<OutreachRecord["template"]>("T1");
  const [outcome, setOutcome] = useState<OutreachOutcome>("sent");
  const [note, setNote] = useState("");
  const [nextAction, setNextAction] = useState("Follow up in 3 days");

  useEffect(() => {
    if (staff && typeof window !== "undefined") {
      localStorage.setItem("outreach_staff_name", staff);
    }
  }, [staff]);

  const filtered = useMemo(() => {
    if (!search.trim() || selected) return [];
    const q = search.toLowerCase();
    return clinicNames.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 8);
  }, [search, selected, clinicNames]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    onSave({
      clinic_id: selected.id,
      clinic_name: selected.name,
      staff: staff || undefined,
      channel, template, outcome,
      sent_at: new Date().toISOString(),
      next_action: nextAction || undefined,
      note: note || undefined,
    });
  }

  return (
    <div className="bg-gray-900 border border-indigo-500/40 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-indigo-300">Log a new outreach</h3>
        <button onClick={onCancel} className="text-xs text-gray-500 hover:text-gray-300">✕</button>
      </div>

      <div className="relative">
        {selected ? (
          <div className="flex items-center justify-between bg-gray-800 rounded-lg px-4 py-2">
            <span className="text-sm text-gray-100">{selected.name} <span className="text-gray-500 text-xs">{selected.city}</span></span>
            <button onClick={() => { setSelected(null); setSearch(""); }} className="text-gray-500 hover:text-red-400 text-xs">✕</button>
          </div>
        ) : (
          <>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search clinic by name…"
              autoFocus
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100"
            />
            {filtered.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 z-10 bg-gray-900 border border-gray-700 rounded-xl shadow-xl overflow-hidden max-h-52 overflow-y-auto">
                {filtered.map((c) => (
                  <button key={c.id} type="button" onClick={() => setSelected(c)}
                    className="w-full text-left px-3 py-2 hover:bg-gray-800 text-sm">
                    <span className="text-gray-200">{c.name}</span>
                    <span className="ml-2 text-gray-500 text-xs">{c.city}</span>
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {selected && (
        <form onSubmit={submit} className="space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Field label="Channel">
              <select value={channel} onChange={(e) => setChannel(e.target.value as OutreachRecord["channel"])} className={SEL_CLS}>
                <option value="LINE">LINE</option>
                <option value="FB_MESSENGER">FB Messenger</option>
                <option value="WEBSITE_FORM">Website form</option>
                <option value="EMAIL">Email</option>
                <option value="OTHER">Other</option>
              </select>
            </Field>
            <Field label="Template used">
              <select value={template} onChange={(e) => setTemplate(e.target.value as OutreachRecord["template"])} className={SEL_CLS}>
                <option value="T1">T1 (first contact)</option>
                <option value="T2">T2 (alt phrasing)</option>
                <option value="T3">T3 (urgent / neg review)</option>
                <option value="T4">T4 (follow-up)</option>
                <option value="T5">T5 (closing)</option>
              </select>
            </Field>
            <Field label="Outcome">
              <select value={outcome} onChange={(e) => setOutcome(e.target.value as OutreachOutcome)} className={SEL_CLS}>
                {(Object.keys(OUTCOME_META) as OutreachOutcome[]).map((k) => (
                  <option key={k} value={k}>{OUTCOME_META[k].label}</option>
                ))}
              </select>
            </Field>
            <Field label="Your name (optional)">
              <input value={staff} onChange={(e) => setStaff(e.target.value)} placeholder="e.g. John" className={INP_CLS} />
            </Field>
          </div>
          <Field label="Next action">
            <input value={nextAction} onChange={(e) => setNextAction(e.target.value)} className={INP_CLS} />
          </Field>
          <Field label="Note (optional)">
            <textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)} className={`${INP_CLS} resize-y`} placeholder="What did they say? Any context for next time?" />
          </Field>
          <div className="flex gap-2">
            <button type="submit" className={BTN_PRIMARY}>Save outreach record</button>
            <button type="button" onClick={onCancel} className={BTN_GHOST}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}
