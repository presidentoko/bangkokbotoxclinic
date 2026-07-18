"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { SKIN_LABELS, BUDGET_LABELS, CONCERN_QUIZ_META, CONCERNS, type SkinType, type Budget, type Concern } from "@/lib/quiz-config";

type Step = "skin" | "concern" | "budget" | "loading";

interface Answers {
  skin?: SkinType;
  concern?: Concern;
  budget?: Budget;
}

export function QuizClient({ locale }: { locale: Locale }) {
  const router = useRouter();
  const isTh = locale === "th";
  const [step, setStep] = useState<Step>("skin");
  const [answers, setAnswers] = useState<Answers>({});

  const progress = step === "loading" ? 100 : step === "budget" ? 66 : step === "concern" ? 33 : 0;

  function pickSkin(skin: SkinType) {
    setAnswers((a) => ({ ...a, skin }));
    setStep("concern");
  }

  function pickConcern(concern: Concern) {
    setAnswers((a) => ({ ...a, concern }));
    setStep("budget");
  }

  function pickBudget(budget: Budget) {
    const final = { ...answers, budget };
    setAnswers(final);
    setStep("loading");
    setTimeout(() => {
      router.push(`/${locale}/quiz/result?skin=${final.skin}&concern=${final.concern}&budget=${budget}`);
    }, 700);
  }

  function goBack() {
    if (step === "concern") setStep("skin");
    if (step === "budget") setStep("concern");
  }

  return (
    <div className="max-w-lg mx-auto py-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-widest text-[#c9a86a] font-medium">
          {isTh ? "แบบทดสอบ" : "Skin quiz"}
        </p>
        <h1 className="font-serif-display text-3xl font-semibold text-[#2b2222]">
          {isTh ? "หาสกินแคร์ที่ใช่สำหรับคุณ 🌸" : "Find your perfect skincare 🌸"}
        </h1>
        <p className="text-sm text-neutral-500">
          {isTh ? "ตอบ 3 คำถาม รับคำแนะนำที่เหมาะกับผิวคุณ" : "Answer 3 quick questions for personalised picks"}
        </p>
      </div>

      {/* Progress */}
      <div className="h-1.5 bg-rose-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-rose-400 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step: skin type */}
      {step === "skin" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif-display text-xl font-semibold text-[#2b2222]">
              {isTh ? "ผิวคุณเป็นแบบไหน?" : "What's your skin type?"}
            </h2>
            <span className="text-xs text-neutral-400 font-medium">1 / 3</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(["oily", "dry", "combo", "sensitive"] as SkinType[]).map((s) => (
              <button
                key={s}
                onClick={() => pickSkin(s)}
                className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-rose-100 hover:border-rose-300 bg-white hover:bg-rose-50 p-4 text-center transition-all active:scale-[0.98] min-h-[88px]"
              >
                <span className="text-2xl">{SKIN_LABELS[s].emoji}</span>
                <span className="text-sm font-semibold text-[#2b2222]">
                  {isTh ? SKIN_LABELS[s].th : SKIN_LABELS[s].en}
                </span>
                <span className="text-[11px] text-neutral-400 leading-snug">
                  {isTh ? SKIN_LABELS[s].desc_th : SKIN_LABELS[s].desc_en}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step: concern */}
      {step === "concern" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif-display text-xl font-semibold text-[#2b2222]">
              {isTh ? "ปัญหาผิวหลักของคุณ?" : "Your main skin concern?"}
            </h2>
            <span className="text-xs text-neutral-400 font-medium">2 / 3</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {CONCERNS.map((c) => {
              const meta = CONCERN_QUIZ_META[c];
              return (
                <button
                  key={c}
                  onClick={() => pickConcern(c)}
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-rose-100 hover:border-rose-300 bg-white hover:bg-rose-50 p-4 text-center transition-all active:scale-[0.98] min-h-[80px]"
                >
                  <span className="text-2xl">{meta?.emoji}</span>
                  <span className="text-sm font-semibold text-[#2b2222] leading-snug">
                    {isTh ? meta?.th : meta?.en}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Step: budget */}
      {step === "budget" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif-display text-xl font-semibold text-[#2b2222]">
              {isTh ? "งบประมาณของคุณ?" : "What's your budget?"}
            </h2>
            <span className="text-xs text-neutral-400 font-medium">3 / 3</span>
          </div>
          <div className="flex flex-col gap-3">
            {(["low", "mid", "high"] as Budget[]).map((b) => (
              <button
                key={b}
                onClick={() => pickBudget(b)}
                className="flex items-center justify-between rounded-2xl border-2 border-rose-100 hover:border-rose-300 bg-white hover:bg-rose-50 px-5 py-4 text-left transition-all active:scale-[0.98]"
              >
                <div>
                  <div className="font-semibold text-[#2b2222]">
                    {isTh ? BUDGET_LABELS[b].th : BUDGET_LABELS[b].en}
                  </div>
                  <div className="text-sm text-neutral-500 mt-0.5">
                    {isTh ? BUDGET_LABELS[b].desc_th : BUDGET_LABELS[b].desc_en}
                  </div>
                </div>
                <span className="text-rose-400 text-lg">→</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading state */}
      {step === "loading" && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-rose-200 border-t-rose-500 animate-spin" />
          <p className="text-neutral-500 text-sm">
            {isTh ? "กำลังหาผลิตภัณฑ์ที่เหมาะกับคุณ…" : "Finding your perfect match…"}
          </p>
        </div>
      )}

      {/* Back button */}
      {(step === "concern" || step === "budget") && (
        <button
          onClick={goBack}
          className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          ← {isTh ? "ย้อนกลับ" : "Back"}
        </button>
      )}
    </div>
  );
}
