import { cuisineStaticParams, cuisineMetadata, CuisineHubContent } from "@/lib/hub/cuisineContent";
import type { Metadata } from "next";

export const dynamicParams = false;
export const generateStaticParams = cuisineStaticParams;

export async function generateMetadata(
  props: { params: Promise<{ cuisine: string }> }
): Promise<Metadata> {
  return cuisineMetadata(props, "ko");
}

export default async function KoCuisinePage(props: { params: Promise<{ cuisine: string }> }) {
  return CuisineHubContent(props, "ko");
}
