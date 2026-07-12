"use client";
import { useEffect, useState } from "react";
import { OnboardingFlow } from "./OnboardingFlow";

export function OnboardingTrigger({ children }: { children: React.ReactNode }) {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("snsstopper_prefs");
      const skipped = localStorage.getItem("snsstopper_onboarding_skipped");
      if (!raw && !skipped) setShowOnboarding(true);
    } catch {}
  }, []);

  if (showOnboarding) {
    return (
      <OnboardingFlow
        onComplete={() => { setShowOnboarding(false); window.location.reload(); }}
        onSkip={() => {
          // Don't write empty prefs — that permanently disables PersonalizedSection
          // with no re-entry path. Track the skip separately so "Get personalized
          // picks" on the homepage can still trigger onboarding again.
          try { localStorage.setItem("snsstopper_onboarding_skipped", "1"); } catch {}
          setShowOnboarding(false);
        }}
      />
    );
  }

  return <>{children}</>;
}
