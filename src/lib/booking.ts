"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { bookings, services } from "@/db/schema";
import { notifyNewBooking } from "@/lib/notify";

const schema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z
    .string()
    .trim()
    .max(32)
    .refine((v) => v.replace(/\D/g, "").length >= 8, "phone"),
  instagram: z.string().trim().max(60).default(""),
  serviceId: z.coerce.number().int().positive().optional(),
  hairLength: z.enum(["short", "medium", "long", "xlong", ""]).default(""),
  preferredDate: z.string().trim().max(20).default(""),
  preferredTime: z.enum(["morning", "afternoon", "evening", "any", ""]).default(""),
  message: z.string().trim().max(1200).default(""),
  locale: z.enum(["ro", "ru"]).default("ro"),
  // Honeypot: real visitors never see this field.
  website: z.string().max(0).optional(),
});

export type BookingState =
  | { status: "idle" }
  | { status: "ok"; name: string }
  | { status: "error"; fields: Partial<Record<"name" | "phone", "required" | "phone">>; generic?: boolean };

// Simple in-memory throttle per IP: enough to stop a form-spam loop on a single small server.
const recent = new Map<string, number[]>();

export async function requestBooking(_: BookingState, form: FormData): Promise<BookingState> {
  const raw = Object.fromEntries(form);
  if (raw.serviceId === "" || raw.serviceId === "consult") delete raw.serviceId;
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const fields: Partial<Record<"name" | "phone", "required" | "phone">> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (key === "name") fields.name = "required";
      if (key === "phone") fields.phone = String(raw.phone ?? "").trim() ? "phone" : "required";
      if (key === "website") return { status: "ok", name: String(raw.name ?? "") };
    }
    return { status: "error", fields, generic: Object.keys(fields).length === 0 };
  }

  const ip = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  if (hits.length >= 5) return { status: "error", fields: {}, generic: true };
  recent.set(ip, [...hits, now]);

  const d = parsed.data;
  let serviceLabel = "";
  if (d.serviceId) {
    const svc = await db.query.services.findFirst({ where: eq(services.id, d.serviceId), columns: { nameRo: true } });
    serviceLabel = svc?.nameRo ?? "";
  } else if (form.get("serviceId") === "consult") {
    serviceLabel = "Consultație (nu știe încă)";
  }

  try {
    await db.insert(bookings).values({
      name: d.name,
      phone: d.phone,
      instagram: d.instagram.replace(/^@/, ""),
      serviceId: d.serviceId ?? null,
      serviceLabel,
      hairLength: d.hairLength,
      preferredDate: d.preferredDate,
      preferredTime: d.preferredTime,
      message: d.message,
      locale: d.locale,
    });
  } catch (e) {
    console.error("booking insert failed", e);
    return { status: "error", fields: {}, generic: true };
  }
  await notifyNewBooking({ ...d, instagram: d.instagram.replace(/^@/, ""), serviceLabel });
  return { status: "ok", name: d.name.split(" ")[0] };
}
