"use client";

import { useState } from "react";

type Props = {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fallbackIcon?: string;
};

// Some scraped photo URLs (e.g. Google-hosted lh3.googleusercontent.com session links)
// expire over time. This swaps to an icon placeholder instead of a broken <img>.
export function CardImage({ src, alt, className, fallbackIcon = "📷" }: Props) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 ${className ?? ""}`}>
        <span className="text-4xl opacity-40">{fallbackIcon}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}
