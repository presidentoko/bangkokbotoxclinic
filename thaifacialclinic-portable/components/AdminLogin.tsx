"use client";

import { useState } from "react";

export default function AdminLogin() {
  const [passcode, setPasscode] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const r = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode }),
      });
      if (r.ok) {
        location.reload();
      } else {
        setErr("Invalid passcode");
      }
    } catch {
      setErr("Network error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-24">
      <div className="text-xs font-black uppercase tracking-widest text-clinic mb-2">🔒 Staff login</div>
      <h1 className="text-3xl font-bold tracking-tight mb-6">Admin</h1>
      <form onSubmit={submit} className="card p-5">
        <label className="text-sm font-bold mb-2 block">Passcode</label>
        <input
          type="password"
          autoFocus
          autoComplete="current-password"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          className="w-full rounded-lg border border-ink-200 dark:border-ink-700 bg-transparent px-3 py-2 text-sm font-mono"
          placeholder="••••••••"
        />
        {err && <div className="mt-3 text-xs font-semibold text-trust-low">{err}</div>}
        <button
          type="submit"
          disabled={busy || !passcode}
          className="mt-4 w-full rounded-lg bg-ink-900 dark:bg-white px-4 py-2.5 text-sm font-bold text-white dark:text-ink-900 disabled:opacity-50"
        >
          {busy ? "Verifying…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
