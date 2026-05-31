"use client";
// Lightweight scroll-into-view reveal. IntersectionObserver triggers once,
// then disconnects (no re-trigger on scroll back). Respects prefers-reduced-motion via CSS.

import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

type Direction = "up" | "left" | "right" | "scale";

type Props = {
  children: ReactNode;
  className?: string;
  /** Stagger delay in ms — useful when revealing siblings. */
  delay?: number;
  /** Direction of reveal (default: up). */
  direction?: Direction;
  /** Render as this element tag (default: div). */
  as?: ElementType;
  /** Viewport threshold (0-1, default 0.1 = 10% visible). */
  threshold?: number;
};

const DIR_CLASS: Record<Direction, string> = {
  up: "reveal",
  left: "reveal reveal-left",
  right: "reveal reveal-right",
  scale: "reveal reveal-scale",
};

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  as,
  threshold = 0.1,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -40px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  const Tag = (as ?? "div") as ElementType;
  return (
    <Tag
      ref={ref}
      className={`${DIR_CLASS[direction]} ${visible ? "reveal-visible" : ""} ${className}`}
      style={delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
