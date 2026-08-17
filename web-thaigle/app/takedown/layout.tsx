import type { Metadata } from "next";

// ReportButton links here with businessName/pageUrl query params per venue —
// a unique crawlable URL per listing with no metadata export of its own
// (page.tsx is "use client", which can't export generateMetadata). Without
// this, each one is indexable by default: thin, near-duplicate content that
// only differs by which venue name got prefilled into the form.
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function TakedownLayout({ children }: { children: React.ReactNode }) {
  return children;
}
