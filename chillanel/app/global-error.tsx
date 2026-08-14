"use client";

import { useEffect } from "react";

// Only catches errors thrown by the root layouts themselves
// (app/(root)/layout.tsx, app/[lang]/layout.tsx) -- errors from ordinary
// pages are caught by app/[lang]/error.tsx instead, which can still use
// the site's normal design system. This one replaces the entire root
// layout on error, so per Next.js convention it must render its own
// bare <html>/<body> -- no fonts, no design system, since those come
// from the layout that just failed.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif", textAlign: "center", padding: "6rem 1.5rem" }}>
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.75rem" }}>Something went wrong</h1>
        <p style={{ color: "#666", marginBottom: "2rem" }}>An unexpected error occurred. Please try again.</p>
        <button
          type="button"
          onClick={reset}
          style={{
            borderRadius: "9999px",
            padding: "0.75rem 1.5rem",
            fontWeight: 600,
            background: "#111",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
