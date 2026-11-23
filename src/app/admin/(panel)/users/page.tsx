import type { Metadata } from "next";
import { asc } from "drizzle-orm";
import { DeleteButton } from "@/components/admin/delete-button";
import { AdminButton } from "@/components/admin/user-forms";
import { Badge, PageHeader } from "@/components/admin/ui";
import { db } from "@/db";
import { admins } from "@/db/schema";
import { formatDateTime } from "@/lib/admin/format";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Utilizatori" };

export default async function UsersPage() {
  const me = await requireAdmin();
  const items = await db.query.admins.findMany({
    orderBy: [asc(admins.createdAt), asc(admins.id)],
    columns: { id: true, name: true, email: true, createdAt: true },
  });

  return (
    <div className="grid gap-10">
      <PageHeader
        eyebrow="Acces la panou"
        title="Utilizatori"
        lede="Persoanele care se pot autentifica în această administrare."
        actions={<AdminButton />}
      />
      <ul className="a-list">
        {items.map((a) => (
          <li key={a.id} className="grid gap-3 border-b border-[var(--line)] py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-10">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <p className="a-h3 break-words">{a.name}</p>
                {a.id === me.id && <Badge tone="ok">Tu</Badge>}
              </div>
              <p className="mt-1 break-all text-muted">{a.email}</p>
              <p className="label mt-1 text-muted-2">adăugat {formatDateTime(a.createdAt)}</p>
            </div>
            {a.id !== me.id && (
              <div>
                <DeleteButton kind="admin" id={a.id} name={a.name} iconOnly={false} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
