import { describe, it, expect } from "vitest";
import { t, LOCALES, concernLabel } from "../i18n";
import { affiliateUrl } from "../affiliate";

describe("i18n", () => {
  it("has th + en", () => { expect(LOCALES).toEqual(["th", "en"]); });
  it("translates a key per locale", () => {
    expect(t("th", "buy_now")).not.toBe(t("en", "buy_now"));
    expect(t("en", "buy_now").toLowerCase()).toContain("buy");
  });
  it("concern labels localized", () => {
    expect(concernLabel("th", "acne")).toBeTruthy();
    expect(concernLabel("en", "whitening").toLowerCase()).toContain("bright");
  });
});

describe("affiliate", () => {
  it("wraps the product url and is absolute", () => {
    const u = affiliateUrl({ url: "https://www.konvy.com/x-1.html", product_id: "test-123" });
    expect(u.startsWith("http")).toBe(true);
    expect(u).toContain("konvy.com");
  });
});
