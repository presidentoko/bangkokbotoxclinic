"use client";
// Comprehensive admin dashboard — your control room for the directory business.
// Tabs: Overview · Directory (issue tokens) · Partners (CRUD) · Leads · Outreach pipeline.

import { useEffect, useMemo, useState } from "react";
import type { ClinicPartner, PartnerStatus } from "@/lib/partnerStore";
import { STAGE_META, type OutreachEntry, type OutreachStage } from "@/lib/outreachStore";
import type { LeadRecord } from "@/lib/leadStore";
import type { Payment } from "@/lib/paymentStore";
import PromptPayQR from "./PromptPayQR";

type DirEntry = {
  id: string;
  name: string;
  city: string;
  trust: number;
  rating: number | null;
  reviews: number | null;
  is_partner: boolean;
};
type Stats = { generated_at: string; total: number; avg_trust: number };
type SiteStats = {
  clinics_total: number; clinics_hair: number; avg_trust: number;
  partners_total: number; partners_active: number; partners_trial: number;
  mrr_thb: number;
  outreach_open: number; outreach_won: number;
  newsletter_subscribers: number; leads_sampled: number;
};

type Tab = "overview" | "directory" | "partners" | "leads" | "outreach" | "payments";

export default function AdminView({
  stats, directory, partners: initialPartners,
}: {
  stats: Stats;
  directory: DirEntry[];
  partners: ClinicPartner[];
}) {
  const [tab, setTab] = useState<Tab>("overview");
  const [q, setQ] = useState("");
  const [partners, setPartners] = useState<ClinicPartner[]>(initialPartners);
  const [outreach, setOutreach] = useState<OutreachEntry[]>([]);
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [site, setSite] = useState<SiteStats | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [paySummary, setPaySummary] = useState<{ count: number; total_thb: number } | null>(null);
  const [qrFor, setQrFor] = useState<{ clinic_id: string; clinic_name?: string; amount: number } | null>(null);
  const [tokenById, setTokenById] = useState<Record<string, { token?: string; loading?: boolean; copied?: boolean; error?: string }>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (tab === "overview") fetch("/api/admin/stats").then((r) => r.json()).then((d) => d.ok && setSite(d));
    if (tab === "leads")    fetch("/api/admin/leads-summary").then((r) => r.json()).then((d) => d.ok && setLeads(d.leads));
    if (tab === "outreach") fetch("/api/admin/outreach").then((r) => r.json()).then((d) => d.ok && setOutreach(d.entries));
    if (tab === "payments") fetch("/api/admin/payments").then((r) => r.json()).then((d) => { if (d.ok) { setPayments(d.payments); setPaySummary(d.summary_30d); } });
  }, [tab]);

  async function recordPayment(clinic_id: string, amount_thb: number, method: "promptpay" | "bank_transfer" | "cash" | "other" = "promptpay", reference?: string) {
    setBusy(true);
    await fetch("/api/admin/payments", { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clinic_id, amount_thb, method, reference }) });
    const d = await fetch("/api/admin/payments").then((r) => r.json());
    if (d.ok) { setPayments(d.payments); setPaySummary(d.summary_30d); }
    setBusy(false);
    // Also bump partner status to active
    updatePartnerLocal(clinic_id, { status: "active" });
  }

  const partnerIds = useMemo(() => new Set(partners.map((p) => p.clinic_id)), [partners]);

  const filteredDir = useMemo(() => {
    if (!q.trim()) return directory.slice(0, 80);
    const needle = q.toLowerCase();
    return directory.filter((d) => d.name.toLowerCase().includes(needle) || d.city.toLowerCase().includes(needle) || d.id.includes(needle)).slice(0, 80);
  }, [q, directory]);

  async function issueToken(id: string) {
    setTokenById((s) => ({ ...s, [id]: { ...s[id], loading: true, error: undefined } }));
    try {
      const r = await fetch("/api/admin/access", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clinic_id: id }),
      });
      if (!r.ok) throw new Error("issue failed");
      const j = (await r.json()) as { token: string };
      setTokenById((s) => ({ ...s, [id]: { token: j.token, loading: false } }));
    } catch (e) {
      setTokenById((s) => ({ ...s, [id]: { loading: false, error: e instanceof Error ? e.message : "error" } }));
    }
  }
  async function revokeToken(id: string) {
    if (!confirm("Revoke token? Existing link stops working.")) return;
    await fetch("/api/admin/access", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clinic_id: id }) });
    setTokenById((s) => ({ ...s, [id]: {} }));
  }
  async function copyLink(id: string) {
    const t = tokenById[id]?.token; if (!t) return;
    const url = `${location.origin}/dashboard/${id}/?k=${t}`;
    await navigator.clipboard.writeText(url);
    setTokenById((s) => ({ ...s, [id]: { ...s[id], copied: true } }));
    setTimeout(() => setTokenById((s) => ({ ...s, [id]: { ...s[id], copied: false } })), 1500);
  }

  async function addPartner(p: ClinicPartner) {
    setBusy(true);
    const r = await fetch("/api/admin/partners", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(p) });
    setBusy(false);
    if (!r.ok) { alert("Failed: " + (await r.text())); return; }
    setPartners((cur) => [...cur, p]);
  }
  async function updatePartnerLocal(clinic_id: string, patch: Partial<ClinicPartner>) {
    setBusy(true);
    const r = await fetch("/api/admin/partners", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clinic_id, ...patch }) });
    setBusy(false);
    if (!r.ok) { alert("Update failed"); return; }
    setPartners((cur) => cur.map((p) => p.clinic_id === clinic_id ? { ...p, ...patch } : p));
  }
  async function removePartnerLocal(clinic_id: string) {
    if (!confirm("Remove partner status?")) return;
    setBusy(true);
    await fetch("/api/admin/partners", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clinic_id }) });
    setBusy(false);
    setPartners((cur) => cur.filter((p) => p.clinic_id !== clinic_id));
  }

  async function updateOutreach(clinic_id: string, patch: Partial<OutreachEntry>) {
    await fetch("/api/admin/outreach", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clinic_id, ...patch }) });
    setOutreach((cur) => {
      const idx = cur.findIndex((r) => r.clinic_id === clinic_id);
      if (idx === -1) return [...cur, { clinic_id, stage: "cold", last_touched_at: new Date().toISOString(), ...patch } as OutreachEntry];
      const next = [...cur];
      next[idx] = { ...next[idx], ...patch, last_touched_at: new Date().toISOString() };
      return next;
    });
  }
  async function removeOutreachLocal(clinic_id: string) {
    if (!confirm("Remove from pipeline?")) return;
    await fetch("/api/admin/outreach", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clinic_id }) });
    setOutreach((cur) => cur.filter((r) => r.clinic_id !== clinic_id));
  }

  async function signOut() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    location.reload();
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-[11px] font-black uppercase tracking-widest text-clinic">Admin · Owner mode</div>
          <h1 className="mt-1 font-display text-2xl font-bold tracking-tighter-display">Directory control room</h1>
          <p className="text-xs muted mt-1">
            {stats.total} clinics · avg trust {stats.avg_trust} · data {new Date(stats.generated_at).toLocaleDateString()}
          </p>
        </div>
        <button onClick={signOut} className="text-xs muted hover:text-red-500">Sign out →</button>
      </header>

      <div className="mb-5 flex gap-1.5 overflow-x-auto -mx-4 px-4 pb-1">
        {([
          { v: "overview",  emoji: "📊", label: "Overview" },
          { v: "directory", emoji: "🏥", label: `Directory · ${directory.length}` },
          { v: "partners",  emoji: "🤝", label: `Partners · ${partners.length}` },
          { v: "leads",     emoji: "📨", label: "Leads" },
          { v: "outreach",  emoji: "📞", label: "Outreach" },
          { v: "payments",  emoji: "💳", label: "Payments" },
        ] as { v: Tab; emoji: string; label: string }[]).map((t) => (
          <button key={t.v} onClick={() => setTab(t.v)}
            className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-bold transition ${
              tab === t.v ? "bg-navy-900 text-white dark:bg-gold-400 dark:text-navy-950" : "border bg-[rgb(var(--bg-elev))] hover:border-navy-700"
            }`}
            style={tab !== t.v ? { borderColor: "rgb(var(--border))" } : {}}>
            <span className="mr-1.5">{t.emoji}</span>{t.label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <section className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { label: "MRR",             value: `฿${(site?.mrr_thb ?? 0).toLocaleString()}`, color: "#059669", emoji: "💰" },
              { label: "Active partners", value: site?.partners_active ?? 0,                  color: "#7c3aed", emoji: "🤝" },
              { label: "Trial partners",  value: site?.partners_trial ?? 0,                   color: "#0891b2", emoji: "🆓" },
              { label: "Outreach open",   value: site?.outreach_open ?? 0,                    color: "#d97706", emoji: "📞" },
              { label: "Newsletter subs", value: (site?.newsletter_subscribers ?? 0).toLocaleString(), color: "#dc2626", emoji: "📧" },
              { label: "Hair clinics",    value: (site?.clinics_hair ?? 0).toLocaleString(),   color: "#475569", emoji: "💇" },
            ].map((k) => (
              <div key={k.label} className="card p-4">
                <div className="text-[10px] font-bold uppercase tracking-widest muted mb-1">{k.label}</div>
                <div className="font-display text-2xl font-bold tabular-nums" style={{ color: k.color }}>
                  <span className="mr-1">{k.emoji}</span>{k.value}
                </div>
              </div>
            ))}
          </div>

          <div className="card p-5">
            <h3 className="font-bold text-sm uppercase tracking-wider muted mb-3">Quick actions</h3>
            <div className="grid gap-2 sm:grid-cols-3">
              <button onClick={() => setTab("directory")} className="rounded-xl border bg-[rgb(var(--bg-elev))] p-3 text-left hover:border-navy-700" style={{ borderColor: "rgb(var(--border))" }}>
                <div className="text-lg mb-1">🔑</div>
                <div className="font-bold text-sm">Issue dashboard token</div>
                <div className="text-xs muted">Give a clinic owner access</div>
              </button>
              <button onClick={() => setTab("partners")} className="rounded-xl border bg-[rgb(var(--bg-elev))] p-3 text-left hover:border-navy-700" style={{ borderColor: "rgb(var(--border))" }}>
                <div className="text-lg mb-1">💳</div>
                <div className="font-bold text-sm">Add paying partner</div>
                <div className="text-xs muted">Activate a new paid clinic</div>
              </button>
              <button onClick={() => setTab("outreach")} className="rounded-xl border bg-[rgb(var(--bg-elev))] p-3 text-left hover:border-navy-700" style={{ borderColor: "rgb(var(--border))" }}>
                <div className="text-lg mb-1">📋</div>
                <div className="font-bold text-sm">Outreach pipeline</div>
                <div className="text-xs muted">{site?.outreach_open ?? 0} prospects open</div>
              </button>
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-bold text-sm uppercase tracking-wider muted mb-3">Recent partners</h3>
            {partners.length === 0 ? (
              <p className="text-sm muted">No partners yet. Go to Partners tab to add one.</p>
            ) : (
              <ul className="divide-y" style={{ borderColor: "rgb(var(--border))" }}>
                {partners.slice(0, 5).map((p) => (
                  <li key={p.clinic_id} className="py-2 flex items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-sm font-mono">{p.clinic_id.slice(0, 24)}…</div>
                      <div className="text-xs muted">{p.plan_tier} · {p.status ?? "active"} · ฿{(p.monthly_fee_thb ?? 0).toLocaleString()}/mo</div>
                    </div>
                    <span className="text-[10px] muted">since {p.started_at}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {tab === "directory" && (
        <section>
          <input value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search clinic name, city, or ID…"
            className="w-full rounded-lg border bg-transparent px-3 py-2.5 text-sm mb-4"
            style={{ borderColor: "rgb(var(--border))" }} />
          <div className="card p-0 overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b text-left text-[10px] uppercase tracking-wider muted" style={{ borderColor: "rgb(var(--border))" }}>
                  <th className="p-3">Clinic</th>
                  <th className="p-3">City</th>
                  <th className="p-3 tabular-nums">Trust</th>
                  <th className="p-3 tabular-nums">Rating</th>
                  <th className="p-3">Dashboard token</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "rgb(var(--border))" }}>
                {filteredDir.map((d) => {
                  const t = tokenById[d.id] ?? {};
                  return (
                    <tr key={d.id}>
                      <td className="p-3">
                        <div className="font-semibold flex items-center gap-2">
                          {d.name}
                          {partnerIds.has(d.id) && <span className="rounded bg-emerald-100 text-emerald-800 px-1.5 py-0.5 text-[9px] font-bold uppercase">Partner</span>}
                          {d.is_partner && !partnerIds.has(d.id) && <span className="rounded bg-blue-100 text-blue-800 px-1.5 py-0.5 text-[9px] font-bold uppercase">Verified</span>}
                        </div>
                        <div className="text-[10px] muted font-mono mt-0.5">{d.id}</div>
                      </td>
                      <td className="p-3 muted">{d.city}</td>
                      <td className="p-3 tabular-nums font-bold">{d.trust}</td>
                      <td className="p-3 tabular-nums">{d.rating?.toFixed(1) ?? "—"}</td>
                      <td className="p-3">
                        {t.token ? (
                          <div className="flex flex-wrap items-center gap-2">
                            <button onClick={() => copyLink(d.id)} className="rounded bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-700">
                              {t.copied ? "✓ Copied!" : "📋 Copy link"}
                            </button>
                            <a href={`/dashboard/${d.id}/?k=${t.token}`} target="_blank" className="text-[11px] underline muted" rel="noreferrer">Open</a>
                            <button onClick={() => revokeToken(d.id)} className="text-[11px] muted hover:text-red-500">Revoke</button>
                          </div>
                        ) : (
                          <button onClick={() => issueToken(d.id)} disabled={t.loading}
                            className="rounded border px-2.5 py-1 text-[11px] font-bold hover:bg-slate-50 disabled:opacity-50"
                            style={{ borderColor: "rgb(var(--border))" }}>
                            {t.loading ? "Issuing…" : "🔑 Issue token"}
                          </button>
                        )}
                        {t.error && <div className="mt-1 text-[10px] text-red-600">{t.error}</div>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {tab === "partners" && (
        <section>
          <PartnerForm onAdd={addPartner} busy={busy} />
          <div className="mt-5 card p-0 overflow-x-auto">
            <table className="w-full min-w-[680px] text-sm">
              <thead>
                <tr className="border-b text-left text-[10px] uppercase tracking-wider muted" style={{ borderColor: "rgb(var(--border))" }}>
                  <th className="p-3">Clinic ID</th>
                  <th className="p-3">Plan</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 tabular-nums">฿/mo</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Since</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "rgb(var(--border))" }}>
                {partners.length === 0 ? (
                  <tr><td colSpan={7} className="p-8 text-center muted text-sm">No partners. Use the form above.</td></tr>
                ) : partners.map((p) => (
                  <tr key={p.clinic_id}>
                    <td className="p-3 font-mono text-[11px]">{p.clinic_id.slice(0, 28)}…</td>
                    <td className="p-3">
                      <select value={p.plan_tier} onChange={(e) => updatePartnerLocal(p.clinic_id, { plan_tier: e.target.value as ClinicPartner["plan_tier"] })}
                        className="rounded border bg-transparent px-2 py-1 text-xs" style={{ borderColor: "rgb(var(--border))" }}>
                        <option value="trial">trial</option><option value="pilot">pilot</option><option value="paid">paid</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <select value={p.status ?? "active"} onChange={(e) => updatePartnerLocal(p.clinic_id, { status: e.target.value as PartnerStatus })}
                        className="rounded border bg-transparent px-2 py-1 text-xs" style={{ borderColor: "rgb(var(--border))" }}>
                        <option value="active">active</option><option value="trial">trial</option><option value="overdue">overdue</option><option value="churned">churned</option>
                      </select>
                    </td>
                    <td className="p-3">
                      <input type="number" defaultValue={p.monthly_fee_thb ?? 0}
                        onBlur={(e) => updatePartnerLocal(p.clinic_id, { monthly_fee_thb: Number(e.target.value) || 0 })}
                        className="w-20 rounded border bg-transparent px-2 py-1 text-xs tabular-nums" style={{ borderColor: "rgb(var(--border))" }} />
                    </td>
                    <td className="p-3 text-[11px] muted">{p.contact_email ?? "—"}</td>
                    <td className="p-3 text-[11px] muted">{p.started_at}</td>
                    <td className="p-3 flex gap-2 flex-wrap">
                      <button onClick={() => setQrFor({ clinic_id: p.clinic_id, amount: p.monthly_fee_thb ?? 8000 })}
                        className="text-[11px] text-emerald-600 hover:underline">📱 QR</button>
                      <button onClick={() => recordPayment(p.clinic_id, p.monthly_fee_thb ?? 8000)}
                        className="text-[11px] text-blue-600 hover:underline">✓ Mark paid</button>
                      <button onClick={() => removePartnerLocal(p.clinic_id)} className="text-[11px] text-red-600 hover:underline">Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {tab === "leads" && (
        <section>
          <div className="card p-0 overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b text-left text-[10px] uppercase tracking-wider muted" style={{ borderColor: "rgb(var(--border))" }}>
                  <th className="p-3">When</th>
                  <th className="p-3">Lead</th>
                  <th className="p-3">Clinic</th>
                  <th className="p-3">Procedure</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "rgb(var(--border))" }}>
                {leads.length === 0 ? (
                  <tr><td colSpan={4} className="p-8 text-center muted text-sm">Loading leads…</td></tr>
                ) : leads.map((l) => (
                  <tr key={l.id}>
                    <td className="p-3 text-xs muted tabular-nums">{new Date(l.at).toLocaleDateString()} {new Date(l.at).toLocaleTimeString().slice(0, 5)}</td>
                    <td className="p-3">
                      <div className="font-semibold">{l.name || "(no name)"}</div>
                      <div className="text-xs muted">{l.email} {l.phone && `· ${l.phone}`}</div>
                    </td>
                    <td className="p-3 text-xs">{l.clinic_name || l.clinic_id.slice(0, 16)}</td>
                    <td className="p-3 text-xs muted">{l.procedure || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {tab === "payments" && (
        <section className="space-y-5">
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="card p-4">
              <div className="text-[10px] font-bold uppercase tracking-widest muted mb-1">Last 30 days</div>
              <div className="font-display text-2xl font-bold tabular-nums text-emerald-700">฿{(paySummary?.total_thb ?? 0).toLocaleString()}</div>
              <div className="text-xs muted">{paySummary?.count ?? 0} payments</div>
            </div>
            <div className="card p-4 sm:col-span-2 flex items-center gap-3">
              <span className="text-2xl">💡</span>
              <p className="text-xs muted leading-relaxed">
                Show QR (Partners tab → 📱) to clinic owner. They scan, transfer, send screenshot. Click "✓ Mark paid" to confirm + auto-activate dashboard.
              </p>
            </div>
          </div>
          <div className="card p-0 overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b text-left text-[10px] uppercase tracking-wider muted" style={{ borderColor: "rgb(var(--border))" }}>
                  <th className="p-3">When</th>
                  <th className="p-3">Clinic</th>
                  <th className="p-3 tabular-nums">฿</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "rgb(var(--border))" }}>
                {payments.length === 0 ? (
                  <tr><td colSpan={5} className="p-8 text-center muted text-sm">No payments recorded yet</td></tr>
                ) : payments.map((p) => (
                  <tr key={p.id}>
                    <td className="p-3 text-xs muted tabular-nums">{new Date(p.paid_at).toLocaleDateString()}</td>
                    <td className="p-3 font-mono text-[11px]">{p.clinic_id.slice(0, 28)}…</td>
                    <td className="p-3 font-bold tabular-nums text-emerald-700">฿{p.amount_thb.toLocaleString()}</td>
                    <td className="p-3 text-xs muted">{p.method}</td>
                    <td className="p-3 text-[11px] font-mono muted">{p.reference || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* QR modal */}
      {qrFor && (
        <>
          <div className="fixed inset-0 z-50 bg-black/60" onClick={() => setQrFor(null)} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[92vw] max-w-lg max-h-[90vh] overflow-y-auto">
            <PromptPayQR amountTHB={qrFor.amount} reference={qrFor.clinic_id.slice(0, 16)} />
            <button onClick={() => setQrFor(null)} className="mt-3 w-full rounded-lg bg-slate-900 text-white py-2 text-sm font-bold">Close</button>
          </div>
        </>
      )}

      {tab === "outreach" && (
        <section>
          <OutreachAdd directory={directory} onAdd={updateOutreach} />
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(Object.keys(STAGE_META) as OutreachStage[]).map((stage) => {
              const inStage = outreach.filter((o) => o.stage === stage);
              return (
                <div key={stage} className="card p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                      style={{ background: STAGE_META[stage].bg, color: STAGE_META[stage].color }}>
                      {STAGE_META[stage].label}
                    </span>
                    <span className="text-xs font-bold tabular-nums">{inStage.length}</span>
                  </div>
                  <ul className="space-y-2">
                    {inStage.map((o) => {
                      const dir = directory.find((d) => d.id === o.clinic_id);
                      return (
                        <li key={o.clinic_id} className="rounded-lg border bg-[rgb(var(--bg))] p-2.5" style={{ borderColor: "rgb(var(--border))" }}>
                          <div className="font-bold text-xs">{dir?.name ?? o.clinic_id.slice(0, 20)}</div>
                          <div className="text-[10px] muted mt-0.5">{o.contact_email ?? "—"}</div>
                          {o.note && <p className="text-[11px] mt-1.5">{o.note}</p>}
                          <div className="flex items-center gap-1.5 mt-2">
                            <select value={o.stage} onChange={(e) => updateOutreach(o.clinic_id, { stage: e.target.value as OutreachStage })}
                              className="flex-1 rounded border bg-transparent px-1.5 py-0.5 text-[10px]" style={{ borderColor: "rgb(var(--border))" }}>
                              {(Object.keys(STAGE_META) as OutreachStage[]).map((s) => <option key={s} value={s}>{STAGE_META[s].label}</option>)}
                            </select>
                            <button onClick={() => removeOutreachLocal(o.clinic_id)} className="text-[10px] text-red-600">✕</button>
                          </div>
                        </li>
                      );
                    })}
                    {inStage.length === 0 && <li className="text-[10px] muted text-center py-2">—</li>}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}

function PartnerForm({ onAdd, busy }: { onAdd: (p: ClinicPartner) => void | Promise<void>; busy: boolean }) {
  const [f, setF] = useState<ClinicPartner>({ clinic_id: "", plan_tier: "paid", status: "active", monthly_fee_thb: 8000, contact_email: "" });
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!f.clinic_id.trim()) return;
    onAdd(f);
    setF({ clinic_id: "", plan_tier: "paid", status: "active", monthly_fee_thb: 8000, contact_email: "" });
  }
  return (
    <form onSubmit={submit} className="card p-4">
      <h3 className="font-bold text-sm uppercase tracking-wider muted mb-3">Add partner</h3>
      <div className="grid sm:grid-cols-5 gap-2">
        <input required placeholder="clinic_id (from directory)" value={f.clinic_id} onChange={(e) => setF({ ...f, clinic_id: e.target.value })}
          className="sm:col-span-2 rounded border bg-transparent px-2 py-1.5 text-xs font-mono" style={{ borderColor: "rgb(var(--border))" }} />
        <select value={f.plan_tier} onChange={(e) => setF({ ...f, plan_tier: e.target.value as ClinicPartner["plan_tier"] })}
          className="rounded border bg-transparent px-2 py-1.5 text-xs" style={{ borderColor: "rgb(var(--border))" }}>
          <option value="trial">trial</option><option value="pilot">pilot</option><option value="paid">paid</option>
        </select>
        <input type="number" placeholder="฿/mo" value={f.monthly_fee_thb} onChange={(e) => setF({ ...f, monthly_fee_thb: Number(e.target.value) })}
          className="rounded border bg-transparent px-2 py-1.5 text-xs" style={{ borderColor: "rgb(var(--border))" }} />
        <button type="submit" disabled={busy} className="rounded bg-emerald-600 text-white px-3 py-1.5 text-xs font-bold disabled:opacity-50">
          {busy ? "…" : "+ Add"}
        </button>
      </div>
      <input placeholder="contact email (optional)" value={f.contact_email ?? ""} onChange={(e) => setF({ ...f, contact_email: e.target.value })}
        className="mt-2 w-full rounded border bg-transparent px-2 py-1.5 text-xs" style={{ borderColor: "rgb(var(--border))" }} />
    </form>
  );
}

function OutreachAdd({ directory, onAdd }: {
  directory: DirEntry[];
  onAdd: (clinic_id: string, patch: Partial<OutreachEntry>) => void | Promise<void>;
}) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const matches = useMemo(() => {
    if (!q.trim()) return [];
    const needle = q.toLowerCase();
    return directory.filter((d) => d.name.toLowerCase().includes(needle)).slice(0, 6);
  }, [q, directory]);
  return (
    <div className="card p-4">
      <h3 className="font-bold text-sm uppercase tracking-wider muted mb-3">Add prospect to pipeline</h3>
      <div className="relative">
        <input value={q} onChange={(e) => { setQ(e.target.value); setOpen(true); }}
          placeholder="Type clinic name…"
          className="w-full rounded border bg-transparent px-3 py-2 text-sm" style={{ borderColor: "rgb(var(--border))" }} />
        {open && matches.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 z-10 rounded-lg border bg-[rgb(var(--bg-elev))] shadow-lg max-h-60 overflow-y-auto" style={{ borderColor: "rgb(var(--border))" }}>
            {matches.map((m) => (
              <button key={m.id} type="button"
                onClick={() => { onAdd(m.id, { stage: "cold" }); setQ(""); setOpen(false); }}
                className="w-full text-left px-3 py-2 text-xs hover:bg-slate-100 dark:hover:bg-slate-800 border-b last:border-b-0" style={{ borderColor: "rgb(var(--border))" }}>
                <div className="font-bold">{m.name}</div>
                <div className="muted text-[10px]">{m.city} · trust {m.trust}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
