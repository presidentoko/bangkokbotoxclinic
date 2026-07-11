"use client";

import { useState } from "react";
import Image from "next/image";

type Props = {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fallbackIcon?: string;
  sizes?: string;
};

// Some scraped photo URLs (e.g. Google-hosted lh3.googleusercontent.com session links)
// expire over time. This swaps to an icon placeholder instead of a broken image.
export function CardImage({ src, alt, className, fallbackIcon = "📷", sizes = "(max-width: 768px) 50vw, 300px" }: Props) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={`flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 ${className ?? ""}`}>
        <span className="text-4xl opacity-40">{fallbackIcon}</span>
      </div>
    );
  }

  return (
    <div className={`relative ${className ?? ""}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        style={{ objectFit: "cover" }}
        onError={() => setFailed(true)}
      />
    </div>
  );
}
