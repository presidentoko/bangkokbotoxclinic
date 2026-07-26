import { test } from "node:test";
import assert from "node:assert/strict";
import { iGa, eunNeun, eulReul, euroRo } from "../lib/korean-particles.ts";

// Real KO theme/mood labels from lib/theme-labels.ts -- 6 end without a
// batchim (vowel-final), 9 end with one, hand-verified character by
// character before writing these assertions.
const NO_BATCHIM = ["발마사지", "오일 마사지", "타이 마사지", "아로마테라피", "딥티슈 마사지", "핫스톤 마사지"];
const WITH_BATCHIM = [
  "페이셜", // ㄹ batchim
  "바디 스크럽", // ㅂ batchim
  "청결함", // ㅁ batchim
  "조용하고 편안함", // ㅁ batchim
  "강한 압력", // ㄱ batchim
  "부드러운 손길", // ㄹ batchim
  "친절한 직원", // ㄴ batchim
  "가성비 좋음", // ㅁ batchim
  "워크인 가능", // ㅇ batchim
];

test("iGa: 가 for vowel-final words, 이 for batchim-final words", () => {
  for (const w of NO_BATCHIM) assert.equal(iGa(w), "가", w);
  for (const w of WITH_BATCHIM) assert.equal(iGa(w), "이", w);
});

test("eunNeun: 는 for vowel-final words, 은 for batchim-final words", () => {
  for (const w of NO_BATCHIM) assert.equal(eunNeun(w), "는", w);
  for (const w of WITH_BATCHIM) assert.equal(eunNeun(w), "은", w);
});

test("eulReul: 를 for vowel-final words, 을 for batchim-final words", () => {
  for (const w of NO_BATCHIM) assert.equal(eulReul(w), "를", w);
  for (const w of WITH_BATCHIM) assert.equal(eulReul(w), "을", w);
});

test("euroRo: 로 for vowel-final and ㄹ-batchim words, 으로 for other batchim words", () => {
  assert.equal(euroRo("발마사지"), "로");
  assert.equal(euroRo("페이셜"), "로", "ㄹ batchim still takes 로, not 으로");
  assert.equal(euroRo("부드러운 손길"), "로", "ㄹ batchim still takes 로, not 으로");
  assert.equal(euroRo("바디 스크럽"), "으로");
  assert.equal(euroRo("친절한 직원"), "으로");
});

test("falls back to the vowel-final allomorph for non-Hangul or empty input", () => {
  assert.equal(iGa(""), "가");
  assert.equal(iGa("Facial"), "가");
  assert.equal(euroRo(""), "로");
});
