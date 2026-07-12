export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-4xl mb-4">🔍</div>
      <h1 className="font-serif-display text-2xl text-[var(--fg)] mb-2">Page not found</h1>
      <p className="text-sm text-[var(--muted)] mb-6 max-w-sm">
        That restaurant or page doesn't exist — it may have moved or never had enough data to list.
      </p>
      <a
        href="/"
        className="min-h-[44px] px-5 flex items-center rounded-2xl bg-[var(--accent)] text-white font-bold text-sm"
      >
        Back to Home
      </a>
    </div>
  );
}
