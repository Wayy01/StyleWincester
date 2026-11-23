"use server";

import { and, count, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { hashPassword, requireAdmin } from "@/lib/auth";
import type { ActionState } from "./result";
import { adminCreateSchema, idSchema, profileSchema } from "./schemas";
import { done, fail, invalid } from "./server";

const EMAIL_TAKEN: ActionState = { ok: false, message: "Acest email este deja folosit.", fieldErrors: { email: ["Email deja folosit"] } };

export async function createAdmin(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = adminCreateSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return invalid(parsed.error);
  const { name, email, password } = parsed.data;

  if (await db.query.admins.findFirst({ where: eq(admins.email, email), columns: { id: true } })) return EMAIL_TAKEN;
  await db.insert(admins).values({ name, email, passwordHash: await hashPassword(password) });
  return done("Administratorul a fost adăugat.", { publicSite: false });
}

export async function deleteAdmin(id: number): Promise<ActionState> {
  const me = await requireAdmin();
  const parsed = idSchema.safeParse(id);
  if (!parsed.success) return fail("Utilizator invalid.");
  if (parsed.data === me.id) return fail("Nu îți poți șterge propriul cont.");

  const [{ n }] = await db.select({ n: count() }).from(admins);
  if (n <= 1) return fail("Nu poți șterge ultimul administrator.");
  await db.delete(admins).where(eq(admins.id, parsed.data));
  return done("Administratorul a fost șters.", { publicSite: false });
}

export async function updateProfile(_: ActionState, fd: FormData): Promise<ActionState> {
  const me = await requireAdmin();
  const parsed = profileSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return invalid(parsed.error);
  const { name, email } = parsed.data;

  if (await db.query.admins.findFirst({ where: and(eq(admins.email, email), ne(admins.id, me.id)), columns: { id: true } })) return EMAIL_TAKEN;
  await db.update(admins).set({ name, email }).where(eq(admins.id, me.id));
  return done("Profilul a fost actualizat.", { publicSite: false });
}
