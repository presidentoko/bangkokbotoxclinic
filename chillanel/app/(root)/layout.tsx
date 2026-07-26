import { fontVariables } from "@/lib/fonts";
import "../globals.css";

// Root layout for the bare "/" route only (a server-side redirect to
// /[DEFAULT_LANG] -- see page.tsx). Next.js requires every top-level route
// group to own an <html>/<body>; app/[lang]/layout.tsx owns the real one
// for every actual content page, with the correct per-language `lang`
// attribute set at build time instead of client-side.
export default function RootFallbackLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={fontVariables}>
      <body>{children}</body>
    </html>
  );
}
