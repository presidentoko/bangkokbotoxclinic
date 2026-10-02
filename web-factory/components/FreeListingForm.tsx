"use client";

// 무료 등재 신청 폼.
//
// 왜 생겼나 (2026-10-02): 욕실가구 OEM 공장이 메일로 "무료 등재를 어디서
// 신청하나" 라고 물었다. FAQ 와 /about 은 둘 다 "listings are free — see
// /for-suppliers" 라고 보내는데, 그 페이지에는 유료 Verified 주문 폼만 있었고
// "free" 라는 단어조차 없었다. 약속만 하고 수단이 없던 것이다.
//
// 받는 항목은 등재에 실제로 필요한 것만 둔다. DBD 등기번호를 묻는 이유는
// Verified 배지의 근거가 그것뿐이기 때문이고, 없어도 등재는 된다 — 그래서
// 필수가 아니다.
import { useState } from "react";

const ENDPOINT = "/api/inquiry";

type Status = "idle" | "submitting" | "success" | "error";

export function FreeListingForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [trap, setTrap] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.set("_subject", "Free listing request — supplier");
    fd.set("_gotcha", trap);
    if (typeof window !== "undefined") {
      fd.set("_source_path", window.location.pathname);
    }
    // 서버는 name·email·message 를 필수로 본다. 신청 내용을 message 로 모은다.
    const lines = [
      `Free listing request`,
      `Company (as registered): ${fd.get("company") ?? ""}`,
      `DBD registration no: ${fd.get("dbd_reg_no") || "not provided"}`,
      `Province: ${fd.get("province") ?? ""}`,
      `Website: ${fd.get("website") || "none"}`,
      `Phone for buyers: ${fd.get("phone") ?? ""}`,
      `Products / capability: ${fd.get("products") ?? ""}`,
      `OEM / ODM: ${fd.get("oem_odm") || "not specified"}`,
      `Certifications: ${fd.get("certs") || "none stated"}`,
      `Notes: ${fd.get("notes") || "-"}`,
    ];
    fd.set("message", lines.join("\n"));

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
      <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-6">
        <h3 className="font-bold text-lg text-emerald-900 mb-2">Request received</h3>
        <p className="text-sm text-emerald-900/80 leading-relaxed">
          We check the company registration before a listing goes live, so this takes a few business
          days rather than being instant. If anything is unclear we will email you. The listing is
          free and stays free — the fee on this page is only for the DBD-verified badge, which is a
          separate thing.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-xl border border-[var(--border)] bg-white p-6">
      <h3 className="font-bold text-lg mb-1">Request a free listing</h3>
      <p className="text-sm text-[var(--muted)] mb-5 leading-relaxed">
        For Thai manufacturers, industrial operators, warehouses and logistics providers. No charge,
        now or later. We verify the company registration before publishing, which is why we ask for
        the details below.
      </p>

      {/* 봇 트랩 — 서버가 _gotcha 를 읽어 조용히 버린다. */}
      <input
        type="text"
        value={trap}
        onChange={(e) => setTrap(e.target.value)}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <Field name="company" label="Company name, as registered" required
               placeholder="Prowood Factory Limited" />
        <Field name="dbd_reg_no" label="DBD registration number (optional)"
               placeholder="13 digits — speeds up verification" />
        <Field name="name" label="Your name" required placeholder="Contact person" />
        <Field name="email" label="Your email" type="email" required placeholder="you@company.com" />
        <Field name="phone" label="Phone for buyers" required placeholder="+66 2 000 0000" />
        <Field name="province" label="Province" required placeholder="Samut Prakan" />
        <Field name="website" label="Website (optional)" placeholder="https://" />
        <div>
          <label className="block text-sm font-medium mb-1.5" htmlFor="oem_odm">
            OEM / ODM
          </label>
          <select
            id="oem_odm"
            name="oem_odm"
            className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-white"
            defaultValue=""
          >
            <option value="">Select…</option>
            <option value="OEM only">OEM only</option>
            <option value="ODM only">ODM only</option>
            <option value="OEM and ODM">OEM and ODM</option>
            <option value="Not applicable">Not applicable</option>
          </select>
        </div>
      </div>

      <div className="mt-4 grid gap-4">
        <Area name="products" label="What you make or do" required
              placeholder="e.g. bathroom vanities and mirror cabinets, melamine and plywood, 500–5,000 pcs per order" />
        <Area name="certs" label="Certifications (optional)"
              placeholder="ISO 9001, FSC, HACCP, IATF 16949 …" />
        <Area name="notes" label="Anything else (optional)" placeholder="Export markets, factory size, main buyers" />
      </div>

      {status === "error" && (
        <p className="mt-4 text-sm text-red-700">
          Could not send ({errorMsg}). Email us directly at inquiry@thaisupplyhub.com and we will
          add you manually.
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-5 w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[var(--gold-deep)] text-white font-bold text-sm hover:opacity-90 disabled:opacity-60 transition"
      >
        {status === "submitting" ? "Sending…" : "Submit for free listing"}
      </button>
    </form>
  );
}

function Field({ name, label, required, placeholder, type = "text" }: {
  name: string; label: string; required?: boolean; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" htmlFor={name}>
        {label}{required && <span className="text-red-600"> *</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm"
      />
    </div>
  );
}

function Area({ name, label, required, placeholder }: {
  name: string; label: string; required?: boolean; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" htmlFor={name}>
        {label}{required && <span className="text-red-600"> *</span>}
      </label>
      <textarea
        id={name}
        name={name}
        required={required}
        rows={2}
        placeholder={placeholder}
        className="w-full border border-[var(--border)] rounded-lg px-3 py-2 text-sm"
      />
    </div>
  );
}
