import { ForBuyersPage } from "@/components/ForBuyersPage";
import { BUYERS_I18N } from "@/lib/buyersI18n";
import type { Metadata } from "next";

const t = BUYERS_I18N.en;

export const metadata: Metadata = {
  title: t.pageTitle,
  description: t.pageDesc,
  alternates: {
    canonical: "/for-buyers",
    languages: {
      "en-US": "/for-buyers",
      "ko-KR": "/ko/for-buyers",
      "th-TH": "/th/for-buyers",
      "x-default": "/for-buyers",
    },
  },
};

export default function Page() {
  return <ForBuyersPage locale="en" />;
}
