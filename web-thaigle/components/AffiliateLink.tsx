"use client";

import { trackAffiliateClick, type AffiliateClickEvent } from "@/lib/track";

type Props = {
  href: string;
  tracking: AffiliateClickEvent;
  className?: string;
  children: React.ReactNode;
};

export function AffiliateLink({ href, tracking, className, children }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer sponsored nofollow"
      className={className}
      onClick={() => trackAffiliateClick(tracking)}
    >
      {children}
    </a>
  );
}
