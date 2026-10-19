// Node module-resolution hook for running the project's TypeScript outside
// Next: maps the "@/..." alias to the project root and lets extensionless
// relative imports inside .ts files find their .ts target. Tooling for the
// scripts in this folder only — Next resolves its own imports during a build.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const EXTS = ["", ".ts", ".tsx", "/index.ts", "/index.tsx"];

function find(base) {
  for (const ext of EXTS) {
    const f = base + ext;
    if (fs.existsSync(f) && fs.statSync(f).isFile()) return f;
  }
  return null;
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const hit = find(path.join(ROOT, specifier.slice(2)));
    if (hit) return nextResolve(pathToFileURL(hit).href, context);
  }
  if ((specifier.startsWith("./") || specifier.startsWith("../")) && context.parentURL?.endsWith(".ts")) {
    const hit = find(path.resolve(path.dirname(fileURLToPath(context.parentURL)), specifier));
    if (hit) return nextResolve(pathToFileURL(hit).href, context);
  }
  return nextResolve(specifier, context);
}
