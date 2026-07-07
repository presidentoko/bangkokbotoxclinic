import { cuisineStaticParams, cuisineMetadata, CuisineHubContent } from "@/lib/hub/cuisineContent";
import type { Metadata } from "next";

export const generateStaticParams = cuisineStaticParams;

export async function generateMetadata(
  props: { params: Promise<{ cuisine: string }> }
): Promise<Metadata> {
  return cuisineMetadata(props, "th");
}

export default async function ThCuisinePage(props: { params: Promise<{ cuisine: string }> }) {
  return CuisineHubContent(props, "th");
}
