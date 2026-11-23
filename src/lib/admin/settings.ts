"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { settings, type SiteSettings } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import { deleteUpload } from "@/lib/uploads";
import type { ActionState } from "./result";
import { hourRowSchema, settingsSchema } from "./schemas";
import { done, guarded, invalid, readUpload } from "./server";

export async function saveSettings(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  return guarded(async () => {
    const parsed = settingsSchema.safeParse(Object.fromEntries(fd));
    if (!parsed.success) return invalid(parsed.error);

    const daysRo = fd.getAll("hoursDaysRo");
    const daysRu = fd.getAll("hoursDaysRu");
    const times = fd.getAll("hoursTime");
    const hours = daysRo
      .map((_, i) => hourRowSchema.parse({ daysRo: daysRo[i], daysRu: daysRu[i], time: times[i] }))
      .filter((r) => r.daysRo || r.daysRu || r.time);

    const video = await readUpload(fd, "heroVideoFile", "site", "video");
    const poster = await readUpload(fd, "heroPosterFile", "site", "photo");

    // A fresh video brings its own first frame, used unless the admin uploaded a poster too.
    const value: SiteSettings = {
      ...parsed.data,
      hours,
      heroVideo: video?.src ?? parsed.data.heroVideo,
      heroPoster: poster?.src ?? video?.poster ?? parsed.data.heroPoster,
    };
    const previous = (await db.query.settings.findFirst({ where: eq(settings.key, "site") }))?.value;
    await db
      .insert(settings)
      .values({ key: "site", value })
      .onConflictDoUpdate({ target: settings.key, set: { value, updatedAt: new Date() } });
    // Anything the form no longer points at is dead weight on disk.
    const unused = [
      previous?.heroVideo !== value.heroVideo ? previous?.heroVideo : null,
      previous?.heroPoster !== value.heroPoster ? previous?.heroPoster : null,
      poster && video?.poster ? video.poster : null,
    ];
    await Promise.all(unused.map(deleteUpload));
    return done("Setările au fost salvate.");
  });
}
