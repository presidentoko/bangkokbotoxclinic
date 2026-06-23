"use client";

import { useEffect } from "react";

type Props = {
  id: string;
  name: string;
  nicheSlug: string;
  slug: string;
  icon: string;
  trust_score: number;
};

const KEY = "thaigle_recent";
const MAX = 6;

export function ViewTracker({ id, name, nicheSlug, slug, icon, trust_score }: Props) {
  useEffect(() => {
    try {
      const existing = JSON.parse(localStorage.getItem(KEY) ?? "[]");
      const filtered = existing.filter((v: { id: string }) => v.id !== id);
      const updated = [{ id, name, nicheSlug, slug, icon, trust_score }, ...filtered].slice(0, MAX);
      localStorage.setItem(KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  }, [id, name, nicheSlug, slug, icon, trust_score]);

  return null;
}
