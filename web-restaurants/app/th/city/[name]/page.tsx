import { cityStaticParams, cityMetadata, CityHubContent } from "@/lib/hub/cityContent";
import type { Metadata } from "next";

export const dynamicParams = false;
export const generateStaticParams = cityStaticParams;

export async function generateMetadata(
  props: { params: Promise<{ name: string }> }
): Promise<Metadata> {
  return cityMetadata(props, "th");
}

export default async function ThCityPage(props: { params: Promise<{ name: string }> }) {
  return CityHubContent(props, "th");
}
