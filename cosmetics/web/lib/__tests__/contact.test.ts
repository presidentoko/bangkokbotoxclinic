import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

describe("submitContact", () => {
  beforeEach(() => {
    vi.stubEnv("TELEGRAM_BOT_TOKEN", "test-token-123");
    vi.stubEnv("TELEGRAM_CHAT_ID", "99999999");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("returns error when name is empty", async () => {
    const { submitContact } = await import("@/app/[locale]/contact/actions");
    const fd = new FormData();
    fd.set("name", "");
    fd.set("email", "test@example.com");
    fd.set("type", "광고문의");
    fd.set("message", "This message is long enough to pass validation.");
    const result = await submitContact(null, fd);
    expect(result?.ok).toBe(false);
    expect(result?.error).toBeTruthy();
  });

  it("returns error when message is shorter than 10 chars", async () => {
    const { submitContact } = await import("@/app/[locale]/contact/actions");
    const fd = new FormData();
    fd.set("name", "Test User");
    fd.set("email", "test@example.com");
    fd.set("type", "광고문의");
    fd.set("message", "short");
    const result = await submitContact(null, fd);
    expect(result?.ok).toBe(false);
  });

  it("calls Telegram API and returns ok:true on success", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true });
    const { submitContact } = await import("@/app/[locale]/contact/actions");
    const fd = new FormData();
    fd.set("name", "Test User");
    fd.set("email", "test@example.com");
    fd.set("type", "광고문의");
    fd.set("message", "This message is long enough to pass the validation check.");
    const result = await submitContact(null, fd);
    expect(result?.ok).toBe(true);
    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.telegram.org/bottest-token-123/sendMessage",
      expect.objectContaining({ method: "POST" })
    );
  });

  it("returns ok:false when Telegram API fails", async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });
    const { submitContact } = await import("@/app/[locale]/contact/actions");
    const fd = new FormData();
    fd.set("name", "Test User");
    fd.set("email", "test@example.com");
    fd.set("type", "광고문의");
    fd.set("message", "This message is long enough to pass the validation check.");
    const result = await submitContact(null, fd);
    expect(result?.ok).toBe(false);
    expect(result?.error).toBeTruthy();
  });
});
