// Golf blog posts.
// POSTS_MANUAL = 사람이 직접 쓴 글 (이 파일).
// POSTS_AUTO   = scripts/generate_blog.py 가 master_db 기반으로 자동 생성 (posts_auto.ts).
// export 되는 POSTS = 둘을 합친 것 — 다른 모든 파일은 POSTS 만 import.

import { POSTS_AUTO } from "./posts_auto";

export type Post = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  category: string;
  body: string;
  published: string;  // ISO date
  updated?: string;
  related?: string[];
};

const POSTS_MANUAL: Post[] = [];

// 합본 export. published desc — 신규 자동 글이 위로 오게.
export const POSTS: Post[] = [...POSTS_MANUAL, ...POSTS_AUTO].sort(
  (a, b) => (a.published < b.published ? 1 : -1),
);

export function findPost(slug: string): Post | null {
  return POSTS.find((p) => p.slug === slug) ?? null;
}

// 단순 markdown → block 변환 (h2 + 단락 + 리스트 + 표).
export type Block =
  | { type: "h2"; content: string }
  | { type: "p"; content: string }
  | { type: "ul"; content: string[] }
  | { type: "table"; content: { header: string[]; rows: string[][] } };

function parseTableRow(line: string): string[] {
  return line.replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
}

function isTableSeparator(line: string): boolean {
  return /^\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)+\|?\s*$/.test(line);
}

export function renderBody(body: string): Block[] {
  const blocks: Block[] = [];
  const lines = body.split("\n");
  let buf: string[] = [];
  let mode: "p" | "ul" | "table" | null = null;
  let tableHeader: string[] | null = null;

  const flush = () => {
    if (buf.length === 0 && mode !== "table") { mode = null; return; }
    if (mode === "ul") blocks.push({ type: "ul", content: buf });
    else if (mode === "p") blocks.push({ type: "p", content: buf.join(" ") });
    else if (mode === "table" && tableHeader) {
      blocks.push({ type: "table", content: { header: tableHeader, rows: buf.map(parseTableRow) } });
    }
    buf = [];
    tableHeader = null;
    mode = null;
  };

  for (const line of lines) {
    const t = line.trim();
    if (!t) { flush(); continue; }
    if (t.startsWith("## ")) {
      flush();
      blocks.push({ type: "h2", content: t.slice(3) });
      continue;
    }
    if (t.startsWith("- ")) {
      if (mode !== "ul") flush();
      mode = "ul";
      buf.push(t.slice(2));
      continue;
    }
    // Table: a line starting and ending with | (and not a list item)
    if (t.startsWith("|") && t.endsWith("|") && t.length > 2) {
      // Separator row — confirms previous row was the header
      if (isTableSeparator(t)) {
        if (mode === "table" && buf.length === 1) {
          tableHeader = parseTableRow(buf[0]);
          buf = [];
        }
        continue;
      }
      if (mode !== "table") flush();
      mode = "table";
      buf.push(t);
      continue;
    }
    if (mode !== "p") flush();
    mode = "p";
    buf.push(t);
  }
  flush();
  return blocks;
}

// markdown link [text](url) → <a> 변환.
export function inlineMd(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-emerald-700 hover:underline">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
}
