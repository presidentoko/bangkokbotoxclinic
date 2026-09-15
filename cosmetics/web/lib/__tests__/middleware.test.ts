import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "../../middleware";
import routeIndex from "../../data/route-index.json";

const BASE = "https://bangkokfillers.com";
const run = (path: string) => middleware(new NextRequest(`${BASE}${path}`));
const location = (path: string) => run(path).headers.get("location");

const liveId = routeIndex.productIds[0];
const thin = routeIndex.thinBrandSlugs[0];
const thick = routeIndex.brandSlugs.find((b) => !routeIndex.thinBrandSlugs.includes(b))!;

describe("middleware", () => {
  it("serves live /en product pages instead of redirecting them to /th", () => {
    const res = run(`/en/product/x-${liveId}`);
    expect(res.status).toBe(200);
    expect(res.headers.get("location")).toBeNull();
  });

  it("keeps _rsc on a redirect so Cloudflare cannot cache a flight payload as HTML", () => {
    const loc = location(`/th/dupe/${thin}?_rsc=abc12&utm_source=x`);
    expect(loc).toBe(`${BASE}/th/brand/${thin}?_rsc=abc12`);
  });

  it("drops every other query param on a redirect", () => {
    expect(location(`/th/dupe/${thin}?utm_source=x`)).toBe(`${BASE}/th/brand/${thin}`);
  });

  it("sends a raw-name dupe URL to its slug", () => {
    const raw = thick.toUpperCase();
    if (raw === thick) return; // slug has no letters to case-fold
    expect(location(`/en/dupe/${raw}`)).toBe(`${BASE}/en/dupe/${thick}`);
  });

  it("leaves a canonical dupe URL alone", () => {
    expect(run(`/th/dupe/${thick}`).headers.get("location")).toBeNull();
  });

  it("still sends retired products to their brand", () => {
    expect(location(`/en/product/${thick}-999999999`)).toBe(`${BASE}/en/brand/${thick}`);
  });
});
