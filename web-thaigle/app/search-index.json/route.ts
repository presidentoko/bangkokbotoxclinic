import { buildSearchIndex } from "@/lib/searchIndex";

// Prerendered at build time, so Vercel serves it as a static asset: no
// function invocation, no ISR read, and Cloudflare caches it under the
// blanket rule in next.config.ts like any other file.
export const dynamic = "force-static";

export async function GET() {
  return Response.json(await buildSearchIndex());
}
