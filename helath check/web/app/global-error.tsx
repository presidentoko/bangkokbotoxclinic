"use client";
import { useEffect } from "react";

// Catches errors thrown by the root layout itself (rare, since it's just a
// pass-through — see app/layout.tsx). Must render its own <html>/<body>
// since it replaces the entire document when triggered.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
          <p className="text-6xl mb-4">⚠️</p>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Something went wrong</h1>
          <p className="text-slate-500 mb-8 max-w-md">
            An unexpected error occurred. Please try again.
          </p>
          <button onClick={() => reset()}
            className="bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
