"use client";

// RFQ (Request For Quote) 폼 — Formspree/Web3Forms 백엔드 POST.
// ENV NEXT_PUBLIC_RFQ_ENDPOINT 비어있으면 mailto: 폴백.

import { useState } from "react";
import { RFQ_I18N, type Locale } from "@/lib/buyersI18n";
import { formatSuppliersLine, type ShortlistItem } from "@/lib/shortlist";

const ENDPOINT = process.env.NEXT_PUBLIC_RFQ_ENDPOINT || "/api/inquiry";
const FALLBACK_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "chillanel22@gmail.com";

const CATEGORY_KEYS = [
  "manufacturer", "auto_parts", "electronics", "food_mfg", "packaging",
  "plastic", "chemical", "machinery", "machining", "textile", "rubber", "logistics", "other",
] as const;

const CATEGORY_LABEL: Record<Locale, Record<string, string>> = {
  en: {
    manufacturer: "General Manufacturer", auto_parts: "Auto Parts", electronics: "Electronics",
    food_mfg: "Food / Beverage Manufacturer", packaging: "Packaging", plastic: "Plastic / Polymer",
    chemical: "Chemical", machinery: "Machinery", machining: "Machining / Fabrication",
    textile: "Textile / Apparel", rubber: "Rubber", logistics: "Logistics / Warehouse",
    other: "Other (specify in message)",
  },
  ko: {
    manufacturer: "일반 제조사", auto_parts: "자동차 부품", electronics: "전자",
    food_mfg: "식품 / 음료 제조", packaging: "포장재", plastic: "플라스틱 / 폴리머",
    chemical: "화학", machinery: "기계", machining: "기계가공 / Fabrication",
    textile: "섬유 / 의류", rubber: "고무", logistics: "물류 / 창고",
    other: "기타 (메시지에 명시)",
  },
  th: {
    manufacturer: "ผู้ผลิตทั่วไป", auto_parts: "ชิ้นส่วนยานยนต์", electronics: "อิเล็กทรอนิกส์",
    food_mfg: "อาหาร / เครื่องดื่ม", packaging: "บรรจุภัณฑ์", plastic: "พลาสติก / โพลิเมอร์",
    chemical: "เคมี", machinery: "เครื่องจักร", machining: "กลึง / Fabrication",
    textile: "สิ่งทอ / เครื่องนุ่งห่ม", rubber: "ยาง", logistics: "โลจิสติกส์ / คลังสินค้า",
    other: "อื่นๆ (ระบุในข้อความ)",
  },
};

const VOLUME_KEYS = ["sample", "small", "medium", "large", "container"] as const;
const VOLUME_LABEL: Record<Locale, Record<string, string>> = {
  en: {
    sample: "Sample / pilot order", small: "Small (< 1,000 units/mo)",
    medium: "Medium (1,000–10,000 units/mo)", large: "Large (10,000+ units/mo)",
    container: "Container-scale (40' FCL+)",
  },
  ko: {
    sample: "샘플 / 파일럿 주문", small: "소량 (월 < 1,000개)",
    medium: "중간 (월 1,000–10,000개)", large: "대량 (월 10,000+개)",
    container: "컨테이너 (40' FCL+)",
  },
  th: {
    sample: "ตัวอย่าง / pilot order", small: "เล็ก (< 1,000 หน่วย/เดือน)",
    medium: "กลาง (1,000–10,000 หน่วย/เดือน)", large: "ใหญ่ (10,000+ หน่วย/เดือน)",
    container: "ขนาดตู้คอนเทนเนอร์ (40' FCL+)",
  },
};

type Status = "idle" | "submitting" | "success" | "error";

export function RfqForm({ locale = "en", suppliers, supplierName, supplierUrl }: { locale?: Locale; suppliers?: ShortlistItem[]; supplierName?: string; supplierUrl?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const t = RFQ_I18N[locale];
  const bulk = suppliers && suppliers.length > 0;
  const suppliersLine = bulk ? formatSuppliersLine(suppliers!) : "";
  const subject = bulk ? `Bulk RFQ — ${suppliers!.length} suppliers` : `RFQ — Thai Supply Hub (${locale})`;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set("_locale", locale);

    if (!ENDPOINT) {
      const body = [
        `Locale: ${locale}`,
        ...(supplierName ? [`Supplier: ${supplierName}`, ``] : []),
        ...(bulk ? [`Suppliers (${suppliers!.length}): ${suppliersLine}`, ``] : []),
        `Name: ${fd.get("name")}`,
        `Company: ${fd.get("company")}`,
        `Email: ${fd.get("email")}`,
        `Phone: ${fd.get("phone")}`,
        `Country: ${fd.get("country")}`,
        `Category: ${fd.get("category")}`,
        `Volume: ${fd.get("volume")}`,
        ``,
        `Message:`,
        `${fd.get("message")}`,
      ].join("\n");
      window.location.href = `mailto:${FALLBACK_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setStatus("success");
      return;
    }

    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: fd,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Submit failed");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-6 text-center">
        <div className="text-3xl mb-2">✓</div>
        <h3 className="font-bold text-lg mb-1 text-emerald-900">{t.successTitle}</h3>
        <p className="text-sm text-emerald-800">
          {t.successBody} <a href={`mailto:${FALLBACK_EMAIL}`} className="underline font-semibold">{FALLBACK_EMAIL}</a>.
        </p>
      </div>
    );
  }

  const cats = [{ v: "", label: t.catSelect }, ...CATEGORY_KEYS.map((k) => ({ v: k, label: CATEGORY_LABEL[locale][k] }))];
  const vols = [{ v: "", label: t.volSelect }, ...VOLUME_KEYS.map((k) => ({ v: k, label: VOLUME_LABEL[locale][k] }))];

  return (
    <form onSubmit={onSubmit} className="space-y-4 bg-white border border-[var(--border)] rounded-2xl p-6 md:p-8 shadow-sm">
      <input type="text" name="_gotcha" className="hidden" tabIndex={-1} autoComplete="off" />
      <input type="hidden" name="_subject" value={subject} />
      {supplierName && <input type="hidden" name="_supplier_name" value={supplierName} />}
      {supplierUrl && <input type="hidden" name="_supplier_url" value={supplierUrl} />}
      {bulk && <input type="hidden" name="suppliers" value={suppliersLine} />}

      {bulk && (
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4">
          <div className="text-xs font-bold uppercase tracking-wide text-emerald-900 mb-2">
            Requesting quotes from {suppliers!.length} supplier{suppliers!.length > 1 ? "s" : ""}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {suppliers!.map((s) => (
              <span key={s.id} className="inline-flex items-center px-2 py-0.5 rounded-full bg-white border border-emerald-300 text-xs font-medium text-emerald-900">
                {s.name}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label={t.name} name="name" required placeholder={t.placeholderName} />
        <Field label={t.company} name="company" required placeholder={t.placeholderCompany} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label={t.email} name="email" type="email" required placeholder={t.placeholderEmail} />
        <Field label="Phone" name="phone" type="tel" placeholder="+1 555 000 0000" />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label={t.country} name="country" required placeholder={t.placeholderCountry} />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Select label={t.category} name="category" required options={cats} />
        <Select label={t.volume} name="volume" required options={vols} />
      </div>

      <div>
        <label className="block text-sm font-semibold mb-1.5">{t.brief}</label>
        <textarea
          name="message"
          required
          rows={4}
          placeholder={t.placeholderBrief}
          className="w-full px-3 py-2 rounded-lg border border-[var(--border)] focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 text-sm"
        />
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full sm:w-auto px-6 py-3 rounded-lg bg-emerald-700 text-white font-bold hover:bg-emerald-800 disabled:opacity-50 transition"
      >
        {status === "submitting" ? t.submitting : t.submit}
      </button>

      {status === "error" && (
        <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg p-3">
          {t.errorPrefix} ({errorMsg}). {t.emailDirect} <a href={`mailto:${FALLBACK_EMAIL}`} className="underline">{FALLBACK_EMAIL}</a>.
        </div>
      )}

      <p className="text-xs text-[var(--muted)] leading-relaxed">{t.privacy}</p>
    </form>
  );
}

function Field({ label, name, type = "text", required, placeholder }: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1.5">{label}{required && <span className="text-red-600">*</span>}</label>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg border border-[var(--border)] focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 text-sm"
      />
    </div>
  );
}

function Select({ label, name, required, options }: { label: string; name: string; required?: boolean; options: { v: string; label: string }[] }) {
  return (
    <div>
      <label className="block text-sm font-semibold mb-1.5">{label}{required && <span className="text-red-600">*</span>}</label>
      <select
        name={name}
        required={required}
        defaultValue=""
        className="w-full px-3 py-2 rounded-lg border border-[var(--border)] focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 text-sm bg-white"
      >
        {options.map((o) => (
          <option key={o.v} value={o.v} disabled={o.v === ""}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
