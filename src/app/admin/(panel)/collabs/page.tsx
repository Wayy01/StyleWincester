import type { Metadata } from "next";
import { asc } from "drizzle-orm";
import { CollabButton } from "@/components/admin/content-forms";
import { DeleteButton } from "@/components/admin/delete-button";
import { Badge, EmptyState, PageHeader } from "@/components/admin/ui";
import { db } from "@/db";
import { collabs } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Colaborări" };

export default async function CollabsPage() {
  await requireAdmin();
  const items = await db.query.collabs.findMany({ orderBy: [asc(collabs.sort), asc(collabs.id)] });

  return (
    <div className="grid gap-10">
      <PageHeader
        eyebrow="Persoane și publicații"
        title="Colaborări"
        lede="Fotografii, modelele și revistele menționate pe pagina Despre și în banda de pe prima pagină."
        actions={<CollabButton />}
      />
      {items.length === 0 ? (
        <EmptyState title="Nicio colaborare" action={<CollabButton />}>
          Adaugă fotografii, make-up artiștii sau publicațiile cu care ai lucrat.
        </EmptyState>
      ) : (
        <ul className="a-list">
          {items.map((c) => (
            <li key={c.id} className="grid gap-4 border-b border-[var(--line)] py-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-10">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="a-h3 break-words">{c.name}</p>
                  {!c.visible && <Badge>Ascunsă</Badge>}
                </div>
                <p className="label mt-1 break-words text-muted">
                  {[c.roleRo, c.roleRu].filter(Boolean).join(" / ") || "Fără rol"} · ordine {c.sort}
                </p>
                {c.url && <p className="mt-1 truncate text-sm text-muted-2">{c.url}</p>}
              </div>
              <div className="flex items-center gap-2">
                <CollabButton item={c} />
                <DeleteButton kind="collab" id={c.id} name={c.name} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
