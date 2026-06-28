import type { Metadata } from "next";
import Link from "next/link";
import { type Locale, LOCALES } from "@/lib/i18n";

export const revalidate = 86400;

const BASE = "https://www.bangkoktopclinic.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  void locale;
  return {
    title: "Health Check-Up Guides — Thailand Medical Tourism",
    description: "Expert guides to health check-ups in Thailand. Bangkok, Chiang Mai, Phuket, senior health, expat health, cancer screening, JCI hospitals and more.",
    alternates: {
      canonical: `${BASE}/en/guide`,
      languages: Object.fromEntries(LOCALES.map((l) => [l, `${BASE}/${l}/guide`])),
    },
  };
}

const GUIDES = [
  {
    slug: "bangkok-health-checkup",
    title: "Bangkok Health Check-Up Guide (2026)",
    description: "Complete guide to getting a health check-up in Bangkok: costs, best hospitals, what's included, how to book.",
    emoji: "🏙️",
    category: "City Guides",
  },
  {
    slug: "chiang-mai-health-checkup",
    title: "Chiang Mai Health Check-Up Guide (2026)",
    description: "Health check-up hospitals, prices and tips for Chiang Mai. 20–40% cheaper than Bangkok.",
    emoji: "🌸",
    category: "City Guides",
  },
  {
    slug: "phuket-health-checkup",
    title: "Phuket Health Check-Up Guide (2026)",
    description: "Combine your island holiday with a health check-up. Best hospitals in Phuket, prices from ฿1,900.",
    emoji: "🏝️",
    category: "City Guides",
  },
  {
    slug: "pattaya-health-checkup",
    title: "Pattaya Health Check-Up Guide (2026)",
    description: "Bangkok-quality care at lower prices. Best hospitals and packages in Pattaya.",
    emoji: "🌴",
    category: "City Guides",
  },
  {
    slug: "hua-hin-health-checkup",
    title: "Hua Hin Health Check-Up Guide (2026)",
    description: "Top choice for expat retirees. Annual health screening in a relaxed beach setting.",
    emoji: "🏖️",
    category: "City Guides",
  },
  {
    slug: "jci-hospitals-bangkok",
    title: "JCI-Accredited Hospitals in Bangkok (2026)",
    description: "All Joint Commission International accredited hospitals in Bangkok with packages and prices.",
    emoji: "🏅",
    category: "Hospital Guides",
  },
  {
    slug: "what-is-included-checkup",
    title: "What Is Included in a Health Check-Up?",
    description: "Full breakdown of blood tests, imaging, and specialist consultations in Thai hospital packages.",
    emoji: "🔬",
    category: "Understanding Your Check-Up",
  },
  {
    slug: "cancer-screening-bangkok",
    title: "Cancer Screening in Bangkok — Costs & Best Hospitals",
    description: "Which cancer markers, imaging, and screening tests are available in Bangkok and what they cost.",
    emoji: "🩺",
    category: "Specialist Screening",
  },
  {
    slug: "womens-health-checkup-bangkok",
    title: "Women's Health Check-Up in Bangkok",
    description: "Pap smear, mammogram, hormonal panels, and women's executive packages in Bangkok.",
    emoji: "💜",
    category: "Specialist Screening",
  },
  {
    slug: "cardiac-health-checkup-bangkok",
    title: "Cardiac Health Check-Up in Bangkok",
    description: "ECG, stress test, echocardiogram, coronary CT — what's included and which hospitals are best.",
    emoji: "❤️",
    category: "Specialist Screening",
  },
  {
    slug: "senior-health-checkup-thailand",
    title: "Senior Health Check-Up in Thailand (60+)",
    description: "Age-appropriate tests for seniors: bone density, cognitive screening, prostate/ovarian health.",
    emoji: "👴",
    category: "By Age & Lifestyle",
  },
  {
    slug: "health-checkup-expats-thailand",
    title: "Health Check-Up for Expats in Thailand",
    description: "Annual health screening guide for expats: which tests, which hospitals, insurance, and how to set up regular care.",
    emoji: "🌍",
    category: "By Age & Lifestyle",
  },
  {
    slug: "diabetes-screening-thailand",
    title: "Diabetes & Blood Sugar Screening in Thailand",
    description: "HbA1c, OGTT, fasting glucose — complete diabetes screening guide. Prices from ฿3,500.",
    emoji: "🩸",
    category: "Specialist Screening",
  },
  {
    slug: "heart-screening-thailand",
    title: "Heart & Cardiac Screening in Thailand",
    description: "ECG, echocardiogram, treadmill stress test — full cardiac check guide. From ฿8,000.",
    emoji: "🫀",
    category: "Specialist Screening",
  },
  {
    slug: "hat-yai-health-checkup",
    title: "Hat Yai Health Check-Up Guide (2026)",
    description: "For Malaysian and Singaporean medical tourists. 30–60% below Malaysian hospital prices.",
    emoji: "🇹🇭",
    category: "City Guides",
  },
  {
    slug: "koh-samui-health-checkup",
    title: "Koh Samui Health Check-Up Guide (2026)",
    description: "Two international hospitals on the island. Get screened during your holiday.",
    emoji: "🏝️",
    category: "City Guides",
  },
  {
    slug: "khon-kaen-health-checkup",
    title: "Khon Kaen Health Check-Up Guide (2026)",
    description: "Isan's medical hub. Quality check-ups 20–40% cheaper than Bangkok.",
    emoji: "🌿",
    category: "City Guides",
  },
  {
    slug: "korat-health-checkup",
    title: "Korat Health Check-Up Guide (2026)",
    description: "Northeast Thailand's largest city. Good for Khao Yai visitors and industrial zone workers.",
    emoji: "🏭",
    category: "City Guides",
  },
  {
    slug: "rayong-health-checkup",
    title: "Rayong Health Check-Up Guide (2026)",
    description: "Eastern Seaboard industrial hub. Bangkok Hospital Rayong + 3 other options. Prices from ฿1,500.",
    emoji: "🏭",
    category: "City Guides",
  },
  {
    slug: "surat-thani-health-checkup",
    title: "Surat Thani Health Check-Up Guide (2026)",
    description: "Gateway to Koh Samui. Get screened before catching the ferry. Prices from ฿1,300.",
    emoji: "🍜",
    category: "City Guides",
  },
  {
    slug: "phitsanulok-health-checkup",
    title: "Phitsanulok Health Check-Up Guide (2026)",
    description: "Lower North Thailand hub. 30–40% below Bangkok prices. Serves Phrae, Nan, Uttaradit.",
    emoji: "⚔️",
    category: "City Guides",
  },
  {
    slug: "trang-health-checkup",
    title: "Trang Health Check-Up Guide (2026)",
    description: "Andaman coast gem. Affordable care. Good for Trang island hopping itineraries.",
    emoji: "🦞",
    category: "City Guides",
  },
  {
    slug: "medical-visa-thailand",
    title: "Medical Visa for Thailand (2026)",
    description: "Do you need a visa for a health check-up? Tourist visa vs medical visa explained.",
    emoji: "🛂",
    category: "Practical Guides",
  },
  {
    slug: "health-insurance-thailand",
    title: "Health Insurance for Thailand",
    description: "Which insurers cover Thai hospitals? AXA, Cigna, BUPA compared. Direct billing explained.",
    emoji: "🏥",
    category: "Practical Guides",
  },
  {
    slug: "how-to-prepare-health-checkup-thailand",
    title: "How to Prepare for a Thai Health Check-Up",
    description: "Fasting, what to bring, what to avoid — complete preparation checklist.",
    emoji: "📋",
    category: "Practical Guides",
  },
  {
    slug: "best-hospitals-japanese-tourists",
    title: "Best Hospitals for Japanese Tourists (2026)",
    description: "日本語対応. Japanese coordinators, ningen dock packages, gastroscopy in Bangkok.",
    emoji: "🇯🇵",
    category: "By Nationality",
  },
  {
    slug: "best-hospitals-arabic-speakers",
    title: "Best Hospitals for Arabic-Speaking Patients (2026)",
    description: "Arabic staff, Halal food, prayer rooms. GCC and Middle East visitors' guide.",
    emoji: "🌙",
    category: "By Nationality",
  },
];

const CATEGORIES = ["City Guides", "Hospital Guides", "Understanding Your Check-Up", "Specialist Screening", "By Age & Lifestyle", "Practical Guides", "By Nationality"];

export default async function GuidesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = locale as Locale;
  const base = `/${loc}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <nav className="text-sm text-slate-400 mb-6 flex items-center gap-2">
        <Link href={base} className="hover:text-blue-600">Home</Link>
        <span>›</span>
        <span className="text-slate-600">Health Check-Up Guides</span>
      </nav>

      <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">
        Health Check-Up Guides for Thailand
      </h1>
      <p className="text-slate-600 text-lg mb-10 max-w-2xl">
        Expert guides on health screening in Thailand — from Bangkok and Phuket to specialist cancer and cardiac screening. Everything you need to plan your health check-up.
      </p>

      {CATEGORIES.map((cat) => {
        const guides = GUIDES.filter((g) => g.category === cat);
        return (
          <section key={cat} className="mb-12">
            <h2 className="text-xl font-semibold text-slate-700 mb-4 border-b border-slate-200 pb-2">{cat}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {guides.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`${base}/guide/${guide.slug}`}
                  className="group block bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md hover:border-blue-300 transition-all"
                >
                  <div className="text-3xl mb-3">{guide.emoji}</div>
                  <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 text-sm leading-snug mb-2">
                    {guide.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{guide.description}</p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      <div className="mt-8 bg-blue-50 rounded-xl p-6">
        <h2 className="font-semibold text-blue-900 mb-2">Ready to compare packages?</h2>
        <p className="text-sm text-blue-700 mb-4">Browse all health check-up packages across Thailand with real prices from 235 hospitals.</p>
        <div className="flex flex-wrap gap-3">
          <Link href={`${base}/compare`} className="bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            Compare packages →
          </Link>
          <Link href={`${base}/hospital`} className="bg-white text-blue-700 border border-blue-300 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
            Browse hospitals →
          </Link>
        </div>
      </div>
    </div>
  );
}
