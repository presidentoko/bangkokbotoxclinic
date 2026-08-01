"use client";

import { useActionState } from "react";
import { submitContact, type ContactState } from "@/app/[locale]/contact/actions";
import type { Locale } from "@/lib/i18n";

const TYPE_OPTIONS: Record<string, string[]> = {
  th: ["สอบถามโฆษณา", "พาร์ทเนอร์ชิพ", "อื่นๆ"],
  en: ["Advertising", "Partnership", "Other"],
};

export function ContactForm({ locale }: { locale: Locale }) {
  const [state, action, isPending] = useActionState<ContactState, FormData>(
    submitContact,
    null
  );
  const th = locale === "th";
  const types = th ? TYPE_OPTIONS.th : TYPE_OPTIONS.en;

  if (state?.ok) {
    return (
      <div className="rounded-2xl border border-[#efe1db] bg-white px-6 py-10 text-center shadow-sm shadow-rose-100">
        <p className="text-2xl mb-2">✅</p>
        <p className="font-semibold text-neutral-800">
          {th ? "ได้รับข้อความของคุณแล้ว" : "Message received."}
        </p>
        <p className="text-sm text-neutral-500 mt-1">
          {th ? "เราจะติดต่อกลับโดยเร็วที่สุด" : "We'll be in touch soon."}
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="locale" value={locale} />
      {state?.error && (
        <p className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-sm text-rose-600">
          ⚠️ {state.error}
        </p>
      )}

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          {th ? "ชื่อ" : "Name"}
        </label>
        <input
          name="name"
          type="text"
          required
          maxLength={100}
          className="w-full rounded-xl border border-[#efe1db] px-4 py-2.5 text-base bg-white focus:outline-none focus:ring-2 focus:ring-rose-300"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          {th ? "อีเมล" : "Email"}
        </label>
        <input
          name="email"
          type="email"
          required
          className="w-full rounded-xl border border-[#efe1db] px-4 py-2.5 text-base bg-white focus:outline-none focus:ring-2 focus:ring-rose-300"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          {th ? "ประเภทข้อความ" : "Type"}
        </label>
        <select
          name="type"
          required
          defaultValue=""
          className="w-full rounded-xl border border-[#efe1db] px-4 py-2.5 text-base bg-white focus:outline-none focus:ring-2 focus:ring-rose-300"
        >
          <option value="" disabled>
            {th ? "เลือก…" : "Select…"}
          </option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          {th ? "ข้อความ" : "Message"}
        </label>
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={2000}
          rows={5}
          className="w-full rounded-xl border border-[#efe1db] px-4 py-2.5 text-base bg-white focus:outline-none focus:ring-2 focus:ring-rose-300 resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-2xl bg-rose-500 hover:bg-rose-600 active:bg-rose-700 disabled:opacity-50 px-6 py-3 text-white font-semibold text-base transition-colors"
      >
        {isPending
          ? th ? "กำลังส่ง…" : "Sending…"
          : th ? "ส่งข้อความ" : "Send message"}
      </button>
    </form>
  );
}
