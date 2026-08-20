// Saved clinics page — pulls IDs from client localStorage and renders matching clinics.
// SEO is intentionally noindex (private list per visitor).

import type { Metadata } from "next";
import SavedClinicsClient from "./SavedClinicsClient";

export const metadata: Metadata = {
  title: "Saved clinics",
  robots: { index: false, follow: false },
};

export default function SavedPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight">Your saved clinics</h1>
        <p className="text-sm text-[var(--muted)] mt-1">
          Saved on this device. Clear browser data to reset.
        </p>
      </div>
      <SavedClinicsClient />
    </main>
  );
}
