"use client";

import { useState } from "react";
import Image from "next/image";

type Props = {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fallbackIcon?: string;
  sizes?: string;
  priority?: boolean;
};

// Some scraped photo URLs (e.g. Google-hosted lh3.googleusercontent.com session links)
// expire over time. This swaps to an icon placeholder instead of a broken image.
export function CardImage({ src, alt, className, fallbackIcon = "📷", sizes = "(max-width: 768px) 50vw, 300px", priority }: Props) {
  const [failed, setFailed] = useState(false);

  // A handful of scraped entries store protocol-relative URLs ("//host/..."),
  // which next/image rejects outright as an invalid src.
  const normalizedSrc = src && src.startsWith("//") ? `https:${src}` : src;

  if (!normalizedSrc || failed) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 ${className ?? ""}`}>
        <span className="text-4xl opacity-40">{fallbackIcon}</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className ?? ""}`}>
      <Image
        src={normalizedSrc}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        style={{ objectFit: "cover" }}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
