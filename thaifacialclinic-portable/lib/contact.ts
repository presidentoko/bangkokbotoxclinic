// Central contact info. EDIT HERE when phone/address/etc change.
// Used by /about, /contact, ContactBlock component, JSON-LD schemas.

export const CONTACT = {
  brand: "Hair by Thai Facial Clinic",
  parentBrand: "Thai Facial Clinic Group",

  // Bangkok address
  address: {
    line1: "3rd floor, 272 Than Thip 3 Alley",
    district: "Phlabphla, Wang Thonglang",
    city: "Bangkok",
    postalCode: "10310",
    country: "Thailand",
  },

  // Direct channels
  line:     { id: "@405zhjqb",            url: "https://line.me/R/ti/p/@405zhjqb" },
  whatsapp: { display: "+66 61-093-4014", number: "66610934014" }, // wa.me format: no +, no leading 0
  phone:    { display: "+66 61-093-4014", tel: "+66610934014"    },
  email: {
    general:  "hello@thaifacialclinic.com",
    billing:  "billing@thaifacialclinic.com",
    partners: "partners@thaifacialclinic.com",
  },

  // Social
  instagram: "younminshin",
  facebook:  "",
  youtube:   "",
  tiktok:    "",  // removed — using Instagram only

  // Owner / about-page profile
  owner: {
    name: "Yunmin Shin",
    title: "Founder · Thai Facial Clinic Group",
    photo: "/about-owner.jpg", // save the photo at thaifacialclinic-portable/public/about-owner.jpg
    bio: "Korean-born, Bangkok-based. Started this directory after watching three friends overpay 2× for hair procedures they could have gotten in Bangkok. Believes patients deserve verified data — not paid Top-10 lists.",
  },

  // Hours (Bangkok ICT = UTC+7)
  hours: {
    weekdays: "Mon–Fri · 9:00 – 20:00 ICT",
    weekend:  "Sat–Sun · 10:00 – 18:00 ICT",
    note:     "LINE replies within 1 hour during business hours, 4 hours overnight.",
  },

  // Beneficiary for PromptPay
  paymentBeneficiary: "MR YUNMIN SHIN · TTB Bank",
} as const;

export function fullAddress(): string {
  const a = CONTACT.address;
  return [a.line1, a.district, a.city, a.postalCode, a.country].filter(Boolean).join(", ");
}

export function whatsappLink(message?: string): string {
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${CONTACT.whatsapp.number}${text}`;
}
