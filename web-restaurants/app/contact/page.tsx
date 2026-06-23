import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { ContactForm } from "@/components/ContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "광고 문의, 데이터 수정, 미디어 문의 — SNS Stopper 팀에 연락하세요.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">Home</a>
        <span className="mx-2">›</span>
        <span>Contact</span>
      </nav>

      <h1 className="font-serif-display text-4xl text-[var(--fg)] mb-2">문의하기</h1>
      <p className="text-sm text-[var(--muted)] mb-8">
        광고·협찬, 데이터 오류 수정, 취재 문의 등 모든 연락을 받습니다.
        메시지를 보내주시면 빠르게 확인하고 직접 연락드릴게요.
      </p>

      <ContactForm />

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Contact", url: "/contact" },
      ]} />
    </div>
  );
}
