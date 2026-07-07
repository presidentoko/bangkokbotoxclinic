import { districtStaticParams, districtMetadata, DistrictHubContent } from "@/lib/hub/districtContent";
import type { Metadata } from "next";

export const generateStaticParams = districtStaticParams;

export async function generateMetadata(
  props: { params: Promise<{ district: string }> }
): Promise<Metadata> {
  return districtMetadata(props, "th");
}

export default async function ThDistrictPage(props: { params: Promise<{ district: string }> }) {
  return DistrictHubContent(props, "th");
}
