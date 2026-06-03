// Stub for SiteFocus type used by ported components.
// Hair site is hair-focused only; this exists so focus-aware components
// (CountrySavings, ProcedureExplainer, etc.) compile without rewriting.

export type SiteFocus = "all" | "botox" | "filler" | "hifu" | "facial" | "laser" | "dental" | "hair";

export const HAIR_FOCUS: SiteFocus = "hair";
