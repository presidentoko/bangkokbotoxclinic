"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { kvHset, kvHdel, kvSet } from "@/lib/kv";
import type { Concern } from "@/lib/data";

const COOKIE = "admin_s";
const KV_FEATURED = "featured";
const KV_BANNER = "banner";

export async function login(formData: FormData) {
  const pw = formData.get("password") as string;
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || pw !== expected) redirect("/admin/login?err=1");
  const jar = await cookies();
  jar.set(COOKIE, expected, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete(COOKIE);
  redirect("/admin/login");
}

export async function requireAuth() {
  const jar = await cookies();
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || jar.get(COOKIE)?.value !== expected) redirect("/admin/login");
}

export async function setFeatured(formData: FormData) {
  await requireAuth();
  const concern = formData.get("concern") as Concern;
  const productId = (formData.get("product_id") as string).trim();
  if (productId) {
    await kvHset(KV_FEATURED, concern, productId);
  } else {
    await kvHdel(KV_FEATURED, concern);
  }
  redirect("/admin");
}

export async function clearFeatured(formData: FormData) {
  await requireAuth();
  const concern = formData.get("concern") as Concern;
  await kvHdel(KV_FEATURED, concern);
  redirect("/admin");
}

export async function saveBanner(formData: FormData) {
  await requireAuth();
  const text = (formData.get("text") as string).trim();
  const active = formData.get("active") === "on";
  await kvSet(KV_BANNER, JSON.stringify({ text, active }));
  redirect("/admin");
}
