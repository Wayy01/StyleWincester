import type { Metadata } from "next";
import { asc } from "drizzle-orm";
import { FaqButton } from "@/components/admin/content-forms";
import { DeleteButton } from "@/components/admin/delete-button";
import { Badge, EmptyState, PageHeader } from "@/components/admin/ui";
import { db } from "@/db";
import { faqs } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Întrebări frecvente" };

export default async function FaqPage() {
  await requireAdmin();
  const items = await db.query.faqs.findMany({ orderBy: [asc(faqs.sort), asc(faqs.id)] });

  return (
    <div className="grid gap-10">
      <PageHeader eyebrow="Ajută clienții să decidă" title="Întrebări" actions={<FaqButton />} />
      {items.length === 0 ? (
        <EmptyState title="Nicio întrebare" action={<FaqButton />}>
          Răspunde aici la ce se întreabă cel mai des: prețuri, durată, pregătirea pentru vizită.
        </EmptyState>
      ) : (
        <ul className="a-list">
          {items.map((f) => (
            <li key={f.id} className="grid gap-4 border-b border-[var(--line)] py-6 md:grid-cols-[minmax(0,1fr)_auto] md:gap-10">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="a-h3">{f.questionRo}</p>
                  {!f.visible && <Badge>Ascunsă</Badge>}
                </div>
                <p className="label mt-1 text-muted">
                  {f.questionRu} · ordine {f.sort}
                </p>
                <p className="mt-3 line-clamp-3 max-w-3xl text-ink-3">{f.answerRo}</p>
              </div>
              <div className="flex items-start gap-2">
                <FaqButton item={f} />
                <DeleteButton kind="faq" id={f.id} name={f.questionRo} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
