import type { Metadata } from "next";
import Image from "next/image";
import { asc, eq } from "drizzle-orm";
import { PaletteButton, type LibraryImage } from "@/components/admin/palette-form";
import { DeleteButton } from "@/components/admin/delete-button";
import { Badge, EmptyState, PageHeader } from "@/components/admin/ui";
import { db } from "@/db";
import { paletteSwatches, works } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Paletă" };

export default async function PalettePage() {
  await requireAdmin();
  const [items, portfolio] = await Promise.all([
    db.query.paletteSwatches.findMany({ orderBy: [asc(paletteSwatches.sort), asc(paletteSwatches.id)] }),
    db.select().from(works).where(eq(works.published, true)).orderBy(asc(works.sort)),
  ]);

  // Photos as-is; videos through their poster still.
  const library: LibraryImage[] = portfolio.flatMap((w) => {
    const src = w.kind === "photo" ? w.src : w.poster;
    return src ? [{ src, width: w.width ?? 4, height: w.height ?? 5, title: w.titleRo }] : [];
  });

  const nextSort = items.reduce((max, p) => Math.max(max, p.sort + 1), 0);

  return (
    <div className="grid gap-10">
      <PageHeader
        eyebrow="Prima pagină"
        title="Paletă"
        lede="Culorile din secțiunea „Culorile pe care le facem cel mai bine”: o tușă de pensulă și fotografia care apare când e aleasă."
        actions={<PaletteButton library={library} nextSort={nextSort} />}
      />
      {items.length === 0 ? (
        <EmptyState title="Nicio culoare" action={<PaletteButton library={library} nextSort={nextSort} />}>
          Fără culori, secțiunea nu apare pe prima pagină.
        </EmptyState>
      ) : (
        <ul className="a-list">
          {items.map((p) => (
            <li key={p.id} className="grid grid-cols-[4rem_minmax(0,1fr)] items-center gap-4 border-b border-[var(--line)] py-5 sm:grid-cols-[4rem_minmax(0,1fr)_auto] sm:gap-6">
              <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-bone-3">
                <Image src={p.photo} alt={p.nameRo} fill unoptimized sizes="64px" className="object-cover" />
                <span aria-hidden className="absolute bottom-1 left-1 size-5 rounded-full border border-bone" style={{ background: p.color }} />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <span aria-hidden className="h-3 w-10 shrink-0 rounded-[1px]" style={{ background: p.color }} />
                  <p className="a-h3 break-words">{p.nameRo}</p>
                  {!p.visible && <Badge>Ascunsă</Badge>}
                </div>
                <p className="mt-1 break-words text-sm text-muted">{[p.noteRo, p.noteRu].filter(Boolean).join(" / ") || "Fără descriere"}</p>
                <p className="label mt-1 text-muted-2">
                  {p.nameRu} · {p.color} · ordine {p.sort}
                </p>
              </div>
              <div className="col-span-2 flex items-center gap-2 sm:col-span-1">
                <PaletteButton item={p} library={library} />
                <DeleteButton kind="palette" id={p.id} name={p.nameRo} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
