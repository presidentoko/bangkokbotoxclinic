"use client";

// "이 배지를 내 홈페이지에 붙여보세요" — 백링크 유도.
//
// 광고주 유치 전략의 세 번째 축: 콘텐츠만으로는 소싱 에이전트 블로그를 못
// 이긴다. 도메인 권위가 필요하고, Verified 배지가 그 지렛대다. 공급사가 자기
// 홈페이지에 배지를 붙이면 thaisupplyhub.com 으로 향하는 진짜 백링크가 생긴다.
//
// 정적 export 사이트라 supplier 별 배지 이미지를 8,938개 굽지 않는다 —
// Cloudflare Pages 20,000 파일 한도가 이미 빠듯하다(현재 15,542). 대신 배지
// 이미지 2종(verified/listed)만 공유하고, 백링크 가치는 스니펫 안의 supplier
// 전용 href 가 만든다 — 이미지가 공용이어도 링크는 그 회사 고유 페이지다.
import { useState } from "react";

const SITE = "https://thaisupplyhub.com";

export function EmbedBadgeCTA({ supplierId, verified }: { supplierId: string; verified: boolean }) {
  const [copied, setCopied] = useState(false);
  const badgeSrc = verified ? `${SITE}/badge/verified.svg` : `${SITE}/badge/listed.svg`;
  const alt = verified ? "DBD Verified — Thai Supply Hub" : "Listed on Thai Supply Hub";
  const supplierUrl = `${SITE}/supplier/${supplierId}`;

  const snippet = `<a href="${supplierUrl}" target="_blank" rel="noopener">\n  <img src="${badgeSrc}" width="220" height="64" alt="${alt}" />\n</a>`;

  function copy() {
    navigator.clipboard.writeText(snippet).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      const el = document.createElement("textarea");
      el.value = snippet;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="bg-white border border-[var(--border)] rounded-xl p-4">
      <h3 className="text-xs font-bold uppercase tracking-wide text-[var(--muted)] mb-3">
        Embed this badge on your website
      </h3>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={badgeSrc} alt={alt} width={220} height={64} className="mb-3" />
      <p className="text-xs text-[var(--muted)] mb-3 leading-relaxed">
        Paste this on your company website — buyers who see it can click straight
        through to your profile{verified ? " and your DBD registration record" : ""}.
      </p>
      <pre className="bg-stone-50 border border-stone-200 rounded-lg p-2.5 text-[10px] leading-relaxed overflow-x-auto mb-2 whitespace-pre-wrap break-all">
        {snippet}
      </pre>
      <button
        type="button"
        onClick={copy}
        className={`w-full text-center py-2 px-3 rounded-lg text-xs font-bold border transition ${
          copied
            ? "bg-emerald-50 border-emerald-400 text-emerald-800"
            : "bg-white border-stone-300 hover:border-stone-600"
        }`}
      >
        {copied ? "✓ Copied!" : "📋 Copy embed code"}
      </button>
    </div>
  );
}
