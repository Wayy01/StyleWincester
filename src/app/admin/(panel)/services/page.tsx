import type { Metadata } from "next";
import { asc } from "drizzle-orm";
import { Badge, EmptyState, PageHeader } from "@/components/admin/ui";
import { DeleteButton } from "@/components/admin/delete-button";
import { CategoryButton, ServiceButton } from "@/components/admin/service-forms";
import { db } from "@/db";
import { serviceCategories, services } from "@/db/schema";
import { formatPrice } from "@/lib/admin/format";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Servicii & prețuri" };

export default async function ServicesPage() {
  await requireAdmin();
  const [categories, allServices] = await Promise.all([
    db.query.serviceCategories.findMany({ orderBy: [asc(serviceCategories.sort), asc(serviceCategories.id)] }),
    db.query.services.findMany({ orderBy: [asc(services.sort), asc(services.id)] }),
  ]);
  const options = categories.map((c) => ({ id: c.id, nameRo: c.nameRo }));

  return (
    <div className="grid gap-10">
      <PageHeader
        eyebrow="Listă de prețuri"
        title="Servicii & prețuri"
        lede="Categoriile și serviciile exact cum apar pe site, în română și rusă."
        actions={<CategoryButton />}
      />

      {categories.length === 0 ? (
        <EmptyState title="Nicio categorie încă" action={<CategoryButton />}>
          Începe cu o categorie, de exemplu „Tunsori”, apoi adaugă serviciile din ea.
        </EmptyState>
      ) : (
        categories.map((c) => {
          const items = allServices.filter((s) => s.categoryId === c.id);
          return (
            <section key={c.id} aria-labelledby={`cat-${c.id}`} className="grid gap-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 max-w-2xl">
                  <p className="label text-muted">Ordine {c.sort}</p>
                  <h2 id={`cat-${c.id}`} className="a-h2 mt-1 text-[1.375rem]">
                    {c.nameRo} <span className="text-muted-2">/ {c.nameRu}</span>
                  </h2>
                  {c.introRo && <p className="mt-2 text-muted">{c.introRo}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <CategoryButton category={c} />
                  <DeleteButton kind="category" id={c.id} name={c.nameRo} />
                </div>
              </div>

              {items.length === 0 ? (
                <p className="border-y border-[var(--line)] py-6 text-muted">Nu sunt servicii în această categorie.</p>
              ) : (
                <ul className="a-list">
                  {items.map((s) => (
                    <li
                      key={s.id}
                      className="grid gap-3 border-b border-[var(--line)] py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:gap-8"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="a-h3">{s.nameRo}</p>
                          {s.featured && <Badge tone="ok">Recomandat</Badge>}
                          {!s.visible && <Badge>Ascuns</Badge>}
                        </div>
                        <p className="text-sm text-muted">
                          {s.nameRu}
                          {s.noteRo && ` · ${s.noteRo}`}
                        </p>
                        <p className="label mt-1 text-muted-2">
                          {s.durationMin} min · ordine {s.sort}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-4 sm:justify-end">
                        <p className="a-num whitespace-nowrap text-lg font-semibold">{formatPrice(s.priceFrom, s.priceTo, s.isFrom)}</p>
                        <div className="flex items-center gap-2">
                          <ServiceButton service={s} categories={options} />
                          <DeleteButton kind="service" id={s.id} name={s.nameRo} />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <div>
                <ServiceButton categories={options} categoryId={c.id} />
              </div>
            </section>
          );
        })
      )}
    </div>
  );
}
