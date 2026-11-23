"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { createSession, destroySession, hashPassword, requireAdmin, verifyPassword } from "@/lib/auth";
import type { ActionState } from "./result";
import { loginSchema, passwordSchema } from "./schemas";
import { done, fail, invalid } from "./server";

// Compared against when the email is unknown, so response time doesn't reveal which emails exist.
const dummyHash = hashPassword("not-a-real-password");

// In-memory throttle (one small server): 5 failures per IP and per email within 15 minutes.
const MAX_FAILURES = 5;
const WINDOW_MS = 15 * 60_000;
const failures = new Map<string, number[]>();

const recent = (key: string, now: number) => (failures.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
const isLocked = (keys: string[], now: number) => keys.some((k) => recent(k, now).length >= MAX_FAILURES);

export async function login(_: ActionState, fd: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(fd));
  const generic = fail("Email sau parolă incorectă.");
  if (!parsed.success) return generic;

  const email = parsed.data.email.toLowerCase();
  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const keys = [`ip:${ip}`, `email:${email}`];
  const now = Date.now();
  if (isLocked(keys, now)) return fail("Prea multe încercări. Încearcă din nou peste 15 minute.");

  const admin = await db.query.admins.findFirst({ where: eq(admins.email, email) });
  const valid = await verifyPassword(parsed.data.password, admin?.passwordHash ?? (await dummyHash));
  if (!admin || !valid) {
    for (const k of keys) failures.set(k, [...recent(k, now), now]);
    return generic;
  }

  for (const k of keys) failures.delete(k);
  await createSession(admin.id);
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

export async function changePassword(_: ActionState, fd: FormData): Promise<ActionState> {
  const admin = await requireAdmin();
  const parsed = passwordSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return invalid(parsed.error);

  const row = await db.query.admins.findFirst({ where: eq(admins.id, admin.id) });
  if (!row || !(await verifyPassword(parsed.data.current, row.passwordHash))) {
    return { ok: false, message: "Parola curentă este greșită.", fieldErrors: { current: ["Parolă incorectă"] } };
  }

  await db.update(admins).set({ passwordHash: await hashPassword(parsed.data.next) }).where(eq(admins.id, admin.id));
  return done("Parola a fost schimbată.", { publicSite: false });
}
