import { describe, it, expect } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "../../middleware";
import routeIndex from "../../data/route-index.json";
import { CONCERN_FILTER_SLUGS } from "../concern-filters";

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

  it("drops the query string on a redirect", () => {
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

describe("dead WordPress paths", () => {
  // These were indexed when a WordPress site lived here; /privacy-policy9 acted
  // as a catch-all, so Google holds URLs like /privacy-policy9/oilcontrol.
  const gone = [
    "/privacy-policy9",
    "/privacy-policy9/oilcontrol",
    "/privacy-policy9/product/her-hyness-109669",
    "/privacy-policy9/ingredient/centella-asiatica-extract",
    "/author/ploy",
  ];
  for (const p of gone) {
    it(`410s ${p}`, () => {
      expect(run(p).status).toBe(410);
    });
  }

  it("leaves the site's own privacy page alone", () => {
    const res = run("/th/privacy");
    expect(res.status).toBe(200);
    expect(res.headers.get("location")).toBeNull();
  });
});

describe("URLs the catalogue no longer covers", () => {
  // The 2026-09-30 Coverage export still lists 136 URLs that end in a 404,
  // and they are all of four shapes. 404 invites Google to keep checking;
  // these are gone, or they have a broader page that covers them.
  it("410s a brand the catalogue dropped", () => {
    expect(run("/en/brand/mamonde").status).toBe(410);
    expect(run("/th/brand/citra").status).toBe(410);
  });

  it("serves brands that are still carried", () => {
    expect(run(`/th/brand/${thick}`).status).toBe(200);
  });

  it("410s a dupe page for a brand the catalogue dropped", () => {
    expect(run("/en/dupe/Kisaa").status).toBe(410);
  });

  it("redirects a retired concern filter to its concern page", () => {
    // The filter list has changed since these were indexed; the concern page
    // still covers the subject, so this is a redirect, not a 410.
    expect(location("/en/sensitive/centella")).toBe(`${BASE}/en/sensitive`);
    expect(location("/th/pores/hyaluronic-acid")).toBe(`${BASE}/th/pores`);
  });

  it("leaves a live concern filter alone", () => {
    const live = CONCERN_FILTER_SLUGS.pores[0];
    expect(run(`/th/pores/${live}`).headers.get("location")).toBeNull();
  });

  it("410s the OG image of a product that left the catalogue", () => {
    expect(run("/th/product/u-star-bt_16718/opengraph-image").status).toBe(410);
  });

  it("leaves the OG image of a live product alone", () => {
    expect(run(`/th/product/x-${liveId}/opengraph-image`).status).toBe(200);
  });

  it("does not intercept other three-segment routes", () => {
    const res = run("/th/ingredient/niacinamide");
    expect(res.status).toBe(200);
    expect(res.headers.get("location")).toBeNull();
  });
});
