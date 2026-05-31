// Dashboard-shared utilities + constants. Extracted from DashboardView so that
// pages/components can reuse without dragging in the full 1.8k-line dashboard.

export type LeadStatus = "new" | "contacted" | "booked" | "no_show" | "cancelled";

export const LEAD_STATUS_META: Record<LeadStatus, { label: string; color: string; bg: string }> = {
  new:       { label: "New",       color: "#2563eb", bg: "#dbeafe" },
  contacted: { label: "Contacted", color: "#7c3aed", bg: "#ede9fe" },
  booked:    { label: "Booked",    color: "#059669", bg: "#d1fae5" },
  no_show:   { label: "No-show",   color: "#dc2626", bg: "#fee2e2" },
  cancelled: { label: "Cancelled", color: "#6b7280", bg: "#f3f4f6" },
};

/** Stable hash for review text (mirror of server-side reviewHash so we can mark done optimistically). */
export function reviewHash(text: string): string {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0;
  return Math.abs(h).toString(36);
}

/** Human "X mins/hours/days ago" relative time. */
export function relTime(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const mins = Math.round(ms / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  return `${days}d ago`;
}
