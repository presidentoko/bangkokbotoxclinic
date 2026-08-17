import type { Metadata } from "next";

// /saved reads its contents from localStorage, so to a crawler it is an empty
// shell — six identical ones, once per locale. It used to be hidden with a
// robots.txt Disallow, but the header links to it from every page, so Google
// kept queuing it and, unable to fetch it, parked it in "Blocked by
// robots.txt" instead of dropping it. robots.txt now allows it and this
// noindex is what actually removes it. The page itself is a client component
// and cannot export metadata, hence this layout.
export const metadata: Metadata = {
  title: "Saved Packages",
  robots: { index: false, follow: true },
};

export default function SavedLayout({ children }: { children: React.ReactNode }) {
  return children;
}
