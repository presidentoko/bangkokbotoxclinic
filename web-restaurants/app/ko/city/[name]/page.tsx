import { cityStaticParams, cityMetadata, CityHubContent } from "@/lib/hub/cityContent";
import type { Metadata } from "next";


// Static on purpose. app/layout.tsx reads headers() to set <html lang>,
// which makes every route dynamic unless it opts out — so these locale
// hubs were server-rendering on every request, and middleware sends every
// Thai/Korean browser straight to them. The content language is already
// marked on the wrapper each of these renders (<div lang={locale}> in
// lib/hub/*Content.tsx), so freezing the outer <html lang> to "en" costs
// nothing a reader or a crawler can see. Same trade-off already taken by
// /th/restaurant/[id].
export const dynamic = "force-static";
export const dynamicParams = false;
export const generateStaticParams = cityStaticParams;

export async function generateMetadata(
  props: { params: Promise<{ name: string }> }
): Promise<Metadata> {
  return cityMetadata(props, "ko");
}

export default async function KoCityPage(props: { params: Promise<{ name: string }> }) {
  return CityHubContent(props, "ko");
}
