const HANGUL_BASE = 0xac00;
const HANGUL_LAST = 0xd7a3;
const RIEUL_BATCHIM_INDEX = 8;

// Korean particles have two allomorphs depending on whether the preceding
// syllable ends in a batchim (final consonant) -- e.g. "페이셜가" is wrong,
// "페이셜이" is right. i18n.ts templates inject dynamic labels (service
// themes, mood keywords) that can end either way, so a single hardcoded
// particle is wrong for roughly half of the 15 real labels in theme-labels.ts.
function batchimIndex(word: string): number | null {
  const trimmed = word.trim();
  const lastChar = trimmed.at(-1);
  if (!lastChar) return null;
  const code = lastChar.codePointAt(0)!;
  if (code < HANGUL_BASE || code > HANGUL_LAST) return null;
  return (code - HANGUL_BASE) % 28;
}

function hasBatchim(word: string): boolean {
  const index = batchimIndex(word);
  return index != null && index !== 0;
}

/** Subject particle: "이" after a batchim, "가" otherwise. */
export function iGa(word: string): string {
  return hasBatchim(word) ? "이" : "가";
}

/** Topic particle: "은" after a batchim, "는" otherwise. */
export function eunNeun(word: string): string {
  return hasBatchim(word) ? "은" : "는";
}

/** Object particle: "을" after a batchim, "를" otherwise. */
export function eulReul(word: string): string {
  return hasBatchim(word) ? "을" : "를";
}

/** Instrumental/directional particle: "으로" after a non-ㄹ batchim, "로" otherwise (including after a ㄹ batchim). */
export function euroRo(word: string): string {
  const index = batchimIndex(word);
  return index == null || index === 0 || index === RIEUL_BATCHIM_INDEX ? "로" : "으로";
}
