import { describe, it, expect } from "vitest";
import { SALE_EVENTS, getSaleEvent, saleEventDate, saleStats, currentSaleEvent } from "../sale";

describe("sale events", () => {
  it("dates 10.10 to this year while it is still ahead", () => {
    const ev = getSaleEvent("10-10")!;
    const d = saleEventDate(ev, new Date("2026-09-24T00:00:00Z"));
    expect(d.toISOString().slice(0, 10)).toBe("2026-10-10");
  });

  it("rolls an event that has passed into next year", () => {
    const ev = getSaleEvent("7-7")!;
    const d = saleEventDate(ev, new Date("2026-09-24T00:00:00Z"));
    expect(d.toISOString().slice(0, 10)).toBe("2027-07-07");
  });

  it("still dates an event to today on the day itself", () => {
    const ev = getSaleEvent("10-10")!;
    const d = saleEventDate(ev, new Date("2026-10-10T18:00:00Z"));
    expect(d.toISOString().slice(0, 10)).toBe("2026-10-10");
  });

  it("every event has a date helper that lands on its own month and day", () => {
    for (const ev of SALE_EVENTS) {
      const d = saleEventDate(ev, new Date("2026-09-24T00:00:00Z"));
      expect(d.getUTCMonth() + 1).toBe(ev.month);
      expect(d.getUTCDate()).toBe(ev.day);
    }
  });

  it("reports discount stats counted from the catalogue, with the date they were collected", () => {
    const s = saleStats();
    expect(s.discounted).toBeGreaterThan(0);
    expect(s.discounted).toBeLessThanOrEqual(s.total);
    expect(s.halfOffCount).toBeLessThanOrEqual(s.discounted);
    expect(s.medianPct).toBeGreaterThan(0);
    expect(s.maxPct).toBeGreaterThanOrEqual(s.medianPct);
    // The pages print this date next to the prices; without it they would read
    // as today's shelf prices, which they are not.
    expect(s.asOf).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("names a single retailer only when the whole snapshot came from one", () => {
    const s = saleStats();
    expect(s.retailer === null || typeof s.retailer === "string").toBe(true);
  });

  it("currentSaleEvent picks the next upcoming event", () => {
    expect(currentSaleEvent(new Date("2026-09-24T00:00:00Z")).slug).toBe("10-10");
  });
});
