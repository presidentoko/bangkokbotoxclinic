// Thai-locale wrapper around the canonical restaurant page. GSC shows real
// Thai-language branded queries (e.g. "มามะการ์เดน อำเภอบางละมุง") landing on
// the English-only page with zero clicks — the <title>/description a Thai
// searcher sees in the SERP didn't match their query language at all. This
// route reuses the exact same page body (review text is user-generated and
// stays in its original language either way) and only localizes the
// title/description/hreflang, which is what actually renders in search
// results and drives the click.
import type { Metadata } from "next";
import { loadMasterDb, getRestaurantById } from "@/lib/data";
import { deriveLocalityFromAddress } from "@/lib/locality";
import { CUISINE_LABELS } from "@/lib/types";
import RestaurantPage from "@/app/restaurant/[id]/page";

export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  const db = await loadMasterDb();
  return db.restaurants.map((r) => ({ id: r.id }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const db = await loadMasterDb();
  const r = getRestaurantById(db.restaurants, id);
  if (!r) return { title: "ไม่พบร้านอาหาร" };
  const cuisines = r.cuisines.map((c) => CUISINE_LABELS[c] ?? c).join(", ");
  const city = r.city_label || "Bangkok";
  const locality = r.district || deriveLocalityFromAddress(r.address);
  const place = locality ? `${locality}, ${city}` : city;
  const title = `${r.name} — รีวิวจริงและ Trust Score | ${place}`;
  const description = `${r.name} ร้าน${cuisines || "อาหาร"}ใน${place} Trust Score ${r.trust_score.toFixed(0)}/100 จาก ${r.total_reviews.toLocaleString()} รีวิว Google จริง — ไม่มีอิทธิพลอินฟลูเอนเซอร์ มีแค่ข้อมูลจริง`;
  return {
    title,
    description,
    alternates: {
      canonical: `/th/restaurant/${id}`,
      languages: {
        en: `/restaurant/${id}`,
        th: `/th/restaurant/${id}`,
        ko: `/ko/restaurant/${id}`,
        "x-default": `/restaurant/${id}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `/th/restaurant/${id}`,
      type: "article",
      siteName: "SNS Stopper",
      locale: "th_TH",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default function ThRestaurantDetailPage(props: { params: Promise<{ id: string }> }) {
  return RestaurantPage(props, "th");
}
