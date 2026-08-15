// District/entity slugify — no Node built-ins, safe to import from client components.
// lib/data.ts re-exports this so server code can keep importing slugify from there.

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9฀-๿]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
