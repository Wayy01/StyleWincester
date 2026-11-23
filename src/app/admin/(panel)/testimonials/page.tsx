import type { Metadata } from "next";
import { asc } from "drizzle-orm";
import { TestimonialButton } from "@/components/admin/content-forms";
import { DeleteButton } from "@/components/admin/delete-button";
import { Badge, EmptyState, PageHeader } from "@/components/admin/ui";
import { db } from "@/db";
import { testimonials } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Recenzii" };

export default async function TestimonialsPage() {
  await requireAdmin();
  const items = await db.query.testimonials.findMany({ orderBy: [asc(testimonials.sort), asc(testimonials.id)] });

  return (
    <div className="grid gap-10">
      <PageHeader eyebrow="Ce spun clienții" title="Recenzii" actions={<TestimonialButton />} />
      {items.length === 0 ? (
        <EmptyState title="Nicio recenzie" action={<TestimonialButton />}>
          Adaugă cuvintele clienților mulțumiți, în ambele limbi.
        </EmptyState>
      ) : (
        <ul className="a-list">
          {items.map((t) => (
            <li key={t.id} className="grid gap-4 border-b border-[var(--line)] py-6 md:grid-cols-[minmax(0,1fr)_auto] md:gap-10">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="a-h3">{t.name}</p>
                  {!t.visible && <Badge>Ascunsă</Badge>}
                  <span className="label text-muted">
                    {t.serviceRo || "—"} · ordine {t.sort}
                  </span>
                </div>
                <p className="mt-3 line-clamp-3 max-w-3xl text-ink-3">{t.textRo}</p>
                <p className="mt-1 line-clamp-2 max-w-3xl text-sm text-muted">{t.textRu}</p>
              </div>
              <div className="flex items-start gap-2">
                <TestimonialButton item={t} />
                <DeleteButton kind="testimonial" id={t.id} name={t.name} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
