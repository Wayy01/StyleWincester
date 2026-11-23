"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { faqs, testimonials } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import type { ActionState } from "./result";
import { faqSchema, idSchema, testimonialSchema } from "./schemas";
import { done, fail, invalid } from "./server";

export async function saveTestimonial(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = testimonialSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return invalid(parsed.error);
  const { id, ...values } = parsed.data;
  if (id) await db.update(testimonials).set(values).where(eq(testimonials.id, id));
  else await db.insert(testimonials).values(values);
  return done(id ? "Recenzia a fost actualizată." : "Recenzia a fost adăugată.");
}

export async function deleteTestimonial(id: number): Promise<ActionState> {
  await requireAdmin();
  const parsed = idSchema.safeParse(id);
  if (!parsed.success) return fail("Recenzie invalidă.");
  await db.delete(testimonials).where(eq(testimonials.id, parsed.data));
  return done("Recenzia a fost ștearsă.");
}

export async function saveFaq(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = faqSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return invalid(parsed.error);
  const { id, ...values } = parsed.data;
  if (id) await db.update(faqs).set(values).where(eq(faqs.id, id));
  else await db.insert(faqs).values(values);
  return done(id ? "Întrebarea a fost actualizată." : "Întrebarea a fost adăugată.");
}

export async function deleteFaq(id: number): Promise<ActionState> {
  await requireAdmin();
  const parsed = idSchema.safeParse(id);
  if (!parsed.success) return fail("Întrebare invalidă.");
  await db.delete(faqs).where(eq(faqs.id, parsed.data));
  return done("Întrebarea a fost ștearsă.");
}
