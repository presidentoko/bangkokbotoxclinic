// Central contact info for web/ (botox + dental sites). Mirrors thaifacialclinic-portable/lib/contact.ts.
// Brand-aware via getSiteConfig() — same person/address/LINE/WhatsApp, brand label swaps.

import { getSiteConfig } from "./site";

export const CONTACT = {
  owner: {
    name: "Yunmin Shin",
    title: "Founder",
    photo: "/about-owner.jpg",
    bio: "Korean-born, Bangkok-based. Started this directory after watching three friends overpay 2× for procedures they could have gotten in Bangkok. Believes patients deserve verified data — not paid Top-10 lists.",
  },
  address: {
    line1: "3rd floor, 272 Than Thip 3 Alley",
    district: "Phlabphla, Wang Thonglang",
    city: "Bangkok",
    postalCode: "10310",
    country: "Thailand",
  },
  line: {
    id: "@405zhjqb",
    url: "https://line.me/R/ti/p/@405zhjqb",
  },
  whatsapp: {
    display: "+66 61-093-4014",
    number: "66610934014",
    url: "https://wa.me/66610934014",
  },
  phone: {
    display: "+66 61-093-4014",
    tel: "+66610934014",
  },
  instagram: {
    handle: "younminshin",
    url: "https://instagram.com/younminshin",
  },
  paymentBeneficiary: "MR YUNMIN SHIN · TTB Bank",
};

/** Brand-specific emails — separate inbox per site for billing/leads routing. */
export function siteEmails() {
  const cfg = getSiteConfig();
  const domain = cfg.domain === "RESERVED-do-not-deploy.invalid" ? "bkkclinics.com" : cfg.domain;
  return {
    general: `hello@${domain}`,
    billing: `billing@${domain}`,
    partners: `partners@${domain}`,
    leads: `leads@${domain}`,
  };
}

/** Single-line address used in JSON-LD + footer. */
export function formattedAddress(): string {
  const a = CONTACT.address;
  return `${a.line1}, ${a.district}, ${a.city} ${a.postalCode}, ${a.country}`;
}
