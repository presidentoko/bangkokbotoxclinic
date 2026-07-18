import { districtStaticParams, districtMetadata, DistrictHubContent } from "@/lib/hub/districtContent";
import type { Metadata } from "next";

export const dynamicParams = false;
export const generateStaticParams = districtStaticParams;

export async function generateMetadata(
  props: { params: Promise<{ district: string }> }
): Promise<Metadata> {
  return districtMetadata(props, "ko");
}

export default async function KoDistrictPage(props: { params: Promise<{ district: string }> }) {
  return DistrictHubContent(props, "ko");
}
