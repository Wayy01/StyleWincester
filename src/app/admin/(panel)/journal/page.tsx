import type { Metadata } from "next";
import Link from "next/link";
import { desc } from "drizzle-orm";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { DeleteButton } from "@/components/admin/delete-button";
import { MediaThumb } from "@/components/admin/media-thumb";
import { Badge, EmptyState, PageHeader, buttonCls } from "@/components/admin/ui";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { formatDateTime } from "@/lib/admin/format";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Jurnal" };

const NewPost = () => (
  <Link href="/admin/journal/new" className={buttonCls("primary")}>
    <Plus size={18} aria-hidden />
    Articol nou
  </Link>
);

export default async function JournalPage() {
  await requireAdmin();
  const items = await db.query.posts.findMany({ orderBy: desc(posts.createdAt) });

  return (
    <div className="grid gap-10">
      <PageHeader eyebrow="Blog" title="Jurnal" lede="Articolele studioului, în română și rusă." actions={<NewPost />} />

      {items.length === 0 ? (
        <EmptyState title="Jurnalul e gol" action={<NewPost />}>
          Scrie primul articol: o poveste despre o transformare, un sfat de îngrijire sau o zi în studio.
        </EmptyState>
      ) : (
        <ul className="a-list">
          {items.map((p) => (
            <li key={p.id} className="grid grid-cols-[5rem_minmax(0,1fr)] items-center gap-4 border-b border-[var(--line)] py-4 sm:grid-cols-[6rem_minmax(0,1fr)_auto] sm:gap-6">
              <Link href={`/admin/journal/${p.id}`} className="relative block aspect-[4/5] overflow-hidden bg-bone-3" aria-hidden tabIndex={-1}>
                {p.cover && <MediaThumb kind="photo" src={p.cover} alt="" />}
              </Link>
              <div className="min-w-0">
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <Badge tone={p.published ? "ok" : "plain"}>{p.published ? "Publicat" : "Ciornă"}</Badge>
                  {p.topicRo && <span className="label text-muted">{p.topicRo}</span>}
                </div>
                <Link href={`/admin/journal/${p.id}`} className="a-h3 block text-[1.0625rem] transition-colors hover:text-oxblood">
                  {p.titleRo}
                </Link>
                <p className="truncate text-sm text-muted">{p.titleRu}</p>
                <p className="label mt-1.5 text-muted-2">
                  /{p.slug} · {p.readingMin} min · {p.publishedAt ? formatDateTime(p.publishedAt) : `creat ${formatDateTime(p.createdAt)}`}
                </p>
              </div>
              <div className="col-span-2 flex items-center gap-2 sm:col-span-1">
                <Link href={`/admin/journal/${p.id}`} className={buttonCls("secondary", "sm")}>
                  Editează
                </Link>
                <DeleteButton kind="post" id={p.id} name={p.titleRo} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
