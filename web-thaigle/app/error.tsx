"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-4">😵</div>
      <h1 className="text-2xl font-black tracking-tight mb-2">Something went wrong</h1>
      <p className="text-[var(--muted)] mb-8">
        This page hit an unexpected error. Try again, or head back home.
      </p>
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => reset()}
          className="px-4 py-2 rounded-full bg-orange-600 text-white text-sm font-bold hover:bg-orange-700 transition"
        >
          Try again
        </button>
        <a
          href="/"
          className="px-4 py-2 rounded-full border border-[var(--border)] bg-white text-sm font-bold hover:border-orange-300 hover:text-orange-600 transition"
        >
          🏠 Home
        </a>
      </div>
    </div>
  );
}
