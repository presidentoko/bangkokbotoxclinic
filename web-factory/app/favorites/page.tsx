import type { Metadata } from "next";
import { FavoritesClient } from "@/components/FavoritesClient";

export const metadata: Metadata = {
  title: "Saved Suppliers",
  description: "Your saved Thai suppliers — bookmarked on this device for later.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/favorites" },
};

export default function FavoritesPage() {
  return <FavoritesClient />;
}
