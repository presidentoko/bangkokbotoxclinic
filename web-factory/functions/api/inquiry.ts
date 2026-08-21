// 문의 폼 수신 → 텔레그램.
//
// ⚠️ 토큰을 이 파일에 적지 말 것.
// 2026-06-19 커밋(761f0b1)부터 봇 토큰이 `context.env.X || "리터럴"` 폴백 형태로
// 이 파일에 박힌 채 public GitHub 레포에 푸시됐고, 실제로 탈취당했다
// (봇 이름이 "BEST CASINO MINI-APP", description 이 크립토 광고로 변조된 것을 확인).
// 리터럴 폴백은 아래 "미설정이면 503" 가드까지 죽여서, 환경변수가 빠진 배포도
// 조용히 성공한 것처럼 보이게 만든다. 값은 Cloudflare Pages 환경변수에만 둔다.
interface Env {
  TELEGRAM_BOT_TOKEN: string;
  TELEGRAM_CHAT_ID: string;
}

// 텔레그램은 메시지 4096자 제한. 필드별로 미리 자른다 (초과 시 sendMessage 가 400).
const LIMITS: Record<string, number> = {
  name: 120, company: 160, email: 200, phone: 60, country: 80,
  category: 80, volume: 80, message: 2000, _supplier_name: 200, suppliers: 600,
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const botToken = context.env.TELEGRAM_BOT_TOKEN;
  const chatId = context.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    return json({ ok: false, error: "Messaging service not configured" }, 503);
  }

  // 같은 오리진에서 온 폼 제출만 받는다. 리드를 CPL 로 파는 파이프라서
  // 외부에서 긁어 쓰는 자동 제출을 막아야 한다. Origin 이 없는 요청
  // (일부 프라이버시 확장, 오래된 브라우저)은 Referer 로 한 번 더 본다.
  const site = new URL(context.request.url).origin;
  const origin = context.request.headers.get("Origin");
  const referer = context.request.headers.get("Referer");
  const sameSite = origin ? origin === site : referer ? referer.startsWith(site) : false;
  if (!sameSite) {
    return json({ ok: false, error: "Forbidden" }, 403);
  }

  let fd: FormData;
  try {
    fd = await context.request.formData();
  } catch {
    return json({ ok: false, error: "Bad request" }, 400);
  }

  const get = (k: string) => String(fd.get(k) ?? "").trim().slice(0, LIMITS[k] ?? 200);

  // 허니팟. RfqForm / LeadMagnetCta 가 화면에 안 보이는 _gotcha 를 렌더하는데
  // 서버가 그걸 읽은 적이 없어서 지금까지 순수 장식이었다. 사람은 못 채우고
  // 모든 input 을 채우는 봇만 채운다 → 값이 있으면 조용히 성공으로 응답한다
  // (에러를 주면 봇이 우회를 학습한다).
  if (String(fd.get("_gotcha") ?? "").trim()) {
    return json({ ok: true });
  }

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
  const supplierUrl  = get("_supplier_url");
  const suppliers    = get("suppliers");

  if (!name || !email || !message) {
    return json({ ok: false, error: "Missing required fields" }, 400);
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return json({ ok: false, error: "Invalid email address" }, 400);
  }

  const lines = [
    `🔔 New Inquiry — ThaiSupplyHub`,
    ``,
    supplierName ? `🏭 Supplier: ${supplierName}` : suppliers ? `📋 Bulk RFQ: ${suppliers}` : `📋 General Inquiry`,
    // 폼은 _supplier_url 을 보내는데 예전 버전이 읽지 않아, 어느 리스팅에서 온
    // 문의인지 링크가 통째로 버려지고 있었다. 응대할 때 가장 먼저 필요한 정보다.
    supplierUrl && `🔗 ${supplierUrl}`,
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
