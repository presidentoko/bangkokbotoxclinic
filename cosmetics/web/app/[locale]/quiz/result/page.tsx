import { redirect } from "next/navigation";
import { CONCERNS, type Concern } from "@/lib/data";
import { VALID_SKINS, VALID_BUDGETS, type SkinType, type Budget } from "@/lib/quiz-config";

function parseSkin(v: string | undefined): SkinType {
  return VALID_SKINS.includes(v as SkinType) ? (v as SkinType) : "combo";
}
function parseBudget(v: string | undefined): Budget {
  return VALID_BUDGETS.includes(v as Budget) ? (v as Budget) : "mid";
}
function parseConcern(v: string | undefined): Concern {
  return CONCERNS.includes(v as Concern) ? (v as Concern) : "acne";
}

// This ?skin=&concern=&budget= route used to render its own copy of the quiz
// result page. Being query-string-driven, it could never be prerendered or
// CDN-cached, and it self-canonicalized to a different URL than the static
// /quiz/result/[skin]/[concern]/[budget] route — two indexable URLs for the
// same content. QuizClient now links straight to the path form; this route
// only exists to catch old links/shares and forward them there.
export default async function QuizResultRedirect({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string>>;
}) {
  const { locale } = await params;
  const sp = await searchParams;
  const skin = parseSkin(sp.skin);
  const concern = parseConcern(sp.concern);
  const budget = parseBudget(sp.budget);
  redirect(`/${locale}/quiz/result/${skin}/${concern}/${budget}`);
}
