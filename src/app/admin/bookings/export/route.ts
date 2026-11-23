import { desc } from "drizzle-orm";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { bookingsWhere, parseBookingFilters } from "@/lib/admin/bookings-query";
import { STATUS_LABEL, lengthLabel, timeLabel } from "@/lib/admin/constants";
import { formatDateTime } from "@/lib/admin/format";
import { requireAdmin } from "@/lib/auth";

const HEADER = ["ID", "Primită", "Status", "Nume", "Telefon", "Instagram", "Serviciu", "Data dorită", "Ora", "Lungime păr", "Mesaj", "Limba", "Notă internă"];

// Quoted always; a leading = or @ would make Excel run the cell as a formula.
function cell(value: string | number) {
  const text = String(value);
  const safe = /^[=@]/.test(text) ? `'${text}` : text;
  return `"${safe.replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  await requireAdmin();
  const { searchParams } = new URL(request.url);
  const filters = parseBookingFilters({ status: searchParams.get("status") ?? undefined, q: searchParams.get("q") ?? undefined });
  const rows = await db.query.bookings.findMany({ where: bookingsWhere(filters), orderBy: desc(bookings.createdAt) });

  const lines = [
    HEADER,
    ...rows.map((b) => [
      b.id,
      formatDateTime(b.createdAt),
      STATUS_LABEL[b.status],
      b.name,
      b.phone,
      b.instagram ? `@${b.instagram}` : "",
      b.serviceLabel,
      b.preferredDate,
      timeLabel(b.preferredTime),
      lengthLabel(b.hairLength),
      b.message,
      b.locale,
      b.adminNote,
    ]),
  ].map((r) => r.map(cell).join(";"));

  // BOM + `;` so Excel opens Romanian and Cyrillic text in the right encoding and columns.
  const body = `﻿${lines.join("\r\n")}\r\n`;
  const day = new Date().toISOString().slice(0, 10);
  return new Response(body, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="programari-${day}.csv"`,
      "cache-control": "no-store",
    },
  });
}
