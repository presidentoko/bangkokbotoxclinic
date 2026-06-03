export default function ActionAlert({
  newLeads, pendingReplies,
}: {
  newLeads: number;
  pendingReplies: number;
}) {
  const total = newLeads + pendingReplies;
  if (total === 0) return null;

  return (
    <div className="sticky top-16 z-20 -mx-4 mb-6 border-2 border-gold-400 bg-gradient-to-r from-gold-50 to-amber-50 dark:from-gold-950/40 dark:to-amber-950/40 px-4 py-3 backdrop-blur shadow-md">
      <div className="mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gold-500 text-white text-lg shadow">
            ⚡
          </span>
          <div>
            <div className="font-bold text-gold-900 dark:text-gold-100">Action needed</div>
            <div className="text-xs text-gold-800/80 dark:text-gold-200/80">
              {[
                newLeads > 0 ? `${newLeads} new lead${newLeads === 1 ? "" : "s"} awaiting contact` : null,
                pendingReplies > 0 ? `${pendingReplies} review${pendingReplies === 1 ? "" : "s"} unanswered` : null,
              ].filter(Boolean).join(" · ")}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {newLeads > 0 && (
            <a href="#leads" className="rounded-lg bg-gold-600 px-3 py-2 text-xs font-bold text-white hover:bg-gold-700 whitespace-nowrap">
              Open leads →
            </a>
          )}
          {pendingReplies > 0 && (
            <a href="#replies" className="rounded-lg border border-gold-600 px-3 py-2 text-xs font-bold text-gold-800 dark:text-gold-200 hover:bg-gold-100 dark:hover:bg-gold-900/40 whitespace-nowrap">
              Reply tool →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
