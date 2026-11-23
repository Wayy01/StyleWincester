"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { works } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { deleteUpload } from "@/lib/uploads";
import type { ActionState } from "./result";
import { idSchema, workSchema } from "./schemas";
import { AdminError, done, fail, guarded, invalid, readUpload } from "./server";

export async function saveWork(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  return guarded(async () => {
    const parsed = workSchema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) return invalid(parsed.error);
    const { id, ...values } = parsed.data;

    const media = await readUpload(fd, "file", "works");
    const posterUpload = await readUpload(fd, "posterFile", "works", "photo");
    // The admin's own cover wins over the frame grabbed from the video.
    const newPoster = media?.kind === "video" ? (posterUpload?.src ?? media.poster) : null;

    if (!id) {
      if (!media) throw new AdminError("Alege o fotografie sau un video.");
      await db.insert(works).values({
        ...values,
        src: media.src,
        kind: media.kind,
        width: media.width,
        height: media.height,
        poster: newPoster,
      });
      // The auto poster is unused when the admin supplied their own.
      if (posterUpload && media.poster) await deleteUpload(media.poster);
      return done("Lucrarea a fost adăugată.");
    }

    const existing = await db.query.works.findFirst({ where: eq(works.id, id) });
    if (!existing) return fail("Lucrarea nu mai există.");

    const patch: Partial<typeof works.$inferInsert> = { ...values };
    const stale: (string | null)[] = [];
    if (media) {
      Object.assign(patch, { src: media.src, kind: media.kind, width: media.width, height: media.height, poster: newPoster });
      stale.push(existing.src, existing.poster);
      if (posterUpload && media.poster) stale.push(media.poster);
    } else if (posterUpload && existing.kind === "video") {
      patch.poster = posterUpload.src;
      stale.push(existing.poster);
    } else if (posterUpload) {
      stale.push(posterUpload.src);
    }
    await db.update(works).set(patch).where(eq(works.id, id));
    await Promise.all(stale.map(deleteUpload));
    return done("Lucrarea a fost actualizată.");
  });
}

export async function deleteWork(id: number): Promise<ActionState> {
  await requireAdmin();
  const parsed = idSchema.safeParse(id);
  if (!parsed.success) return fail("Lucrare invalidă.");
  const [removed] = await db.delete(works).where(eq(works.id, parsed.data)).returning({ src: works.src, poster: works.poster });
  if (removed) await Promise.all([deleteUpload(removed.src), deleteUpload(removed.poster)]);
  return done("Lucrarea a fost ștearsă.");
}
