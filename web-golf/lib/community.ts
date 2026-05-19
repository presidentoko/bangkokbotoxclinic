import { promises as fs } from "node:fs";
import path from "node:path";

export type NaverBlogEntry = {
  blog_url: string;
  blog_title?: string;
  blog_snippet?: string;
  blog_date?: string;
  blogger_name?: string;
};

export type PantipThreadEntry = {
  topic_url: string;
  title?: string;
  summary?: string;
  tags?: string;
  author?: string;
  comments_count?: string;
  like_count?: string;
  posted_date?: string;
};

export type CommunityGroup<E> = {
  query: string;
  city_slug: string | null;
  city_label: string | null;
  count: number;
  entries: E[];
};

export type CommunityDataset<E> = {
  generated_at: string;
  groups: CommunityGroup<E>[];
};

const NAVER_PATH = path.join(process.cwd(), "data", "community_naver.json");
const PANTIP_PATH = path.join(process.cwd(), "data", "community_pantip.json");

let _naver: CommunityDataset<NaverBlogEntry> | null = null;
let _pantip: CommunityDataset<PantipThreadEntry> | null = null;

export async function loadNaverCommunity(): Promise<CommunityDataset<NaverBlogEntry>> {
  if (_naver) return _naver;
  const raw = await fs.readFile(NAVER_PATH, "utf-8");
  _naver = JSON.parse(raw) as CommunityDataset<NaverBlogEntry>;
  return _naver;
}

export async function loadPantipCommunity(): Promise<CommunityDataset<PantipThreadEntry>> {
  if (_pantip) return _pantip;
  const raw = await fs.readFile(PANTIP_PATH, "utf-8");
  _pantip = JSON.parse(raw) as CommunityDataset<PantipThreadEntry>;
  return _pantip;
}
