import { kvGet, kvSet } from "./kv";

const KEY = "noindex_locales";

export async function getNoindexLocales(): Promise<Set<string>> {
  const raw = await kvGet(KEY);
  if (!raw) return new Set();
  const locales = String(raw).split(",").map((s) => s.trim()).filter(Boolean);
  return new Set(locales);
}

export async function setNoindexLocales(locales: string[]): Promise<void> {
  await kvSet(KEY, locales.join(","));
}
