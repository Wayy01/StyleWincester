"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { paletteSwatches } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { deleteUpload } from "@/lib/uploads";
import type { ActionState } from "./result";
import { idSchema, paletteSchema } from "./schemas";
import { AdminError, done, fail, guarded, invalid, readUpload } from "./server";

// Only photos uploaded for a swatch are owned by it; portfolio photos picked from the library are shared.
const ownedBySwatch = (src: string | null | undefined) => !!src?.startsWith("/uploads/palette/");

function parseLibrary(value: string) {
  const [src, w, h] = value.split("|");
  if (!src || !/^\/(media|uploads)\//.test(src) || src.includes("..")) return null;
  return { src, width: Number(w) || 4, height: Number(h) || 5 };
}

export async function savePalette(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  return guarded(async () => {
    const parsed = paletteSchema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) return invalid(parsed.error);
    const { id, library, ...values } = parsed.data;

    const upload = await readUpload(fd, "photoFile", "palette", "photo");
    const picked = upload ? { src: upload.src, width: upload.width ?? 4, height: upload.height ?? 5 } : library ? parseLibrary(library) : null;
    const photo = picked && { photo: picked.src, photoWidth: picked.width, photoHeight: picked.height };

    if (!id) {
      if (!photo) throw new AdminError("Încarcă o fotografie sau alege una din portofoliu.");
      await db.insert(paletteSwatches).values({ ...values, ...photo });
      return done("Culoarea a fost adăugată.");
    }

    const existing = await db.query.paletteSwatches.findFirst({ where: eq(paletteSwatches.id, id) });
    if (!existing) return fail("Culoarea nu mai există.");
    const changed = photo && photo.photo !== existing.photo;
    await db.update(paletteSwatches).set({ ...values, ...(changed ? photo : {}) }).where(eq(paletteSwatches.id, id));
    if (changed && ownedBySwatch(existing.photo)) await deleteUpload(existing.photo);
    return done("Culoarea a fost actualizată.");
  });
}

export async function deletePalette(id: number): Promise<ActionState> {
  await requireAdmin();
  const parsed = idSchema.safeParse(id);
  if (!parsed.success) return fail("Culoare invalidă.");
  const [removed] = await db.delete(paletteSwatches).where(eq(paletteSwatches.id, parsed.data)).returning({ photo: paletteSwatches.photo });
  if (removed && ownedBySwatch(removed.photo)) await deleteUpload(removed.photo);
  return done("Culoarea a fost ștearsă.");
}
