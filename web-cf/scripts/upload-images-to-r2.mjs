// One-time migration script: uploads web/public/clinic-images/* to the
// bangkok-clinic-images R2 bucket (bound to img.bangkokbestclinic.com),
// so botox+dental stop serving these from Vercel's bandwidth-metered edge.
// Run from web/: node scripts/upload-images-to-r2.mjs
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { spawn } from "node:child_process";

const SRC_DIR = join(import.meta.dirname, "..", "public", "clinic-images");
const BUCKET = "bangkok-clinic-images";
const CONCURRENCY = 12;
const CACHE_CONTROL = "public, max-age=31536000, immutable";

const files = readdirSync(SRC_DIR).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
console.log(`[upload] ${files.length} files found in ${SRC_DIR}`);

function contentType(name) {
  if (/\.png$/i.test(name)) return "image/png";
  if (/\.webp$/i.test(name)) return "image/webp";
  return "image/jpeg";
}

// Windows' child_process shell:true joins the args array with plain spaces
// and does NOT quote entries itself (unlike shell:false, which uses real
// argv via CreateProcess) -- any arg containing a space (the cache-control
// string, mainly) silently splits into multiple stray tokens that wrangler's
// yargs parser then rejects as "Unknown arguments". Quote every arg here
// instead of trusting spawn to do it.
function q(arg) {
  return `"${String(arg).replace(/"/g, '\\"')}"`;
}

function uploadOne(name) {
  return new Promise((resolve) => {
    const src = join(SRC_DIR, name);
    const key = `${BUCKET}/clinic-images/${name}`;
    const cmd = [
      "npx", "wrangler", "r2", "object", "put", q(key),
      "--file", q(src),
      "--content-type", q(contentType(name)),
      "--cache-control", q(CACHE_CONTROL),
      "--remote",
    ].join(" ");
    const proc = spawn(cmd, { shell: true, stdio: ["ignore", "pipe", "pipe"] });
    let stderr = "";
    proc.stderr.on("data", (d) => (stderr += d));
    proc.on("close", (code) => {
      if (code !== 0) console.error(`[FAIL] ${name}: ${stderr.trim().slice(0, 200)}`);
      resolve(code === 0);
    });
  });
}

let done = 0;
let failed = 0;
let idx = 0;

async function worker() {
  while (idx < files.length) {
    const name = files[idx++];
    const ok = await uploadOne(name);
    done++;
    if (!ok) failed++;
    if (done % 25 === 0 || done === files.length) {
      console.log(`[upload] ${done}/${files.length} (failed: ${failed})`);
    }
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, worker));
console.log(`[upload] done. ${files.length - failed}/${files.length} succeeded, ${failed} failed.`);
if (failed > 0) process.exitCode = 1;
