import type { BookingStatus, WorkTag } from "@/db/schema";

export const STATUS_LABEL: Record<BookingStatus, string> = {
  new: "Nouă",
  confirmed: "Confirmată",
  done: "Finalizată",
  cancelled: "Anulată",
};

export const STATUS_ORDER: BookingStatus[] = ["new", "confirmed", "done", "cancelled"];

export const WORK_TAG_LABEL: Record<WorkTag, string> = {
  cut: "Tunsori",
  color: "Culoare",
  styling: "Styling",
  men: "Bărbați",
  editorial: "Editorial",
};

export const WORK_TAG_ORDER: WorkTag[] = ["cut", "color", "styling", "men", "editorial"];

// Booking form values are stored as stable codes; these are the labels the studio reads.
const TIME_LABEL: Record<string, string> = { morning: "dimineața", afternoon: "după-amiaza", evening: "seara", any: "oricând" };
const LENGTH_LABEL: Record<string, string> = { short: "scurt", medium: "mediu", long: "lung", xlong: "foarte lung" };

export const timeLabel = (v: string) => TIME_LABEL[v] ?? v;
export const lengthLabel = (v: string) => LENGTH_LABEL[v] ?? v;

// Mirror what storeUpload accepts; HEIC photos and .mov clips are converted on the server.
export const IMAGE_ACCEPT = "image/jpeg,image/png,image/webp,image/avif,image/heic,image/heif,.heic,.heif";
export const VIDEO_ACCEPT = "video/mp4,video/quicktime,video/webm,.mp4,.mov,.m4v";
export const VIDEO_HINT = "MP4 sau MOV, până la 300 MB. Se convertește automat ca să meargă în toate browserele — poate dura până la un minut.";
