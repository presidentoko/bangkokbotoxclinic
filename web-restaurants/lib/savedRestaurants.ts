"use client";

const KEY = "snsstopper_saved";
export const SAVED_CHANGE_EVENT = "snsstopper_saved_change";

export function getSavedIds(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function isSaved(id: string): boolean {
  return getSavedIds().includes(id);
}

export function toggleSaved(id: string): boolean {
  try {
    const ids = getSavedIds();
    const idx = ids.indexOf(id);
    const saved = idx === -1;
    const next = saved ? [...ids, id] : ids.filter((x) => x !== id);
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event(SAVED_CHANGE_EVENT));
    return saved;
  } catch {
    return false;
  }
}
