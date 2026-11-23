import { count, eq } from "drizzle-orm";
import { AdminShell } from "@/components/admin/shell";
import { db } from "@/db";
import { bookings } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const [{ n }] = await db.select({ n: count() }).from(bookings).where(eq(bookings.status, "new"));

  return (
    <AdminShell name={admin.name} newBookings={n}>
      {children}
    </AdminShell>
  );
}
