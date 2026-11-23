"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { collabs } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import type { ActionState } from "./result";
import { collabSchema, idSchema } from "./schemas";
import { done, fail, invalid } from "./server";

export async function saveCollab(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = collabSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return invalid(parsed.error);
  const { id, ...values } = parsed.data;
  if (id) await db.update(collabs).set(values).where(eq(collabs.id, id));
  else await db.insert(collabs).values(values);
  return done(id ? "Colaborarea a fost actualizată." : "Colaborarea a fost adăugată.");
}

export async function deleteCollab(id: number): Promise<ActionState> {
  await requireAdmin();
  const parsed = idSchema.safeParse(id);
  if (!parsed.success) return fail("Colaborare invalidă.");
  await db.delete(collabs).where(eq(collabs.id, parsed.data));
  return done("Colaborarea a fost ștearsă.");
}
