"use client";
import { useEffect, useState } from "react";
import { OnboardingFlow } from "./OnboardingFlow";

export function OnboardingTrigger({ children }: { children: React.ReactNode }) {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem("snsstopper_prefs");
    if (!raw) setShowOnboarding(true);
  }, []);

  if (showOnboarding) {
    return (
      <OnboardingFlow
        onComplete={() => { setShowOnboarding(false); window.location.reload(); }}
        onSkip={() => {
          localStorage.setItem("snsstopper_prefs", JSON.stringify({ cuisines: [], atmosphere: [], dietary: [], completedAt: Date.now() }));
          setShowOnboarding(false);
        }}
      />
    );
  }

  return <>{children}</>;
}
