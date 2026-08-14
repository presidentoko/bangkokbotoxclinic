import { permanentRedirect } from "next/navigation";
import { DEFAULT_LANG } from "@/lib/site";

export default function RootPage() {
  permanentRedirect(`/${DEFAULT_LANG}`);
}
