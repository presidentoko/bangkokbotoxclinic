"use client";
// 다단계 예약/문의 폼 — service → date → contact → confirm.
// 2026-07-13: lang prop 추가, shared/lib/i18n.ts 의 booking 섹션(이미 en/ko/th 번역됨) 재사용.

import { useState } from "react";
import { tFor, type Lang } from "@/lib/i18n";

type ServiceOpt = { id: string; label: Record<Lang, string>; emoji: string };

// Focus 별 서비스 목록 — Dental 사이트에 implants/veneers가 없거나
// Hair 사이트에 botox만 보이는 mismatch 방지.
const ALL_SERVICES: ServiceOpt[] = [
  { id: "botox", label: { en: "Botox", ko: "보톡스", th: "โบท็อกซ์" }, emoji: "💉" },
  { id: "filler", label: { en: "Filler", ko: "필러", th: "ฟิลเลอร์" }, emoji: "💧" },
  { id: "hifu", label: { en: "HIFU / Ulthera", ko: "HIFU / 울쎄라", th: "HIFU / อัลเทอร่า" }, emoji: "⚡" },
  { id: "facial", label: { en: "Facial / Skincare", ko: "페이셜 / 스킨케어", th: "เฟเชียล / สกินแคร์" }, emoji: "🌸" },
  { id: "laser", label: { en: "Laser", ko: "레이저", th: "เลเซอร์" }, emoji: "✨" },
  { id: "consult", label: { en: "General consultation", ko: "일반 상담", th: "ปรึกษาทั่วไป" }, emoji: "💬" },
];

const DENTAL_SERVICES: ServiceOpt[] = [
  { id: "dental_implant", label: { en: "Dental implant", ko: "임플란트", th: "รากฟันเทียม" }, emoji: "🦷" },
  { id: "veneers", label: { en: "Veneers", ko: "비니어", th: "วีเนียร์" }, emoji: "✨" },
  { id: "whitening", label: { en: "Whitening", ko: "미백", th: "ฟอกสีฟัน" }, emoji: "🌟" },
  { id: "orthodontics", label: { en: "Orthodontics / Braces", ko: "교정", th: "จัดฟัน" }, emoji: "😬" },
  { id: "all_on_4", label: { en: "All-on-4", ko: "올온포", th: "All-on-4" }, emoji: "🦷" },
  { id: "consult", label: { en: "General consultation", ko: "일반 상담", th: "ปรึกษาทั่วไป" }, emoji: "💬" },
];

const HAIR_SERVICES: ServiceOpt[] = [
  { id: "fue", label: { en: "FUE Transplant", ko: "FUE 이식", th: "ปลูกผม FUE" }, emoji: "💇" },
  { id: "dhi", label: { en: "DHI Transplant", ko: "DHI 이식", th: "ปลูกผม DHI" }, emoji: "💇‍♂️" },
  { id: "smp", label: { en: "Scalp Micropigmentation", ko: "두피 미세색소", th: "สักไมโครเม็ดสีหนังศีรษะ" }, emoji: "🎨" },
  { id: "beard_transplant", label: { en: "Beard / Eyebrow", ko: "수염 / 눈썹", th: "หนวดเครา / คิ้ว" }, emoji: "🧔" },
  { id: "scalp_care", label: { en: "Scalp / PRP / Mesotherapy", ko: "두피 / PRP / 메조테라피", th: "หนังศีรษะ / PRP / เมโสเธอราพี" }, emoji: "💧" },
  { id: "consult", label: { en: "General consultation", ko: "일반 상담", th: "ปรึกษาทั่วไป" }, emoji: "💬" },
];

function servicesForFocus(): ServiceOpt[] {
  // NEXT_PUBLIC_SITE_FOCUS는 client에서도 접근 가능 (빌드시 inline).
  const focus = process.env.NEXT_PUBLIC_SITE_FOCUS;
  if (focus === "dental") return DENTAL_SERVICES;
  if (focus === "hair") return HAIR_SERVICES;
  return ALL_SERVICES;
}

const SERVICES = servicesForFocus();

// 추가 번역 — shared i18n.ts 의 booking 섹션이 안 덮는 부분(disclosure, consent, Row 라벨 등).
const EXTRA: Record<Lang, {
  whereGoes: string; forwardClinic: string; forwardGeneral: string; noSell: string; privacy: string;
  watchInbox: string; hourWithin: string; notified: string;
  rowService: string; rowDate: string; rowTime: string; rowName: string; rowEmail: string; rowPhone: string; rowClinic: string; rowNotes: string;
  consentPre: string; matchingClinic: string; consentPost: string;
  fullName: string; notesPlaceholder: string; consentTitle: string;
}> = {
  en: {
    whereGoes: "Where this goes:",
    forwardClinic: "We forward your details to {clinic} so a staff member can confirm time, pricing, and brand availability — and to our internal admin for follow-up if they don't respond within 24h.",
    forwardGeneral: "We forward your details to the clinic(s) best matching your request, and to our internal admin so we can follow up if there's no response within 24h.",
    noSell: "We don't sell or rent your data. See", privacy: "privacy policy",
    watchInbox: "Watch your inbox · Mark our messages as not-spam to keep replies fast",
    hourWithin: "24 hours", notified: "will be notified of your request.",
    rowService: "Service", rowDate: "Date", rowTime: "Time", rowName: "Name", rowEmail: "Email", rowPhone: "Phone", rowClinic: "Clinic", rowNotes: "Notes",
    consentPre: "I agree to share my contact details with", matchingClinic: "the matching clinic",
    consentPost: "and the site admin for the purpose of confirming this booking, in line with the",
    fullName: "Full name", notesPlaceholder: "Any specific concerns, areas, or questions",
    consentTitle: "Please tick consent above",
  },
  ko: {
    whereGoes: "전달되는 곳:",
    forwardClinic: "{clinic}에 상세 정보를 전달해 시간·가격·브랜드 가능 여부를 확인하며, 24시간 내 응답이 없으면 내부 관리자가 follow-up합니다.",
    forwardGeneral: "요청에 가장 적합한 클리닉에 상세 정보를 전달하고, 24시간 내 응답이 없으면 내부 관리자가 follow-up합니다.",
    noSell: "귀하의 정보를 판매·대여하지 않습니다. 자세히 보기:", privacy: "개인정보처리방침",
    watchInbox: "메일함을 확인해주세요 · 스팸함으로 가지 않도록 '스팸 아님'으로 표시해주시면 빠른 답변에 도움됩니다",
    hourWithin: "24시간", notified: "에 요청이 전달됩니다.",
    rowService: "시술", rowDate: "날짜", rowTime: "시간", rowName: "이름", rowEmail: "이메일", rowPhone: "전화번호", rowClinic: "클리닉", rowNotes: "메모",
    consentPre: "연락처 정보를", matchingClinic: "매칭된 클리닉",
    consentPost: "및 사이트 관리자와 이 예약 확인 목적으로 공유하는 데 동의합니다. 자세한 내용은",
    fullName: "성함", notesPlaceholder: "궁금한 점이나 특별히 신경쓰이는 부분",
    consentTitle: "위 동의에 체크해주세요",
  },
  th: {
    whereGoes: "ข้อมูลนี้จะถูกส่งไปที่:",
    forwardClinic: "เราส่งข้อมูลของคุณไปยัง {clinic} เพื่อให้เจ้าหน้าที่ยืนยันเวลา ราคา และความพร้อมของแบรนด์ — และแจ้งแอดมินภายในเพื่อติดตามหากไม่ตอบกลับภายใน 24 ชม.",
    forwardGeneral: "เราส่งข้อมูลของคุณไปยังคลินิกที่เหมาะสมที่สุด และแจ้งแอดมินภายในเพื่อติดตามหากไม่มีการตอบกลับภายใน 24 ชม.",
    noSell: "เราไม่ขายหรือให้เช่าข้อมูลของคุณ ดู", privacy: "นโยบายความเป็นส่วนตัว",
    watchInbox: "เช็คอีเมลของคุณ · ทำเครื่องหมายข้อความของเราว่าไม่ใช่สแปมเพื่อรับการตอบกลับเร็วขึ้น",
    hourWithin: "24 ชั่วโมง", notified: "จะได้รับการแจ้งคำขอของคุณ",
    rowService: "บริการ", rowDate: "วันที่", rowTime: "เวลา", rowName: "ชื่อ", rowEmail: "อีเมล", rowPhone: "โทรศัพท์", rowClinic: "คลินิก", rowNotes: "หมายเหตุ",
    consentPre: "ฉันยินยอมแบ่งปันข้อมูลติดต่อของฉันกับ", matchingClinic: "คลินิกที่จับคู่",
    consentPost: "และแอดมินเว็บไซต์เพื่อวัตถุประสงค์ในการยืนยันการจองนี้ ตามที่ระบุใน",
    fullName: "ชื่อ-นามสกุล", notesPlaceholder: "ข้อกังวล บริเวณที่สนใจ หรือคำถามเฉพาะ",
    consentTitle: "กรุณาติ๊กยินยอมด้านบน",
  },
};

export function BookingForm({
  clinicId, clinicName, defaultService, lang = "en",
}: {
  clinicId?: string;
  clinicName?: string;
  defaultService?: string;
  lang?: Lang;
}) {
  const t = tFor(lang);
  const x = EXTRA[lang] ?? EXTRA.en;
  const [step, setStep] = useState(0);
  const [service, setService] = useState(defaultService ?? "");
  const [dateStr, setDateStr] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "ok" | "error">("idle");

  const today = new Date();
  today.setDate(today.getDate() + 1); // 내일부터 가능
  // toISOString()은 UTC 기준이라 태국 새벽(UTC+7)엔 하루 밀림 — 로컬 날짜로 조립.
  const minDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  async function submit() {
    setStatus("submitting");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          message: notes,
          clinicId,
          clinicName,
          service,
          context: clinicName ? "booking_clinic" : "booking_general",
          name,
          phone,
          date: dateStr,
          timeSlot,
          _hp: honeypot,
        }),
      });
      setStatus(res.ok ? "ok" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "ok") {
    return (
      <div className="bg-gradient-to-br from-green-50 via-white to-emerald-50 border-2 border-green-300 rounded-xl p-8 text-center shadow-lg">
        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-green-500 text-white flex items-center justify-center text-3xl font-black shadow-md">
          ✓
        </div>
        <h3 className="font-black text-xl mb-2">{t.booking.receivedTitle}</h3>
        <p className="text-sm text-[var(--muted)] max-w-md mx-auto leading-relaxed">
          {t.booking.receivedBody}
          {clinicName ? <> <strong className="text-[var(--fg)]">{clinicName}</strong> {x.notified}</> : ""}
        </p>
        <p className="text-[11px] text-[var(--muted)] mt-4 opacity-80">
          {x.watchInbox}
        </p>
      </div>
    );
  }

  const heading = clinicName ? t.booking.headingClinic.replace("{name}", clinicName) : t.booking.heading;
  const steps = t.booking.steps;

  return (
    <div className="bg-white border border-[var(--border)] rounded-xl overflow-hidden">
      {/* Honeypot — 봇만 채우는 invisible field */}
      <input
        type="text"
        name="website_url_confirm"
        tabIndex={-1}
        autoComplete="off"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        style={{ position: "absolute", left: "-9999px", opacity: 0, pointerEvents: "none" }}
        aria-hidden="true"
      />
      <div className="px-5 pt-5">
        <h3 className="font-bold text-lg">{heading}</h3>
        <p className="text-xs text-[var(--muted)] mt-1">
          {t.booking.sub}
        </p>
        {/* Data-handling disclosure — visible upfront, before user fills anything */}
        <div className="mt-3 text-[11px] leading-relaxed text-[var(--muted)] bg-slate-50 border border-[var(--border)] rounded-lg p-3">
          <strong className="text-[var(--fg)]">{x.whereGoes}</strong>{" "}
          {clinicName
            ? x.forwardClinic.split("{clinic}").map((part, i, arr) => i < arr.length - 1
                ? <span key={i}>{part}<strong className="text-[var(--fg)]">{clinicName}</strong></span>
                : <span key={i}>{part}</span>)
            : x.forwardGeneral}
          {" "}{x.noSell}{" "}
          <a href="/privacy" target="_blank" rel="noreferrer" className="underline text-[var(--fg)] hover:opacity-70">{x.privacy}</a>.
        </div>
        {/* Progress — 큰 step indicator + 현재 step label */}
        <div className="mt-4">
          <div className="flex items-center gap-1.5">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center gap-1.5 flex-1">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    i < step
                      ? "bg-green-500 text-white shadow-sm"
                      : i === step
                      ? "bg-black text-white ring-4 ring-black/15 scale-105"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {i < step ? "✓" : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-1 rounded-full transition-colors ${i < step ? "bg-green-500" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="mt-2 text-[11px] uppercase tracking-widest text-[var(--muted)] font-bold">
            Step {step + 1} of {steps.length} · <span className="text-[var(--fg)]">{steps[step]}</span>
          </div>
        </div>
      </div>

      <div className="p-5">
        {step === 0 && (
          <div>
            <label className="block text-sm font-medium mb-3">{t.booking.selectService}</label>
            <div className="grid grid-cols-2 gap-2">
              {SERVICES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => { setService(s.id); setStep(1); }}
                  className={`text-left px-3 py-3 rounded-lg border transition flex items-center gap-2 ${
                    service === s.id
                      ? "border-black bg-gray-50"
                      : "border-[var(--border)] hover:border-gray-400"
                  }`}
                >
                  <span className="text-xl">{s.emoji}</span>
                  <span className="text-sm font-medium">{s.label[lang] ?? s.label.en}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">{t.booking.preferredDate}</label>
              <input
                type="date"
                value={dateStr}
                min={minDate}
                onChange={(e) => setDateStr(e.target.value)}
                className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-base focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">{t.booking.timeSlot}</label>
              <div className="grid grid-cols-2 gap-2">
                {t.booking.timeSlots.map((ts, i) => (
                  <button
                    key={ts}
                    type="button"
                    onClick={() => setTimeSlot(ts)}
                    className={`px-3 py-2 rounded-lg border text-sm transition ${
                      timeSlot === ts
                        ? "border-black bg-gray-50 font-medium"
                        : "border-[var(--border)] hover:border-gray-400"
                    }`}
                  >
                    {ts}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(0)}
                className="px-4 py-2.5 rounded-lg border border-[var(--border)] text-sm font-medium hover:bg-gray-50"
              >
                {t.booking.back}
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!dateStr || !timeSlot}
                className="flex-1 px-4 py-2.5 rounded-lg bg-black text-white text-sm font-bold hover:bg-gray-800 disabled:opacity-40"
              >
                {t.booking.continue}
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1.5">{t.booking.name}</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={x.fullName}
                className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-base focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">{t.booking.email}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-base focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">{t.booking.phone} <span className="text-[var(--muted)] font-normal">{t.booking.optional}</span></label>
              <input
                type="tel"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+66 ..."
                className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-base focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">{t.booking.notes} <span className="text-[var(--muted)] font-normal">{t.booking.optional}</span></label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder={x.notesPlaceholder}
                className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-base focus:outline-none focus:border-black resize-none"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2.5 rounded-lg border border-[var(--border)] text-sm font-medium hover:bg-gray-50"
              >
                {t.booking.back}
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!name || !email || !email.includes("@")}
                className="flex-1 px-4 py-2.5 rounded-lg bg-black text-white text-sm font-bold hover:bg-gray-800 disabled:opacity-40"
              >
                {t.booking.review}
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-4 space-y-1.5 text-sm">
              <Row label={x.rowService} value={SERVICES.find(s => s.id === service)?.label[lang] ?? service} />
              <Row label={x.rowDate} value={dateStr} />
              <Row label={x.rowTime} value={timeSlot} />
              <Row label={x.rowName} value={name} />
              <Row label={x.rowEmail} value={email} />
              {phone && <Row label={x.rowPhone} value={phone} />}
              {clinicName && <Row label={x.rowClinic} value={clinicName} />}
              {notes && <Row label={x.rowNotes} value={notes} />}
            </div>

            {/* Consent — required before submit */}
            <label className="flex items-start gap-2 cursor-pointer select-none p-3 border border-[var(--border)] rounded-lg hover:bg-gray-50 transition">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-black shrink-0"
              />
              <span className="text-xs leading-relaxed text-[var(--fg)]">
                {x.consentPre}{" "}
                {clinicName ? <strong>{clinicName}</strong> : x.matchingClinic}{" "}
                {x.consentPost}{" "}
                <a href="/privacy" target="_blank" rel="noreferrer" className="underline">{x.privacy}</a>.
              </span>
            </label>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-4 py-2.5 rounded-lg border border-[var(--border)] text-sm font-medium hover:bg-gray-50"
              >
                {t.booking.back}
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={status === "submitting" || !consent}
                className="flex-1 px-4 py-2.5 rounded-lg bg-black text-white text-sm font-bold hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
                title={!consent ? x.consentTitle : undefined}
              >
                {status === "submitting" ? t.booking.sending : t.booking.confirm}
              </button>
            </div>
            {status === "error" && (
              <p className="text-xs text-red-700 text-center">{t.booking.error}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-[var(--muted)] text-xs uppercase tracking-wide">{label}</span>
      <span className="font-medium text-right truncate max-w-[60%]">{value}</span>
    </div>
  );
}
