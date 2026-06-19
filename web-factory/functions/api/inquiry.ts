interface Env {
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_CHAT_ID: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const botToken = context.env.TELEGRAM_BOT_TOKEN || "8748533217:AAEeWF2hQ0lw_ezz3djk_d2NcbcDndXxvqM";
  const chatId = context.env.TELEGRAM_CHAT_ID || "8488265054";

  if (!botToken || !chatId) {
    return json({ ok: false, error: "Messaging service not configured" }, 503);
  }

  const fd = await context.request.formData();
  const get = (k: string) => String(fd.get(k) ?? "").trim();

  const name         = get("name");
  const company      = get("company");
  const email        = get("email");
  const phone        = get("phone");
  const country      = get("country");
  const category     = get("category");
  const volume       = get("volume");
  const message      = get("message");
  const locale       = get("_locale") || "en";
  const supplierName = get("_supplier_name");
  const suppliers    = get("suppliers");

  if (!name || !email || !message) {
    return json({ ok: false, error: "Missing required fields" }, 400);
  }

  const lines = [
    `🔔 New Inquiry — ThaiSupplyHub`,
    ``,
    supplierName ? `🏭 Supplier: ${supplierName}` : suppliers ? `📋 Bulk RFQ: ${suppliers}` : `📋 General Inquiry`,
    ``,
    `👤 ${name}`,
    company  && `🏢 ${company}`,
    `📧 ${email}`,
    phone    && `📱 ${phone}`,
    country  && `🌍 ${country}`,
    category && `📦 ${category}`,
    volume   && `📊 ${volume}`,
    locale !== "en" && `🌐 ${locale.toUpperCase()}`,
    ``,
    `💬 Message:`,
    message,
    ``,
    `via thaisupplyhub.com`,
  ].filter(Boolean).join("\n");

  const res = await fetch(
    `https://api.telegram.org/bot${botToken}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: lines }),
    }
  );

  if (!res.ok) {
    const err = await res.text().catch(() => "Unknown");
    return json({ ok: false, error: err }, 500);
  }

  return json({ ok: true });
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
