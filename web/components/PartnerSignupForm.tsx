"use client";
// Partner signup form — clinic search + contact info → POST /api/partner-signup.

import { useMemo, useState } from "react";

type ClinicHit = { id: string; name: string; district: string; city: string; trust: number };

export function PartnerSignupForm({ clinics }: { clinics: ClinicHit[] }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ClinicHit | null>(null);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [lineUserId, setLineUserId] = useState("");
  const [phone, setPhone] = useState("");
  const [planTier, setPlanTier] = useState<"pilot" | "paid">("pilot");
  const [ticket, setTicket] = useState(15000);
  const [notes, setNotes] = useState("");
  const [hp, setHp] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "ok" | "error">("idle");
  const [errMsg, setErrMsg] = useState("");

  const matches = useMemo(() => {
    if (!search || search.length < 2) return [];
    const q = search.toLowerCase();
    return clinics.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 8);
  }, [search, clinics]);

  async function submit() {
    if (!selected) {
      setErrMsg("Please select your clinic from the search results.");
      setStatus("error");
      return;
    }
    setStatus("submitting");
    setErrMsg("");
    try {
      const res = await fetch("/api/partner-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clinicId: selected.id,
          contactName, contactEmail, lineUserId, phone,
          planTier, monthlyTicketAvg: ticket, notes,
          _hp: hp,
        }),
      });
      if (res.ok) {
        setStatus("ok");
      } else {
        const t = await res.text();
        setErrMsg(t || "Submission failed.");
        setStatus("error");
      }
    } catch (e) {
      setErrMsg(String(e));
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <div className="bg-white border-2 border-emerald-300 rounded-xl p-8 text-center">
        <div className="text-5xl mb-3">✓</div>
        <h2 className="text-xl font-bold mb-2">Pilot request received</h2>
        <p className="text-sm text-[var(--muted)] max-w-md mx-auto leading-relaxed">
          We&apos;ll contact you at <strong>{contactEmail}</strong> within 24 hours to confirm
          dashboard access + LINE bot wiring. {selected && (
            <> Your dashboard will be at{" "}
              <a href={`/dashboard/${selected.id}`} className="text-blue-600 underline">
                /dashboard/{selected.id.slice(0, 16)}…
              </a>
            </>
          )}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[var(--border)] rounded-xl overflow-hidden">
      <input
        type="text" tabIndex={-1} autoComplete="off"
        value={hp} onChange={(e) => setHp(e.target.value)}
        style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }}
        aria-hidden="true"
      />

      <div className="p-6 space-y-5">
        <Field label="① Find your clinic" required>
          <input
            type="text"
            value={selected ? selected.name : search}
            onChange={(e) => { setSearch(e.target.value); setSelected(null); }}
            placeholder="Type clinic name (e.g., Aura Bangkok Siam)"
            className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-black"
          />
          {matches.length > 0 && !selected && (
            <div className="mt-1 border border-[var(--border)] rounded-lg bg-white shadow-sm divide-y divide-[var(--border)] max-h-64 overflow-y-auto">
              {matches.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => { setSelected(c); setSearch(""); }}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 transition"
                >
                  <div className="font-medium text-sm">{c.name}</div>
                  <div className="text-xs text-[var(--muted)]">
                    {c.district || c.city} · Trust {c.trust.toFixed(0)}
                  </div>
                </button>
              ))}
            </div>
          )}
          {selected && (
            <div className="mt-2 text-xs text-emerald-700 flex items-center gap-2">
              <span>✓ Selected: <strong>{selected.name}</strong> ({selected.district || selected.city}, Trust {selected.trust.toFixed(0)})</span>
              <button type="button" onClick={() => setSelected(null)} className="underline text-[var(--muted)]">change</button>
            </div>
          )}
        </Field>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="② Contact name" required>
            <input
              value={contactName} onChange={(e) => setContactName(e.target.value)}
              placeholder="Owner / manager name"
              className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-black"
            />
          </Field>
          <Field label="Email" required>
            <input
              type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)}
              placeholder="owner@clinic.com"
              className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-black"
            />
          </Field>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="LINE user ID" sub="optional — for real-time push">
            <input
              value={lineUserId} onChange={(e) => setLineUserId(e.target.value)}
              placeholder="U1234567890abcdef..."
              className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-black"
            />
          </Field>
          <Field label="Phone" sub="optional — SMS fallback">
            <input
              value={phone} onChange={(e) => setPhone(e.target.value)}
              placeholder="+66 ..."
              className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-black"
            />
          </Field>
        </div>

        <Field label="③ Plan">
          <div className="grid sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPlanTier("pilot")}
              className={`text-left p-3 rounded-lg border transition ${
                planTier === "pilot" ? "border-black bg-gray-50" : "border-[var(--border)] hover:border-gray-400"
              }`}
            >
              <div className="font-bold text-sm">30-day pilot</div>
              <div className="text-xs text-[var(--muted)]">Free for 30 days · ฿200/lead delivered</div>
            </button>
            <button
              type="button"
              onClick={() => setPlanTier("paid")}
              className={`text-left p-3 rounded-lg border transition ${
                planTier === "paid" ? "border-black bg-gray-50" : "border-[var(--border)] hover:border-gray-400"
              }`}
            >
              <div className="font-bold text-sm">฿8,000/month</div>
              <div className="text-xs text-[var(--muted)]">Unlimited leads + dashboard + alerts</div>
            </button>
          </div>
        </Field>

        <Field label="Avg procedure ticket (THB)" sub="Used for ROI calculation in your dashboard">
          <input
            type="number" value={ticket} onChange={(e) => setTicket(parseInt(e.target.value || "0", 10) || 0)}
            min={1000} max={1000000} step={1000}
            className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-black tabular-nums"
          />
        </Field>

        <Field label="Notes" sub="optional">
          <textarea
            value={notes} onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Anything specific (languages, doctors, hours...)"
            className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-black resize-none"
          />
        </Field>

        <div className="pt-2 flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={submit}
            disabled={!selected || !contactEmail || !contactName || status === "submitting"}
            className="px-6 py-3 rounded-lg bg-black text-white text-sm font-bold hover:bg-gray-800 disabled:opacity-40"
          >
            {status === "submitting" ? "Submitting..." : "Start pilot →"}
          </button>
          <span className="text-xs text-[var(--muted)]">
            We&apos;ll confirm within 24h. No payment until first lead.
          </span>
        </div>
        {status === "error" && (
          <p className="text-xs text-red-700">{errMsg || "Could not submit. Try again."}</p>
        )}
      </div>
    </div>
  );
}

function Field({ label, sub, required, children }: {
  label: string; sub?: string; required?: boolean; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
        {sub && <span className="text-xs text-[var(--muted)] font-normal ml-2">{sub}</span>}
      </label>
      {children}
    </div>
  );
}
