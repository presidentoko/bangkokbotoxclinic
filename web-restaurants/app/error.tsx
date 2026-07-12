"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-4xl mb-4">😵</div>
      <h1 className="font-serif-display text-2xl text-[var(--fg)] mb-2">Something went wrong</h1>
      <p className="text-sm text-[var(--muted)] mb-6 max-w-sm">
        That's on us, not you. Try reloading — if it keeps happening, head back home.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="min-h-[44px] px-5 rounded-2xl bg-[var(--accent)] text-white font-bold text-sm"
        >
          Try again
        </button>
        <a
          href="/"
          className="min-h-[44px] px-5 flex items-center rounded-2xl border border-[var(--border)] text-sm text-[var(--fg)]"
        >
          Go home
        </a>
      </div>
    </div>
  );
}
