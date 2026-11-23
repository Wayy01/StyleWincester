"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";
import type { ActionState } from "./result";
import { bookingNoteSchema, bookingStatusSchema, idSchema } from "./schemas";
import { done, fail, invalid } from "./server";

export async function setBookingStatus(id: number, status: string): Promise<ActionState> {
  await requireAdmin();
  const parsedId = idSchema.safeParse(id);
  const parsedStatus = bookingStatusSchema.safeParse(status);
  if (!parsedId.success || !parsedStatus.success) return fail("Status invalid.");
  await db.update(bookings).set({ status: parsedStatus.data }).where(eq(bookings.id, parsedId.data));
  return done("Status actualizat.", { publicSite: false });
}

export async function saveBookingNote(_: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = idSchema.safeParse(fd.get("id"));
  const note = bookingNoteSchema.safeParse(fd.get("adminNote") ?? "");
  if (!id.success) return fail("Programare invalidă.");
  if (!note.success) return invalid(note.error);
  await db.update(bookings).set({ adminNote: note.data }).where(eq(bookings.id, id.data));
  return done("Notă salvată.", { publicSite: false });
}

export async function deleteBooking(id: number): Promise<ActionState> {
  await requireAdmin();
  const parsed = idSchema.safeParse(id);
  if (!parsed.success) return fail("Programare invalidă.");
  await db.delete(bookings).where(eq(bookings.id, parsed.data));
  return done("Programarea a fost ștearsă.", { publicSite: false });
}
