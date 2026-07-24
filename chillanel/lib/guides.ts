import fs from "node:fs";
import path from "node:path";
import type { Lang } from "./site";

export type Guide = {
  slug: string;
  title: Record<Lang, string>;
  body: Record<Lang, string>;
};

const GUIDES_DIR = path.join(process.cwd(), "content", "guides");

let cache: Guide[] | null = null;

export function listGuides(): Guide[] {
  if (cache) return cache;
  if (!fs.existsSync(GUIDES_DIR)) return (cache = []);
  cache = fs
    .readdirSync(GUIDES_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => JSON.parse(fs.readFileSync(path.join(GUIDES_DIR, f), "utf-8")) as Guide);
  return cache;
}

export function getGuide(slug: string): Guide | null {
  return listGuides().find((g) => g.slug === slug) ?? null;
}
