"use client";
// 클리닉 사진 — Google CDN URL 만료/차단 시 자동 플레이스홀더 전환.
// 서버 컴포넌트에서 onError 못 쓰니 이 client wrapper 사용.

import { useState } from "react";

export function ClinicPhoto({
  src,
  alt,
  className,
  placeholderIcon = "🏥",
}: {
  src: string;
  alt: string;
  className?: string;
  placeholderIcon?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 text-4xl opacity-30 ${className ?? ""}`}>
        {placeholderIcon}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
      loading="lazy"
    />
  );
}
