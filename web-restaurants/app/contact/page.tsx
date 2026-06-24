export const dynamic = "force-dynamic";

import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { ContactForm } from "@/components/ContactForm";
import { getLocale } from "@/lib/locale";
import { strings, tr } from "@/lib/strings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Ad inquiries, data corrections, media — reach the SNS Stopper team.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage() {
  const locale = await getLocale();
  const s = strings.contact;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <nav className="text-sm text-[var(--muted)] mb-4">
        <a href="/" className="hover:text-[var(--fg)]">{tr(strings.common.home, locale)}</a>
        <span className="mx-2">›</span>
        <span>{tr(s.title, locale)}</span>
      </nav>

      <h1 className="font-serif-display text-4xl text-[var(--fg)] mb-2">{tr(s.title, locale)}</h1>
      <p className="text-sm text-[var(--muted)] mb-8">{tr(s.subtitle, locale)}</p>

      <ContactForm />

      <BreadcrumbJsonLd items={[
        { name: "Home", url: "/" },
        { name: "Contact", url: "/contact" },
      ]} />
    </div>
  );
}
