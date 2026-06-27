"use client";
import { useEffect } from "react";
import { trackHospitalView, type RecentHospital } from "./RecentlyViewed";

export function HospitalTracker({ hospital }: { hospital: RecentHospital }) {
  useEffect(() => {
    trackHospitalView(hospital);
  }, [hospital]);
  return null;
}
