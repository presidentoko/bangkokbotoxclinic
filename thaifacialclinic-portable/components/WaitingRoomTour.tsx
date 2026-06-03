// 4-icon "inside the clinic" strip — encourages photo expansion via PhotoGallery.

export default function WaitingRoomTour({ onJumpToPhotos }: { onJumpToPhotos?: () => void }) {
  const items = [
    { emoji: "🛋", title: "Waiting area", body: "Private rooms or shared lounges — see actual interior in photos" },
    { emoji: "🩺", title: "Treatment room", body: "Single-use sterile setup, modern machines" },
    { emoji: "🌿", title: "Recovery room", body: "Quiet rest area for post-procedure observation" },
    { emoji: "🛁", title: "Restroom + amenities", body: "Mostly modern, accessible, English signage" },
  ];

  return (
    <section className="rounded-2xl border bg-white p-5" style={{ borderColor: "rgb(var(--border))" }}>
      <div className="flex items-baseline justify-between mb-3 gap-3 flex-wrap">
        <div>
          <div className="text-xs font-black uppercase tracking-widest text-[rgb(var(--muted))]">Inside the clinic</div>
          <h3 className="text-base font-black mt-0.5">What to expect when you walk in</h3>
        </div>
        {onJumpToPhotos && (
          <button onClick={onJumpToPhotos} className="text-xs font-bold text-emerald-700 hover:underline">
            See real photos ↑
          </button>
        )}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it, i) => (
          <div key={i} className="rounded-xl border bg-slate-50 p-3 text-center" style={{ borderColor: "rgb(var(--border))" }}>
            <div className="text-2xl mb-1">{it.emoji}</div>
            <div className="font-black text-xs">{it.title}</div>
            <p className="text-[10px] text-[rgb(var(--muted))] mt-1 leading-snug">{it.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
