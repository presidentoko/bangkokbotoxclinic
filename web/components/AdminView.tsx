"use client";
import { useState, useCallback, useMemo, useEffect } from "react";

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

const TABS = ["Overview", "Partners", "Leads", "Ads"] as const;
type Tab = (typeof TABS)[number];

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
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 tracking-widest uppercase">bangkokbotoxclinic · admin</span>
        <span className="text-xs text-gray-600">{new Date().toISOString().slice(0, 10)}</span>
      </div>

      <div className="flex gap-1 border-b border-gray-800">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition ${
              tab === t ? "bg-gray-800 text-white" : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Overview" && <OverviewTab db={db} partners={partners} />}
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
      headers: { "Content-Type": "application/json" },
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
          <div className="max-h-48 overflow-y-auto">
            <table className="w-full text-xs">
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
      <h3 className="text-sm font-semibold text-indigo-300">Add new partner</h3>
      <div className="relative">
        {selected ? (
          <div className="flex items-center justify-between bg-gray-800 rounded-lg px-4 py-2">
            <span className="text-sm text-gray-100">{selected.name} <span className="text-gray-500 text-xs">{selected.city}</span></span>
            <button onClick={() => { setSelected(null); setSearch(""); }} className="text-gray-500 hover:text-red-400 text-xs ml-4">✕</button>
          </div>
        ) : (
          <>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search clinic by name…"
              autoFocus
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-indigo-500"
            />
            {filtered.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1 z-10 bg-gray-900 border border-gray-700 rounded-xl shadow-xl overflow-hidden max-h-52 overflow-y-auto">
                {filtered.map((c) => (
                  <button
                    key={c.id} type="button"
                    onClick={() => setSelected(c)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-800 text-sm"
                  >
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

      {!selected && (
        <div className="flex justify-end">
          <button onClick={onCancel} className={BTN_GHOST}>Cancel</button>
        </div>
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
