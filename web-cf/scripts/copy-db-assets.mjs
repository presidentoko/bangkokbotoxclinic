// master_db.json / extra_clinics.json 을 Worker 전용 자산 경로로 복사한다.
//
// 왜 필요한가 (2026-08-08):
// Cloudflare Workers 에는 파일시스템이 없다. lib/data.ts 의 loadMasterDb() 는
// fs.readFile(process.cwd()/data/master_db.json) 을 쓰는데, Workers 에서는 이게
// 실패해 /api/partner-signup 과 /api/admin/* 3개가 500 을 냈다(실측: CF 500 vs
// Vercel 404). 리드 수집 경로라 그대로 두고 도메인을 옮기면 문의가 유실된다.
//
// 해결: 빌드 산출물의 assets 아래 cdn-cgi/db/ 로 복사한다. cdn-cgi/ 아래 자산은
// Worker 만 접근할 수 있어(외부에서 직접 다운로드 불가) 16.5MB DB 가 공개되지
// 않는다. 런타임에는 env.ASSETS.fetch() 로 읽는다 — lib/data.ts 참조.
//
// 실행 시점: `opennextjs-cloudflare build` 다음, `wrangler deploy` 전.
// populateCache 가 .open-next/assets 를 만들어 두므로 그 뒤에 돌리는 게 안전하다.
//
// 한도: Workers 자산은 파일당 25 MiB. master_db.json 은 16.5MB 라 통과하지만
// 데이터가 계속 커지면 언젠가 걸린다 — 그때는 필요한 필드만 담은 슬림 인덱스로
// 쪼개야 한다(라우트 4개가 쓰는 필드는 20개 미만이다).

import { promises as fs } from "node:fs";
import path from "node:path";

const FILES = ["master_db.json", "extra_clinics.json"];
const SRC_DIR = path.join(process.cwd(), "data");
const DEST_DIR = path.join(process.cwd(), ".open-next", "assets", "cdn-cgi", "db");

const MAX_ASSET_BYTES = 25 * 1024 * 1024; // Workers 자산 파일당 한도

async function main() {
  await fs.mkdir(DEST_DIR, { recursive: true });

  let copied = 0;
  for (const name of FILES) {
    const src = path.join(SRC_DIR, name);
    let stat;
    try {
      stat = await fs.stat(src);
    } catch {
      // extra_clinics.json 은 없을 수 있다 — loadMasterDb 도 없으면 조용히 넘긴다.
      console.log(`  - ${name}: 없음, 건너뜀`);
      continue;
    }

    // 한도를 넘으면 배포가 성공한 뒤 런타임에 500 으로 터진다. 여기서 먼저 죽인다.
    if (stat.size > MAX_ASSET_BYTES) {
      throw new Error(
        `${name} 이 ${(stat.size / 1024 / 1024).toFixed(1)}MB 로 Workers 자산 한도(25MiB)를 넘었다. ` +
          `슬림 인덱스로 분리해야 한다.`
      );
    }

    await fs.copyFile(src, path.join(DEST_DIR, name));
    console.log(`  + ${name} (${(stat.size / 1024 / 1024).toFixed(1)}MB)`);
    copied++;
  }

  if (copied === 0) throw new Error("복사된 파일이 없다 — data/ 경로를 확인할 것");
  console.log(`DB 자산 복사 완료 → ${path.relative(process.cwd(), DEST_DIR)}`);
}

main().catch((err) => {
  console.error("[copy-db-assets] 실패:", err.message);
  process.exit(1);
});
