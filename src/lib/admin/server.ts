import "server-only";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { revalidatePublicSite } from "@/lib/revalidate";
import { storeUpload, UploadError, type StoredUpload } from "@/lib/uploads";
import type { ActionState } from "./result";

export class AdminError extends Error {}

export function fail(message: string): ActionState {
  return { ok: false, message };
}

export function invalid(error: z.ZodError): ActionState {
  return { ok: false, message: "Verifică câmpurile marcate.", fieldErrors: z.flattenError(error).fieldErrors };
}

/** `publicSite: false` for changes visitors can't see (bookings, account). */
export function done(message: string, { publicSite = true } = {}): ActionState {
  if (publicSite) revalidatePublicSite();
  revalidatePath("/admin", "layout");
  return { ok: true, message };
}

/** Turns AdminError into a form message; anything else is a real bug and keeps throwing. */
export async function guarded(fn: () => Promise<ActionState>): Promise<ActionState> {
  try {
    return await fn();
  } catch (e) {
    if (e instanceof AdminError) return fail(e.message);
    throw e;
  }
}

const UPLOAD_MESSAGE: Record<UploadError["code"], string> = {
  too_large: "Fișierul este prea mare (foto max 25 MB, video max 300 MB).",
  unsupported_type: "Format neacceptat. Folosește JPG, PNG, WebP, AVIF, HEIC sau MP4, MOV, WebM.",
  unreadable: "Fișierul nu a putut fi citit. Verifică dacă nu e deteriorat sau exportă-l din nou.",
  needs_ffmpeg: "Pentru .mov e nevoie de ffmpeg pe server. Exportă video-ul ca MP4 sau instalează ffmpeg.",
};

export const uploadMessage = (code: UploadError["code"]) => UPLOAD_MESSAGE[code];

export async function readUpload(
  fd: FormData,
  field: string,
  folder: "works" | "posts" | "site" | "palette",
  expect?: "photo" | "video",
): Promise<StoredUpload | null> {
  const file = fd.get(field);
  if (!(file instanceof File) || file.size === 0) return null;
  let stored: StoredUpload;
  try {
    stored = await storeUpload(file, folder);
  } catch (e) {
    if (e instanceof UploadError) {
      throw new AdminError(uploadMessage(e.code));
    }
    throw new AdminError("Nu am putut procesa fișierul. Încearcă alt format.");
  }
  if (expect && stored.kind !== expect) {
    throw new AdminError(expect === "photo" ? "Aici trebuie încărcată o fotografie." : "Aici trebuie încărcat un video.");
  }
  return stored;
}
