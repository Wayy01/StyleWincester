"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { serviceCategories, services } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "./format";
import type { ActionState } from "./result";
import { categorySchema, idSchema, serviceSchema } from "./schemas";
import { done, fail, invalid } from "./server";

async function uniqueCategorySlug(base: string) {
  const root = base || "categorie";
  for (let i = 1; ; i++) {
    const slug = i === 1 ? root : `${root}-${i}`;
    const taken = await db.query.serviceCategories.findFirst({ where: eq(serviceCategories.slug, slug), columns: { id: true } });
    if (!taken) return slug;
  }
}

export async function saveCategory(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = categorySchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return invalid(parsed.error);
  const { id, ...values } = parsed.data;

  if (id) {
    await db.update(serviceCategories).set(values).where(eq(serviceCategories.id, id));
  } else {
    await db.insert(serviceCategories).values({ ...values, slug: await uniqueCategorySlug(slugify(values.nameRo)) });
  }
  return done(id ? "Categoria a fost actualizată." : "Categoria a fost creată.");
}

export async function deleteCategory(id: number): Promise<ActionState> {
  await requireAdmin();
  const parsed = idSchema.safeParse(id);
  if (!parsed.success) return fail("Categorie invalidă.");
  await db.delete(serviceCategories).where(eq(serviceCategories.id, parsed.data));
  return done("Categoria și serviciile ei au fost șterse.");
}

export async function saveService(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const parsed = serviceSchema.safeParse(Object.fromEntries(fd));
  if (!parsed.success) return invalid(parsed.error);
  const { id, ...values } = parsed.data;

  if (id) await db.update(services).set(values).where(eq(services.id, id));
  else await db.insert(services).values(values);
  return done(id ? "Serviciul a fost actualizat." : "Serviciul a fost creat.");
}

export async function deleteService(id: number): Promise<ActionState> {
  await requireAdmin();
  const parsed = idSchema.safeParse(id);
  if (!parsed.success) return fail("Serviciu invalid.");
  await db.delete(services).where(eq(services.id, parsed.data));
  return done("Serviciul a fost șters.");
}
