"use client";
import { useState } from "react";

const PURPOSES = [
  { value: "ad", label: "📢 광고 / 협찬 문의" },
  { value: "correction", label: "✏️ 데이터 오류 수정" },
  { value: "press", label: "📰 미디어 / 취재" },
  { value: "other", label: "❓ 기타" },
];

export function ContactForm() {
  const [name, setName] = useState("");
  const [purpose, setPurpose] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim() || !purpose) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, purpose, contact, message }),
      });
      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="bg-[var(--accent-light)] border border-[var(--accent)] rounded-2xl p-8 text-center">
        <div className="text-4xl mb-3">✅</div>
        <p className="font-bold text-[var(--fg)] text-lg">문의가 접수됐어요!</p>
        <p className="text-sm text-[var(--muted)] mt-2">
          연락처를 남겨주셨다면 빠르게 회신할게요.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {/* Purpose */}
      <div>
        <label className="block text-sm font-semibold text-[var(--fg)] mb-2">
          문의 유형 <span className="text-[var(--accent)]">*</span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {PURPOSES.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPurpose(p.value)}
              className={`text-left px-4 py-3 rounded-xl border text-sm font-medium transition ${
                purpose === p.value
                  ? "border-[var(--accent)] bg-[var(--accent-light)] text-[var(--accent)]"
                  : "border-[var(--border)] bg-white text-[var(--fg)] hover:border-[var(--accent)]"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-semibold text-[var(--fg)] mb-1.5">
          이름 / 회사명
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="홍길동 / SNS Inc."
          className="w-full border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[var(--accent)]"
        />
      </div>

      {/* Contact */}
      <div>
        <label className="block text-sm font-semibold text-[var(--fg)] mb-1.5">
          연락처 <span className="text-[var(--accent)]">*</span>
          <span className="text-[var(--muted)] font-normal ml-1">(이메일 / 텔레그램 / 카톡ID)</span>
        </label>
        <input
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="your@email.com  또는  @telegram_id"
          required
          className="w-full border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[var(--accent)]"
        />
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-semibold text-[var(--fg)] mb-1.5">
          내용 <span className="text-[var(--accent)]">*</span>
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={5}
          placeholder="문의 내용을 자유롭게 적어주세요."
          className="w-full border border-[var(--border)] rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[var(--accent)] resize-none"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-500">전송 실패. 잠시 후 다시 시도해주세요.</p>
      )}

      <button
        type="submit"
        disabled={!purpose || !contact.trim() || !message.trim() || status === "sending"}
        className="w-full py-3 rounded-xl bg-[var(--accent)] text-white font-bold text-sm disabled:opacity-40 transition hover:opacity-90"
      >
        {status === "sending" ? "전송 중..." : "문의 보내기 →"}
      </button>

      <p className="text-xs text-[var(--muted)] text-center">
        연락처를 남겨주시면 직접 답변드릴게요.
      </p>
    </form>
  );
}
