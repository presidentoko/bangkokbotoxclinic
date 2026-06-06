// PromptPay QR payload generator (Thai bank QR standard).
// Spec: EMVCo QR + Thai BoT extensions. Tag 29 (Merchant Account Info) with
// AID A000000677010111 (PromptPay).
//
// Phone format: 0XX-XXX-XXXX → "0066" + 9 digits (Thai bank international format)
// National ID: 13 digits as-is

function crc16(s: string): string {
  let crc = 0xFFFF;
  for (let i = 0; i < s.length; i++) {
    crc ^= s.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) & 0xFFFF : (crc << 1) & 0xFFFF;
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function field(tag: string, value: string): string {
  return tag + value.length.toString().padStart(2, "0") + value;
}

/** Generate a PromptPay payload. id can be phone (no dashes) or 13-digit national ID. */
export function promptPayPayload(id: string, amountTHB: number): string {
  const cleaned = id.replace(/[^0-9]/g, "");
  let acc: string;
  if (cleaned.length === 13) {
    // National ID — 13 digits
    acc = field("00", "A000000677010111") + field("02", cleaned);
  } else {
    // Phone — convert to international 0066 prefix, drop leading 0
    const intl = "0066" + (cleaned.startsWith("0") ? cleaned.slice(1) : cleaned);
    acc = field("00", "A000000677010111") + field("01", intl.padStart(13, "0"));
  }
  const body =
    field("00", "01") +                       // Payload Format Indicator
    field("01", "12") +                       // Point of Initiation Method (12 = dynamic, with amount)
    field("29", acc) +                        // Merchant Account Information (PromptPay)
    field("53", "764") +                      // Currency = THB (ISO 4217)
    field("54", amountTHB.toFixed(2)) +       // Amount
    field("58", "TH") +                       // Country
    field("59", "BKKCLINICS") +                // Merchant Name
    field("60", "BANGKOK");                   // City
  const withoutCrc = body + "6304";
  return body + field("63", crc16(withoutCrc));
}
