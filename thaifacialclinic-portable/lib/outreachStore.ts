// Outreach pipeline — track each prospect clinic through sales funnel.
// Stages: cold → contacted → replied → demo → won/lost. Stored in Upstash hash per clinic.

import { rcmd } from "./upstash";

export type OutreachStage = "cold" | "contacted" | "replied" | "demo" | "won" | "lost";

export type OutreachEntry = {
  clinic_id: string;
  stage: OutreachStage;
  last_touched_at: string;
  contact_email?: string;
  contact_name?: string;
  note?: string;
  next_action?: string;
  next_action_at?: string; // ISO date
};

const KEY = "admin:outreach";

export async function listOutreach(): Promise<OutreachEntry[]> {
  const r = (await rcmd(["GET", KEY])) as string | null;
  if (!r) return [];
  try { return JSON.parse(r) as OutreachEntry[]; } catch { return []; }
}

async function saveAll(rows: OutreachEntry[]): Promise<boolean> {
  return (await rcmd(["SET", KEY, JSON.stringify(rows)])) !== null;
}

export async function upsertOutreach(entry: Partial<OutreachEntry> & { clinic_id: string }): Promise<{ ok: boolean }> {
  const rows = await listOutreach();
  const idx = rows.findIndex((r) => r.clinic_id === entry.clinic_id);
  const merged: OutreachEntry = {
    clinic_id: entry.clinic_id,
    stage: entry.stage || (idx === -1 ? "cold" : rows[idx].stage),
    last_touched_at: new Date().toISOString(),
    contact_email: entry.contact_email ?? rows[idx]?.contact_email,
    contact_name: entry.contact_name ?? rows[idx]?.contact_name,
    note: entry.note ?? rows[idx]?.note,
    next_action: entry.next_action ?? rows[idx]?.next_action,
    next_action_at: entry.next_action_at ?? rows[idx]?.next_action_at,
  };
  if (idx === -1) rows.push(merged); else rows[idx] = merged;
  return { ok: await saveAll(rows) };
}

export async function removeOutreach(clinic_id: string): Promise<{ ok: boolean }> {
  const rows = await listOutreach();
  const next = rows.filter((r) => r.clinic_id !== clinic_id);
  if (next.length === rows.length) return { ok: false };
  return { ok: await saveAll(next) };
}

export const STAGE_META: Record<OutreachStage, { label: string; color: string; bg: string }> = {
  cold:      { label: "Cold",        color: "#475569", bg: "#f1f5f9" },
  contacted: { label: "Contacted",   color: "#2563eb", bg: "#dbeafe" },
  replied:   { label: "Replied",     color: "#7c3aed", bg: "#ede9fe" },
  demo:      { label: "Demo / call", color: "#0891b2", bg: "#cffafe" },
  won:       { label: "Won",         color: "#059669", bg: "#d1fae5" },
  lost:      { label: "Lost",        color: "#dc2626", bg: "#fee2e2" },
};
