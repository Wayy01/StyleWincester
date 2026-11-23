import "server-only";
import { and, eq, ilike, or } from "drizzle-orm";
import { bookings } from "@/db/schema";
import { STATUS_ORDER } from "./constants";

export const BOOKINGS_PAGE_SIZE = 50;

/** Status chip + free-text search shared by the bookings page and the CSV export. */
export function parseBookingFilters(params: { status?: string; q?: string }) {
  const status = STATUS_ORDER.find((s) => s === params.status);
  const q = (params.q ?? "").trim().slice(0, 100);
  return { status, q };
}

export function searchCondition(q: string) {
  if (!q) return undefined;
  const pattern = `%${q.replace(/[\\%_]/g, "\\$&")}%`;
  return or(ilike(bookings.name, pattern), ilike(bookings.phone, pattern), ilike(bookings.instagram, pattern));
}

export function bookingsWhere({ status, q }: ReturnType<typeof parseBookingFilters>) {
  return and(status ? eq(bookings.status, status) : undefined, searchCondition(q));
}
