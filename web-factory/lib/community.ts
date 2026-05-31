import { promises as fs } from "node:fs";
import path from "node:path";

export type NaverBlogEntry = {
  blog_url: string;
  blog_title?: string;
  blog_snippet?: string;
  blog_date?: string;
  blogger_name?: string;
};

export type PantipCommentInline = {
  author: string;
  body: string;
  vote_score: number;
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
  op_snippet?: string;
  comments_inlined?: PantipCommentInline[];
  real_comment_count?: number;
};

export type YoutubeVideoEntry = {
  video_url: string;
  video_id: string;
  title?: string;
  description?: string;
  channel?: string;
  channel_id?: string;
  published_at?: string;
  view_count?: string;
  like_count?: string;
  comment_count?: string;
  duration?: string;
};

export type NaverCafeEntry = {
  cafe_url: string;
  cafe_name?: string;
  post_title?: string;
  post_snippet?: string;
  post_date?: string;
  author?: string;
};

export type RedditPostEntry = {
  post_url: string;
  permalink?: string;
  subreddit?: string;
  title?: string;
  selftext_snippet?: string;
  author?: string;
  score?: string;
  num_comments?: string;
  created_utc?: string;
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
const YOUTUBE_PATH = path.join(process.cwd(), "data", "community_youtube.json");
const CAFE_PATH = path.join(process.cwd(), "data", "community_naver_cafe.json");
const REDDIT_PATH = path.join(process.cwd(), "data", "community_reddit.json");

let _naver: CommunityDataset<NaverBlogEntry> | null = null;
let _pantip: CommunityDataset<PantipThreadEntry> | null = null;
let _youtube: CommunityDataset<YoutubeVideoEntry> | null = null;
let _cafe: CommunityDataset<NaverCafeEntry> | null = null;
let _reddit: CommunityDataset<RedditPostEntry> | null = null;

async function safeLoad<E>(p: string): Promise<CommunityDataset<E>> {
  try {
    const raw = await fs.readFile(p, "utf-8");
    return JSON.parse(raw) as CommunityDataset<E>;
  } catch {
    return { generated_at: new Date().toISOString(), groups: [] };
  }
}

export async function loadNaverCommunity(): Promise<CommunityDataset<NaverBlogEntry>> {
  if (_naver) return _naver;
  _naver = await safeLoad<NaverBlogEntry>(NAVER_PATH);
  return _naver;
}

export async function loadPantipCommunity(): Promise<CommunityDataset<PantipThreadEntry>> {
  if (_pantip) return _pantip;
  _pantip = await safeLoad<PantipThreadEntry>(PANTIP_PATH);
  return _pantip;
}

export async function loadYoutubeCommunity(): Promise<CommunityDataset<YoutubeVideoEntry>> {
  if (_youtube) return _youtube;
  _youtube = await safeLoad<YoutubeVideoEntry>(YOUTUBE_PATH);
  return _youtube;
}

export async function loadNaverCafeCommunity(): Promise<CommunityDataset<NaverCafeEntry>> {
  if (_cafe) return _cafe;
  _cafe = await safeLoad<NaverCafeEntry>(CAFE_PATH);
  return _cafe;
}

export async function loadRedditCommunity(): Promise<CommunityDataset<RedditPostEntry>> {
  if (_reddit) return _reddit;
  _reddit = await safeLoad<RedditPostEntry>(REDDIT_PATH);
  return _reddit;
}
