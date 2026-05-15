"use client";
import { useState, useCallback, useMemo } from "react";

type DbSummary = {
  generated_at: string;
  total_clinics: number;
  with_reviews_scraped: number;
  city_counts: Record<string, number>;
};

type EnrichedPartner = {
  clinic_id: string;
  clinic_name: string;
  clinic_rating: number | null;
  clinic_city: string | null;
  plan_tier: "trial" | "pilot" | "paid";
  contact_email?: string;
  line_user_id?: string;
  started_at?: string;
  monthly_ticket_avg_thb?: number;
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

export default function AdminView({ db, partners, sponsoredEnv, clinicNames }: Props) {
  const [tab, setTab] = useState<Tab>("Data");

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500 tracking-widest uppercase">bangkokbotoxclinic · admin</span>
        <span className="text-xs text-gray-600">{new Date().toISOString().slice(0, 10)}</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-800 pb-0">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition ${
              tab === t
                ? "bg-gray-800 text-white"
                : "text-gray-500 hover:text-gray-300"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "Data" && <DataTab db={db} />}
      {tab === "Partners" && <PartnersTab partners={partners} />}
      {tab === "Leads" && <LeadsTab partners={partners} passcode="" />}
      {tab === "Ads" && (
        <AdsTab sponsoredEnv={sponsoredEnv} clinicNames={clinicNames} />
      )}
    </div>
  );
}

// ─── Data Tab ──────────────────────────────────────────────────────────────

function DataTab({ db }: { db: DbSummary }) {
  const age = useMemo(() => {
    const diff = Date.now() - new Date(db.generated_at).getTime();
    const h = Math.floor(diff / 3_600_000);
    return h < 48 ? `${h}h ago` : `${Math.floor(h / 24)}d ago`;
  }, [db.generated_at]);

  const topCities = useMemo(
    () =>
      Object.entries(db.city_counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10),
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

// ─── Partners Tab ──────────────────────────────────────────────────────────

function PartnersTab({ partners }: { partners: EnrichedPartner[] }) {
  if (partners.length === 0) {
    return <p className="text-gray-500 text-sm">No partners yet.</p>;
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-gray-500">{partners.length} partner{partners.length !== 1 ? "s" : ""}</p>
      {partners.map((p) => (
        <div
          key={p.clinic_id}
          className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-100 truncate">{p.clinic_name}</span>
              {p.clinic_city && (
                <span className="text-xs text-gray-500">{p.clinic_city}</span>
              )}
              <span className={`text-xs font-mono uppercase ${TIER_COLOR[p.plan_tier]}`}>
                {p.plan_tier}
              </span>
            </div>
            <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
              {p.clinic_rating !== null && <span>★ {p.clinic_rating}</span>}
              {p.contact_email && <span>{p.contact_email}</span>}
              {p.line_user_id && <span>LINE: {p.line_user_id}</span>}
              {p.started_at && <span>since {p.started_at}</span>}
              {p.monthly_ticket_avg_thb && (
                <span>avg ฿{p.monthly_ticket_avg_thb.toLocaleString()}/mo</span>
              )}
            </div>
          </div>
          <a
            href={`/dashboard/${p.clinic_id}`}
            target="_blank"
            rel="noopener"
            className="shrink-0 text-xs bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-lg px-3 py-1.5 text-gray-300 transition"
          >
            View dashboard →
          </a>
        </div>
      ))}
    </div>
  );
}

// ─── Leads Tab ──────────────────────────────────────────────────────────────

type LeadsSummary = { total: number; by_clinic: { clinic_id: string; count: number }[] };

function LeadsTab({ partners, passcode: _passcode }: { partners: EnrichedPartner[]; passcode: string }) {
  const [data, setData] = useState<LeadsSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/admin/leads-summary", {
        headers: { "x-admin-key": getStoredPasscode() },
      });
      if (!res.ok) { setErr("Unauthorized — reload and re-login"); return; }
      const j = (await res.json()) as LeadsSummary;
      setData(j);
    } catch {
      setErr("Fetch failed");
    } finally {
      setLoading(false);
    }
  }, []);

  const nameOf = useCallback(
    (id: string) => partners.find((p) => p.clinic_id === id)?.clinic_name ?? id,
    [partners]
  );

  return (
    <div className="space-y-4">
      {!data && !loading && (
        <button
          onClick={load}
          className="bg-indigo-600 hover:bg-indigo-500 rounded-lg px-4 py-2 text-sm text-white transition"
        >
          Load lead counts
        </button>
      )}
      {loading && <p className="text-gray-500 text-sm">Loading…</p>}
      {err && <p className="text-red-400 text-sm">{err}</p>}
      {data && (
        <>
          <div className="text-2xl font-bold text-indigo-400">
            {data.total.toLocaleString()} <span className="text-sm text-gray-500 font-normal">total leads</span>
          </div>
          <div className="space-y-2">
            {data.by_clinic
              .sort((a, b) => b.count - a.count)
              .map(({ clinic_id, count }) => (
                <div key={clinic_id} className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-lg px-4 py-2">
                  <span className="text-sm text-gray-300">{nameOf(clinic_id)}</span>
                  <span className="text-sm font-mono text-indigo-300">{count}</span>
                </div>
              ))}
          </div>
          <button
            onClick={load}
            className="text-xs text-gray-600 hover:text-gray-400 transition"
          >
            Refresh
          </button>
        </>
      )}
    </div>
  );
}

// ─── Ads Tab ──────────────────────────────────────────────────────────────

type AdTier = "editors_pick" | "recommended" | "featured";

const AD_TIER_META: Record<AdTier, { env: string; label: string; color: string }> = {
  editors_pick: { env: "SPONSORED_EDITORS_PICK", label: "Editor's Pick ★", color: "text-yellow-400" },
  recommended:  { env: "SPONSORED_RECOMMENDED",  label: "Recommended ✓",   color: "text-cyan-400" },
  featured:     { env: "SPONSORED_FEATURED",      label: "Featured ◆",      color: "text-purple-400" },
};

function AdsTab({ sponsoredEnv, clinicNames }: { sponsoredEnv: SponsoredEnv; clinicNames: ClinicName[] }) {
  const initialIds: Record<AdTier, string[]> = {
    editors_pick: parseEnvList(sponsoredEnv.editors_pick),
    recommended: parseEnvList(sponsoredEnv.recommended),
    featured: parseEnvList(sponsoredEnv.featured),
  };

  const [ids, setIds] = useState<Record<AdTier, string[]>>(initialIds);
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return clinicNames
      .filter((c) => c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q))
      .slice(0, 8);
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
      {/* Search */}
      <div className="relative">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search clinic to add to a slot…"
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

      {/* Tier cards */}
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
            {ids[tier].length === 0 && (
              <p className="text-xs text-gray-600">No clinics in this slot.</p>
            )}
            <div className="space-y-1.5">
              {ids[tier].map((id) => (
                <div key={id} className="flex items-center justify-between bg-gray-800 rounded-lg px-3 py-1.5">
                  <div className="text-sm">
                    <span className="text-gray-200">{nameOf(id)}</span>
                    <span className="ml-2 text-gray-600 text-xs font-mono">{id}</span>
                  </div>
                  <button
                    onClick={() => removeId(tier, id)}
                    className="text-gray-600 hover:text-red-400 text-xs ml-4 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-700 font-mono break-all">
              {meta.env}=&quot;{ids[tier].join(",")}&quot;
            </p>
          </div>
        );
      })}

      <p className="text-xs text-gray-600">
        Copy each env var and update your deployment environment variables (Vercel / .env.local), then redeploy.
      </p>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────

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

function getStoredPasscode(): string {
  // Cookie is httpOnly so we can't read it. Instead we re-prompt or use sessionStorage as a cache.
  // For the leads API we use sessionStorage to cache the passcode entered at login time.
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem("admin_pk") ?? "";
}
