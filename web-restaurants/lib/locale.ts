import { cookies } from "next/headers";

export type Locale = "en" | "ko" | "th";

export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const v = store.get("NEXT_LOCALE")?.value;
  if (v === "ko" || v === "th") return v;
  return "en";
}
