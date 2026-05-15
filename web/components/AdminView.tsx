"use client";
import { useState, useCallback, useMemo, useEffect } from "react";

type DbSummary = {
  generated_at: string;
  total_clinics: number;
  with_reviews_scraped: number;
  city_counts: Record<string, number>;
};

type PartnerRecord = {
  clinic_id: string;
  plan_tier: "trial" | "pilot" | "paid";
  contact_email?: string;
  line_user_id?: string;
  started_at?: string;
  monthly_ticket_avg_thb?: number;
};

type EnrichedPartner = PartnerRecord & {
  clinic_name: string;
  clinic_rating: number | null;
  clinic_city: string | null;
};

type SponsoredEnv = {
  editors_pick: string;
  recommended: string;
  featured: string;
};

type ClinicName = { id: string; name: string; city: string };

type Props = {
  db: DbSummary;
  partners: EnrichedPartner[];
  sponsoredEnv: SponsoredEnv;
  clinicNames: ClinicName[];
};

const TABS = ["Data", "Partners", "Leads", "Ads"] as const;
type Tab = (typeof TABS)[number];

const TIER_COLOR: Record<string, string> = {
  trial: "text-yellow-400",
  pilot: "text-cyan-400",
  paid: "text-green-400",
};
const TIER_BG: Record<string, string> = {
  trial: "bg-yellow-400/10 border-yellow-400/30",
  pilot: "bg-cyan-400/10 border-cyan-400/30",
  paid: "bg-green-400/10 border-green-400/30",
};

function adminKey(): string {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem("admin_pk") ?? "";
}

export default function AdminView({ db, partners: initialPartners, sponsoredEnv, clinicNames }: Props) {
  const [tab, setTab] = useState<Tab>("Partners");

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

      {tab === "Data"     && <DataTab db={db} />}
      {tab === "Partners" && <PartnersTab initialPartners={initialPartners} clinicNames={clinicNames} />}
      {tab === "Leads"    && <LeadsTab initialPartners={initialPartners} clinicNames={clinicNames} />}
      {tab === "Ads"      && <AdsTab sponsoredEnv={sponsoredEnv} clinicNames={clinicNames} />}
    </div>
  );
}

// ─── Data Tab ────────────────────────────────────────────────────────────────

function DataTab({ db }: { db: DbSummary }) {
  const age = useMemo(() => {
    const diff = Date.now() - new Date(db.generated_at).getTime();
    const h = Math.floor(diff / 3_600_000);
    return h < 48 ? `${h}h ago` : `${Math.floor(h / 24)}d ago`;
  }, [db.generated_at]);

  const topCities = useMemo(
    () => Object.entries(db.city_counts).sort((a, b) => b[1] - a[1]).slice(0, 10),
    [db.city_counts]
  );
  const coveragePct = Math.round((db.with_reviews_scraped / db.total_clinics) * 100);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Stat label="Total clinics" value={db.total_clinics.toLocaleString()} />
        <Stat label="Reviews scraped" value={`${db.with_reviews_scraped.toLocaleString()} (${coveragePct}%)`} />
        <Stat label="Cities" value={Object.keys(db.city_counts).length.toString()} />
        <Stat label="DB freshness" value={age} />
      </div>
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

// ─── Partners Tab ─────────────────────────────────────────────────────────────

function PartnersTab({ initialPartners, clinicNames }: { initialPartners: EnrichedPartner[]; clinicNames: ClinicName[] }) {
  const [partners, setPartners] = useState<EnrichedPartner[]>(initialPartners);
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const nameOf = useCallback((id: string) => {
    return clinicNames.find((c) => c.id === id)?.name ?? id;
  }, [clinicNames]);

  async function reload() {
    const res = await fetch("/api/admin/partners", {
      headers: { "x-admin-key": adminKey() },
    });
    if (!res.ok) return;
    const j = (await res.json()) as { partners: PartnerRecord[] };
    setPartners(j.partners.map((p) => {
      const c = clinicNames.find((x) => x.id === p.clinic_id);
      return { ...p, clinic_name: c?.name ?? p.clinic_id, clinic_rating: null, clinic_city: c?.city ?? null };
    }));
  }

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
      await reload();
    } else {
      setMsg(j.error === "already_exists" ? "Already a partner." : j.error ?? "Error");
    }
    setTimeout(() => setMsg(""), 3000);
  }

  async function handleTierChange(clinic_id: string, plan_tier: "trial" | "pilot" | "paid") {
    await fetch("/api/admin/partners", {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey() },
      body: JSON.stringify({ clinic_id, plan_tier }),
    });
    await reload();
  }

  async function handleDelete(clinic_id: string) {
    if (!confirm(`Remove ${nameOf(clinic_id)} as partner?`)) return;
    await fetch("/api/admin/partners", {
      method: "DELETE",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey() },
      body: JSON.stringify({ clinic_id }),
    });
    await reload();
  }

  async function copyLink(clinic_id: string) {
    const url = `${window.location.origin}/dashboard/${clinic_id}`;
    try { await navigator.clipboard.writeText(url); } catch {
      const el = document.createElement("textarea");
      el.value = url; document.body.appendChild(el); el.select();
      document.execCommand("copy"); document.body.removeChild(el);
    }
    setCopied(clinic_id);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{partners.length} partner{partners.length !== 1 ? "s" : ""}</span>
        <button
          onClick={() => setShowAdd(true)}
          className="bg-indigo-600 hover:bg-indigo-500 rounded-lg px-4 py-2 text-sm text-white font-semibold transition"
        >
          + Add Partner
        </button>
      </div>

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
        {partners.map((p) => (
          <div key={p.clinic_id} className={`border rounded-xl p-4 space-y-3 ${TIER_BG[p.plan_tier]}`}>
            <div className="flex items-start justify-between gap-2 flex-wrap">
              <div>
                <span className="font-semibold text-gray-100">{p.clinic_name}</span>
                {p.clinic_city && <span className="ml-2 text-xs text-gray-500">{p.clinic_city}</span>}
                {p.clinic_rating && <span className="ml-2 text-xs text-gray-500">★ {p.clinic_rating}</span>}
                {p.started_at && <span className="ml-2 text-xs text-gray-600">since {p.started_at}</span>}
              </div>
              {/* Tier selector */}
              <select
                value={p.plan_tier}
                onChange={(e) => handleTierChange(p.clinic_id, e.target.value as "trial" | "pilot" | "paid")}
                className={`bg-gray-900 border border-gray-700 rounded-lg px-2 py-1 text-xs font-mono font-semibold ${TIER_COLOR[p.plan_tier]} focus:outline-none`}
              >
                <option value="trial">trial</option>
                <option value="pilot">pilot</option>
                <option value="paid">paid ✓</option>
              </select>
            </div>

            <div className="flex flex-wrap gap-2 text-xs text-gray-500">
              {p.contact_email && <span>✉ {p.contact_email}</span>}
              {p.line_user_id && <span>LINE: {p.line_user_id}</span>}
              {p.monthly_ticket_avg_thb && <span>฿{p.monthly_ticket_avg_thb.toLocaleString()}/mo avg</span>}
            </div>

            <div className="flex gap-2 flex-wrap">
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
                Open dashboard →
              </a>
              {editId === p.clinic_id ? (
                <EditPartnerForm
                  partner={p}
                  onSave={async (patch) => {
                    setSaving(true);
                    await fetch("/api/admin/partners", {
                      method: "PATCH",
                      headers: { "Content-Type": "application/json", "x-admin-key": adminKey() },
                      body: JSON.stringify({ clinic_id: p.clinic_id, ...patch }),
                    });
                    setSaving(false);
                    setEditId(null);
                    await reload();
                  }}
                  onCancel={() => setEditId(null)}
                  saving={saving}
                />
              ) : (
                <button
                  onClick={() => setEditId(p.clinic_id)}
                  className="text-xs bg-gray-900 hover:bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-gray-500 transition"
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => handleDelete(p.clinic_id)}
                className="text-xs bg-gray-900 hover:bg-red-900/30 border border-gray-700 hover:border-red-700/50 rounded-lg px-3 py-1.5 text-gray-600 hover:text-red-400 transition"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Add Partner Form ─────────────────────────────────────────────────────────

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
  const [tier, setTier] = useState<"trial" | "pilot" | "paid">("trial");
  const [email, setEmail] = useState("");
  const [line, setLine] = useState("");
  const [ticket, setTicket] = useState("");

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
    });
  }

  return (
    <div className="bg-gray-900 border border-indigo-500/40 rounded-xl p-5 space-y-4">
      <h3 className="text-sm font-semibold text-indigo-300">Add new partner</h3>

      {/* Clinic search */}
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
                    key={c.id}
                    type="button"
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Plan tier</label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value as "trial" | "pilot" | "paid")}
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-indigo-500"
              >
                <option value="trial">Trial (free)</option>
                <option value="pilot">Pilot</option>
                <option value="paid">Paid ✓</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Avg ticket (฿/mo)</label>
              <input
                type="number"
                value={ticket}
                onChange={(e) => setTicket(e.target.value)}
                placeholder="e.g. 15000"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Contact email (for lead notifications)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="clinic@example.com"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">LINE user ID (optional)</label>
            <input
              value={line}
              onChange={(e) => setLine(e.target.value)}
              placeholder="Uxxxxxxxx"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={saving}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 rounded-lg px-4 py-2 text-sm text-white font-semibold transition"
            >
              {saving ? "Saving…" : "Add partner"}
            </button>
            <button type="button" onClick={onCancel} className="text-sm text-gray-500 hover:text-gray-300 px-4 py-2">
              Cancel
            </button>
          </div>
        </form>
      )}

      {!selected && (
        <div className="flex justify-end">
          <button onClick={onCancel} className="text-sm text-gray-500 hover:text-gray-300">Cancel</button>
        </div>
      )}
    </div>
  );
}

// ─── Edit Partner Form ────────────────────────────────────────────────────────

function EditPartnerForm({
  partner, onSave, onCancel, saving,
}: {
  partner: EnrichedPartner;
  onSave: (patch: Partial<PartnerRecord>) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [email, setEmail] = useState(partner.contact_email ?? "");
  const [line, setLine] = useState(partner.line_user_id ?? "");
  const [ticket, setTicket] = useState(partner.monthly_ticket_avg_thb?.toString() ?? "");

  return (
    <div className="w-full mt-2 bg-gray-950 border border-gray-700 rounded-xl p-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Contact email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Avg ticket (฿)</label>
          <input
            type="number"
            value={ticket}
            onChange={(e) => setTicket(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>
      <div>
        <label className="text-xs text-gray-500 mb-1 block">LINE user ID</label>
        <input
          value={line}
          onChange={(e) => setLine(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-gray-100 focus:outline-none focus:border-indigo-500"
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => onSave({ contact_email: email || undefined, line_user_id: line || undefined, monthly_ticket_avg_thb: ticket ? parseInt(ticket, 10) : undefined })}
          disabled={saving}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 rounded-lg px-3 py-1.5 text-xs text-white font-semibold transition"
        >
          {saving ? "…" : "Save"}
        </button>
        <button onClick={onCancel} className="text-xs text-gray-500 hover:text-gray-300 px-3 py-1.5">Cancel</button>
      </div>
    </div>
  );
}

// ─── Leads Tab ────────────────────────────────────────────────────────────────

type LeadsSummary = { total: number; by_clinic: { clinic_id: string; count: number }[] };

function LeadsTab({ initialPartners, clinicNames }: { initialPartners: EnrichedPartner[]; clinicNames: ClinicName[] }) {
  const [data, setData] = useState<LeadsSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const nameOf = useCallback(
    (id: string) => {
      const p = initialPartners.find((x) => x.clinic_id === id);
      if (p) return p.clinic_name;
      return clinicNames.find((c) => c.id === id)?.name ?? id;
    },
    [initialPartners, clinicNames]
  );

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/admin/leads-summary", {
        headers: { "x-admin-key": adminKey() },
      });
      if (!res.ok) { setErr("Unauthorized"); return; }
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
            <p className="text-gray-600 text-sm">No leads yet. Leads appear once partner clinics receive bookings.</p>
          )}
          <div className="space-y-2">
            {data.by_clinic
              .sort((a, b) => b.count - a.count)
              .map(({ clinic_id, count }) => (
                <div key={clinic_id} className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-lg px-4 py-2.5">
                  <div>
                    <span className="text-sm text-gray-300">{nameOf(clinic_id)}</span>
                    <span className="ml-2 text-xs text-gray-600 font-mono">{clinic_id}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold font-mono text-indigo-300">{count}</span>
                    <a
                      href={`/dashboard/${clinic_id}`}
                      target="_blank"
                      rel="noopener"
                      className="text-xs text-gray-600 hover:text-gray-400 transition"
                    >
                      →
                    </a>
                  </div>
                </div>
              ))}
          </div>
          <button onClick={load} className="text-xs text-gray-600 hover:text-gray-400 transition">
            Refresh
          </button>
        </>
      )}
    </div>
  );
}

// ─── Ads Tab ──────────────────────────────────────────────────────────────────

type AdTier = "editors_pick" | "recommended" | "featured";

const AD_TIER_META: Record<AdTier, { env: string; label: string; color: string }> = {
  editors_pick: { env: "SPONSORED_EDITORS_PICK", label: "Editor's Pick ★", color: "text-yellow-400" },
  recommended:  { env: "SPONSORED_RECOMMENDED",  label: "Recommended ✓",   color: "text-cyan-400" },
  featured:     { env: "SPONSORED_FEATURED",      label: "Featured ◆",      color: "text-purple-400" },
};

function AdsTab({ sponsoredEnv, clinicNames }: { sponsoredEnv: SponsoredEnv; clinicNames: ClinicName[] }) {
  const initialIds: Record<AdTier, string[]> = {
    editors_pick: parseEnvList(sponsoredEnv.editors_pick),
    recommended:  parseEnvList(sponsoredEnv.recommended),
    featured:     parseEnvList(sponsoredEnv.featured),
  };

  const [ids, setIds] = useState<Record<AdTier, string[]>>(initialIds);
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return clinicNames.filter((c) => c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)).slice(0, 8);
  }, [search, clinicNames]);

  function addId(tier: AdTier, id: string) {
    setIds((prev) => ({ ...prev, [tier]: [...new Set([...prev[tier], id])] }));
    setSearch("");
  }
  function removeId(tier: AdTier, id: string) {
    setIds((prev) => ({ ...prev, [tier]: prev[tier].filter((x) => x !== id) }));
  }

  async function copyEnv(tier: AdTier) {
    const meta = AD_TIER_META[tier];
    const text = `${meta.env}="${ids[tier].join(",")}"`;
    try { await navigator.clipboard.writeText(text); } catch {
      const el = document.createElement("textarea");
      el.value = text; document.body.appendChild(el); el.select();
      document.execCommand("copy"); document.body.removeChild(el);
    }
    setCopied(tier);
    setTimeout(() => setCopied(null), 2000);
  }

  const nameOf = useCallback(
    (id: string) => clinicNames.find((c) => c.id === id)?.name ?? id,
    [clinicNames]
  );

  return (
    <div className="space-y-8">
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
                      key={tier}
                      onClick={() => addId(tier, c.id)}
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

      {(["editors_pick", "recommended", "featured"] as AdTier[]).map((tier) => {
        const meta = AD_TIER_META[tier];
        return (
          <div key={tier} className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className={`font-semibold text-sm ${meta.color}`}>{meta.label}</span>
              <button
                onClick={() => copyEnv(tier)}
                className="text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-3 py-1.5 text-gray-400 transition"
              >
                {copied === tier ? "✓ Copied!" : `Copy ${meta.env}`}
              </button>
            </div>
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
            <p className="text-xs text-gray-700 font-mono break-all">{meta.env}=&quot;{ids[tier].join(",")}&quot;</p>
          </div>
        );
      })}
      <p className="text-xs text-gray-600">
        Copy each env var → paste into Vercel Settings → Environment Variables → Redeploy.
      </p>
    </div>
  );
}

// ─── Shared ───────────────────────────────────────────────────────────────────

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className="text-xl font-bold text-gray-100">{value}</div>
    </div>
  );
}

function parseEnvList(s: string): string[] {
  return s.split(",").map((x) => x.trim()).filter(Boolean);
}
