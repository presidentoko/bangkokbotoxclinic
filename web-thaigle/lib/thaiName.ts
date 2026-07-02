// Detect names that are majority Thai script (no English rendering exists in
// the underlying Google Maps data for these places).
export function isThaiScript(s: string): boolean {
  const thaiChars = s.match(/[฀-๿]/g)?.length ?? 0;
  const letters = s.match(/[\p{L}]/gu)?.length ?? 0;
  return letters > 0 && thaiChars / letters > 0.4;
}
