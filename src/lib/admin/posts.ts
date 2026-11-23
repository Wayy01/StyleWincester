"use server";

import { and, eq, ne } from "drizzle-orm";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { deleteUpload, storeUpload, UploadError } from "@/lib/uploads";
import type { ActionState, UploadResult } from "./result";
import { idSchema, postSchema } from "./schemas";
import { done, fail, guarded, invalid, readUpload, uploadMessage } from "./server";

export async function savePost(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  let createdId: number | null = null;

  const result = await guarded(async () => {
    const parsed = postSchema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) return invalid(parsed.error);
    const { id, removeCover, removeVideo, ...values } = parsed.data;

    const clash = await db.query.posts.findFirst({
      where: id ? and(eq(posts.slug, values.slug), ne(posts.id, id)) : eq(posts.slug, values.slug),
      columns: { id: true },
    });
    if (clash) return { ok: false, message: "Acest slug este deja folosit.", fieldErrors: { slug: ["Slug-ul trebuie să fie unic"] } };

    const uploadedCover = await readUpload(fd, "coverFile", "posts", "photo");
    const video = await readUpload(fd, "videoFile", "posts", "video");

    if (id) {
      const existing = await db.query.posts.findFirst({ where: eq(posts.id, id) });
      if (!existing) return fail("Articolul nu mai există.");
      // Posts have no poster column, so a video's first frame stands in as the cover when there is none.
      const keptCover = removeCover ? null : existing.cover;
      const cover = uploadedCover?.src ?? keptCover ?? (removeCover ? null : (video?.poster ?? null));
      const nextVideo = video ? video.src : removeVideo ? null : existing.video;
      await db
        .update(posts)
        .set({
          ...values,
          cover,
          video: nextVideo,
          // First publication stamps the date; later edits and unpublishing keep it.
          publishedAt: values.published && !existing.publishedAt ? new Date() : existing.publishedAt,
          updatedAt: new Date(),
        })
        .where(eq(posts.id, id));
      const unused = [
        cover !== existing.cover ? existing.cover : null,
        nextVideo !== existing.video ? existing.video : null,
        video?.poster && cover !== video.poster ? video.poster : null,
      ];
      await Promise.all(unused.map(deleteUpload));
      return done("Articolul a fost salvat.");
    }

    const [row] = await db
      .insert(posts)
      .values({
        ...values,
        cover: uploadedCover?.src ?? video?.poster ?? null,
        video: video?.src ?? null,
        publishedAt: values.published ? new Date() : null,
      })
      .returning({ id: posts.id });
    if (uploadedCover && video?.poster) await deleteUpload(video.poster);
    createdId = row.id;
    return done("Articolul a fost creat.");
  });

  // redirect() throws, so it must sit outside the guarded try/catch.
  if (createdId) redirect(`/admin/journal/${createdId}`);
  return result;
}

export async function deletePost(id: number): Promise<ActionState> {
  await requireAdmin();
  const parsed = idSchema.safeParse(id);
  if (!parsed.success) return fail("Articol invalid.");
  const [removed] = await db.delete(posts).where(eq(posts.id, parsed.data)).returning({ cover: posts.cover, video: posts.video });
  if (removed) await Promise.all([deleteUpload(removed.cover), deleteUpload(removed.video)]);
  return done("Articolul a fost șters.");
}

/** Inline journal image: stored and returned for the editor to insert as Markdown. */
export async function uploadPostImage(fd: FormData): Promise<UploadResult> {
  await requireAdmin();
  const file = fd.get("file");
  if (!(file instanceof File) || file.size === 0) return { ok: false, message: "Alege o imagine." };
  try {
    const stored = await storeUpload(file, "posts");
    if (stored.kind !== "photo") {
      await Promise.all([deleteUpload(stored.src), deleteUpload(stored.poster)]);
      return { ok: false, message: "Aici trebuie încărcată o fotografie." };
    }
    return { ok: true, src: stored.src };
  } catch (e) {
    if (e instanceof UploadError) return { ok: false, message: uploadMessage(e.code) };
    return { ok: false, message: "Nu am putut procesa fișierul. Încearcă alt format." };
  }
}
