// Sticky banner at top of dashboard. Hides itself when no action is needed.
// Reused across botox + dental (focus-agnostic copy).

export default function ActionAlert({
  newLeads, pendingReplies,
}: {
  newLeads: number;
  pendingReplies: number;
}) {
  const total = newLeads + pendingReplies;
  if (total === 0) return null;

  return (
    <div className="sticky top-16 z-20 -mx-4 mb-6 border-2 border-amber-400 bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-3 backdrop-blur shadow-md rounded-xl">
      <div className="mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-amber-500 text-white text-lg shadow">
            ⚡
          </span>
          <div>
            <div className="font-bold text-amber-900">Action needed</div>
            <div className="text-xs text-amber-800/80">
              {[
                newLeads > 0 ? `${newLeads} new lead${newLeads === 1 ? "" : "s"} awaiting contact` : null,
                pendingReplies > 0 ? `${pendingReplies} review${pendingReplies === 1 ? "" : "s"} unanswered` : null,
              ].filter(Boolean).join(" · ")}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {newLeads > 0 && (
            <a href="#leads" className="rounded-lg bg-amber-600 px-3 py-2 text-xs font-bold text-white hover:bg-amber-700 whitespace-nowrap">
              Open leads →
            </a>
          )}
          {pendingReplies > 0 && (
            <a href="#replies" className="rounded-lg border border-amber-600 px-3 py-2 text-xs font-bold text-amber-800 hover:bg-amber-100 whitespace-nowrap">
              Reply tool →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
