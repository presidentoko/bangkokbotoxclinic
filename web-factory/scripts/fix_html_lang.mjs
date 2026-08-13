// out/ko/** 와 out/th/** 의 <html lang="en"> 을 실제 언어로 바꾼다.
//
// App Router 에서 <html> 태그를 그릴 수 있는 건 루트 레이아웃 하나뿐이다.
// 이 사이트의 한국어·태국어는 [lang] 동적 세그먼트가 아니라 /ko, /th 라는 평범한
// 경로라서 전부 같은 루트 레이아웃을 쓰고, 그 결과 태국어 페이지가 자기를 영어라고
// 선언한 채 나가고 있었다 — hreflang 은 th-TH 라고 하는데 문서는 lang="en" 인,
// 서로 어긋나는 신호다. 스크린 리더도 태국어를 영어 음성으로 읽는다.
//
// output: "export" 라 빌드 결과가 그냥 HTML 파일 더미다. 여기서 고치는 게 가장
// 단순하고 확실하다. 런타임 JS 로 documentElement.lang 을 만지는 방법은 크롤러가
// 스크립트를 돌려야만 보이고, 루트 레이아웃을 [lang] 로 재구성하는 건 사이트의
// 모든 URL 을 바꾸는 일이다.
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const OUT = path.resolve(import.meta.dirname, "..", "out");
const LOCALES = { ko: "ko", th: "th" };

async function* walk(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return; // 해당 로케일 디렉토리가 없으면 조용히 넘어간다
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(full);
    else if (e.name.endsWith(".html")) yield full;
  }
}

function relang(html, lang) {
  // 문서 첫머리의 <html ... lang="en" ...> 하나만. 본문에 lang="en" 을 단
  // 인용문 같은 게 있으면 그건 의도된 것이라 건드리지 않는다.
  return html.replace(/<html([^>]*?)\slang="en"/i, `<html$1 lang="${lang}"`);
}

let total = 0;
for (const [dir, lang] of Object.entries(LOCALES)) {
  let n = 0;
  // trailingSlash 가 꺼져 있어 로케일 홈은 out/ko/index.html 이 아니라 out/ko.html
  // 로 떨어진다 — 디렉토리만 훑으면 /ko 와 /th 자기 자신이 빠진다.
  const rootFile = path.join(OUT, `${dir}.html`);
  try {
    const html = await readFile(rootFile, "utf8");
    const fixed = relang(html, lang);
    if (fixed !== html) { await writeFile(rootFile, fixed, "utf8"); n++; }
  } catch { /* 해당 로케일이 없으면 넘어간다 */ }

  for await (const file of walk(path.join(OUT, dir))) {
    const html = await readFile(file, "utf8");
    const fixed = relang(html, lang);
    if (fixed !== html) {
      await writeFile(file, fixed, "utf8");
      n++;
    }
  }
  total += n;
  console.log(`[fix-html-lang] /${dir} → lang="${lang}": ${n} files`);
}
console.log(`[fix-html-lang] ${total} files rewritten`);
