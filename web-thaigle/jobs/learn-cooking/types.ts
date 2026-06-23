// jobs/learn-cooking/types.ts

export interface SeedPlace {
  place_id: string;
  name: string;
  area: string;
  lat: number;
  lng: number;
  gmbCategory: string;
  slug: string;            // human-readable: silom-thai-cooking-class
  sourceQueries: string[]; // which queries surfaced it
}

export interface OtaMatchEntry {
  place_id: string;
  klookProductId?: string;
  gygProductId?: string;
  viatorProductId?: string;
  airbnbExpId?: string;
  confirmedAt?: string; // ISO date when a human confirmed the match
  skipped?: boolean;    // Matching failed — skip OTA for this place
}

export interface PlaceState {
  place_id: string;
  reviewsHash: string; // SHA-256 of normalized reviews — receipt skipped if same
  receiptStatus: "ok" | "insufficient" | "needs_review" | "pending";
  lastCollectedAt: string; // ISO date
  lastReceiptAt?: string;
}

export interface JobState {
  lastFullSeedAt?: string;
  lastRefreshAt?: string;
  places: Record<string, PlaceState>;
  otaMatches: Record<string, OtaMatchEntry>;
  reviewQueue: string[]; // place_ids needing human review
}
