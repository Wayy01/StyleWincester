import type { Metadata } from "next";
import { asc, desc } from "drizzle-orm";
import { DeleteButton } from "@/components/admin/delete-button";
import { MediaThumb } from "@/components/admin/media-thumb";
import { Badge, EmptyState, PageHeader } from "@/components/admin/ui";
import { WorkButton } from "@/components/admin/work-form";
import { db } from "@/db";
import { works } from "@/db/schema";
import { WORK_TAG_LABEL } from "@/lib/admin/constants";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Lucrări" };

export default async function WorksPage() {
  await requireAdmin();
  const items = await db.query.works.findMany({ orderBy: [asc(works.sort), desc(works.id)] });

  return (
    <div className="grid gap-10">
      <PageHeader
        eyebrow="Portofoliu"
        title="Lucrări"
        lede="Fotografiile și video-urile din galeria site-ului."
        actions={<WorkButton />}
      />

      {items.length === 0 ? (
        <EmptyState title="Portofoliul e gol" action={<WorkButton />}>
          Încarcă prima fotografie sau primul video ca să apară în galerie.
        </EmptyState>
      ) : (
        <ul className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 xl:grid-cols-4">
          {items.map((w) => (
            <li key={w.id} className="flex flex-col">
              <div className="relative aspect-[4/5] overflow-hidden bg-bone-3">
                <MediaThumb kind={w.kind} src={w.src} poster={w.poster} alt={w.titleRo} />
                <div className="absolute left-2 top-2 flex flex-wrap gap-1">
                  {!w.published && <Badge tone="accent">Ciornă</Badge>}
                  {w.featured && <Badge tone="ok">Evidențiată</Badge>}
                  {w.kind === "video" && <Badge>Video</Badge>}
                </div>
              </div>
              <div className="mt-3 min-w-0 flex-1">
                <p className="label text-muted">
                  {WORK_TAG_LABEL[w.tag]} · ordine {w.sort}
                </p>
                <p className="mt-1 truncate text-lg">{w.titleRo}</p>
                <p className="truncate text-sm text-muted">{w.titleRu}</p>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <WorkButton work={w} />
                <DeleteButton kind="work" id={w.id} name={w.titleRo} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
