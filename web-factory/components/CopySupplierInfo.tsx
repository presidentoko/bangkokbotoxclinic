"use client";

import { useState } from "react";

interface Props {
  name: string;
  cityLabel: string;
  district?: string | null;
  phone?: string | null;
  website?: string | null;
  trustScore: number;
  supplierId: string;
  verified?: boolean;
}

export function CopySupplierInfo({ name, cityLabel, district, phone, website, trustScore, supplierId, verified }: Props) {
  const [copied, setCopied] = useState(false);

  function buildText() {
    const lines = [
      `🏭 ${name}`,
      `📍 ${[district, cityLabel].filter(Boolean).join(", ") || "Thailand"}`,
      phone ? `📞 ${phone}` : null,
      website ? `🌐 ${website.replace(/^https?:\/\//, "").replace(/\/$/, "")}` : null,
      verified ? `✓ DBD Verified · Trust Score: ${trustScore}/100` : `Trust Score: ${trustScore}/100`,
      `🔗 https://thaisupplyhub.com/supplier/${supplierId}`,
    ].filter(Boolean).join("\n");
    return lines;
  }

  function copy() {
    const text = buildText();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={`w-full text-left py-2 px-3 rounded-lg text-xs font-bold border transition flex items-center gap-2 ${
        copied
          ? "bg-emerald-50 border-emerald-400 text-emerald-800"
          : "bg-white border-stone-300 hover:border-stone-600"
      }`}
      title="Copy supplier info for WhatsApp / email"
    >
      <span>{copied ? "✓ Copied!" : "📋 Copy info for WhatsApp / email"}</span>
    </button>
  );
}
