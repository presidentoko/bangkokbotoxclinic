import { redirect } from "next/navigation";
import { DEFAULT_LANG } from "@/lib/site";

export default function RootPage() {
  redirect(`/${DEFAULT_LANG}`);
}
