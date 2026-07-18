"use client";

type Counts = { flags: number; up: number; down: number };
type Listener = (counts: Counts) => void;

const listeners = new Map<string, Set<Listener>>();
let pending = new Set<string>();
let flushTimer: ReturnType<typeof setTimeout> | null = null;

// Must match the API route's own idList cap (app/api/community/route.ts) —
// requests past that limit were silently truncated server-side, leaving
// every card beyond the 50th permanently stuck at zero counts.
const CHUNK_SIZE = 50;

async function fetchChunk(ids: string[]) {
  try {
    const res = await fetch(`/api/community?ids=${ids.map(encodeURIComponent).join(",")}`);
    if (!res.ok) return;
    const data = await res.json();
    const counts: Record<string, Counts> = data.counts ?? {};
    for (const id of ids) {
      const c = counts[id];
      if (!c) continue;
      listeners.get(id)?.forEach((cb) => cb(c));
    }
  } catch {
    // best-effort — cards just keep their optimistic/zero state
  }
}

function scheduleFlush() {
  if (flushTimer) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    const ids = Array.from(pending);
    pending = new Set();
    if (ids.length === 0) return;
    for (let i = 0; i < ids.length; i += CHUNK_SIZE) {
      fetchChunk(ids.slice(i, i + CHUNK_SIZE));
    }
  }, 40);
}

/** Subscribes to batched community counts for a restaurant id. Returns an unsubscribe function. */
export function subscribeCounts(id: string, cb: Listener): () => void {
  if (!listeners.has(id)) listeners.set(id, new Set());
  listeners.get(id)!.add(cb);
  pending.add(id);
  scheduleFlush();
  return () => {
    const set = listeners.get(id);
    if (!set) return;
    set.delete(cb);
    if (set.size === 0) listeners.delete(id);
  };
}
