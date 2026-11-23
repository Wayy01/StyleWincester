import type { Metadata } from "next";
import Link from "next/link";
import { count, desc, eq } from "drizzle-orm";
import { ArrowRight, ArrowUpRight, BellRinging } from "@phosphor-icons/react/dist/ssr";
import { PageHeader, EmptyState, buttonCls } from "@/components/admin/ui";
import { StatusPill } from "@/components/admin/status-pill";
import { db } from "@/db";
import { bookings, posts, services, works } from "@/db/schema";
import { formatDateTime } from "@/lib/admin/format";
import { timeLabel } from "@/lib/admin/constants";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Prezentare" };

const QUICK = [
  { href: "/admin/bookings?status=new", label: "Programări noi" },
  { href: "/admin/works", label: "Adaugă o lucrare" },
  { href: "/admin/journal/new", label: "Scrie un articol" },
  { href: "/admin/services", label: "Actualizează prețurile" },
  { href: "/admin/settings", label: "Program și anunț" },
];

async function total(table: typeof works | typeof posts | typeof services | typeof bookings, where?: ReturnType<typeof eq>) {
  const query = db.select({ n: count() }).from(table);
  const [{ n }] = await (where ? query.where(where) : query);
  return n;
}

export default async function AdminOverviewPage() {
  const admin = await requireAdmin();
  const [notify, fresh, confirmed, published, portfolio, visible, latest] = await Promise.all([
    db.query.notifySettings.findFirst({ where: (t, { eq }) => eq(t.id, 1), columns: { enabled: true } }),
    total(bookings, eq(bookings.status, "new")),
    total(bookings, eq(bookings.status, "confirmed")),
    total(posts, eq(posts.published, true)),
    total(works),
    total(services, eq(services.visible, true)),
    db.query.bookings.findMany({ orderBy: desc(bookings.createdAt), limit: 6 }),
  ]);

  const tiles = [
    { label: "Programări noi", value: fresh, href: "/admin/bookings?status=new", accent: fresh > 0 },
    { label: "Confirmate", value: confirmed, href: "/admin/bookings?status=confirmed" },
    { label: "Articole publicate", value: published, href: "/admin/journal" },
    { label: "Lucrări în portofoliu", value: portfolio, href: "/admin/works" },
    { label: "Servicii vizibile", value: visible, href: "/admin/services" },
  ];

  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="Panou de control"
        title={`Salut, ${admin.name.split(" ")[0]}`}
        lede="Un rezumat al studioului: cereri noi, conținut publicat și scurtături către ce faci cel mai des."
        actions={
          <a href="/" target="_blank" rel="noreferrer" className={buttonCls("secondary")}>
            Vezi site-ul <ArrowUpRight size={16} aria-hidden />
          </a>
        }
      />

      {!notify?.enabled && (
        <aside className="a-card flex flex-wrap items-center gap-x-4 gap-y-3 border-l-4 border-l-honey px-5 py-4">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#f1e3c6] text-chocolate">
            <BellRinging size={20} weight="fill" aria-hidden />
          </span>
          <div className="min-w-0 flex-1 basis-60">
            <p className="a-h3">Notificările Telegram sunt oprite</p>
            <p className="text-sm text-muted">Primește un mesaj când sosește o cerere nouă, ca să nu o pierzi.</p>
          </div>
          <Link href="/admin/notifications" className={buttonCls("secondary", "sm")}>
            Activează <ArrowRight size={14} aria-hidden />
          </Link>
        </aside>
      )}

      <section aria-label="Cifre" className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {tiles.map((t) => (
          <Link
            key={t.label}
            href={t.href}
            className={`a-card group flex flex-col justify-between gap-5 p-5 transition-[border-color,box-shadow] hover:border-[var(--line-strong)] hover:shadow-md ${t.accent ? "border-oxblood/30 bg-[#fbf3f1]" : ""}`}
          >
            <p className="text-[0.8125rem] font-medium leading-snug text-muted">{t.label}</p>
            <div className="flex items-end justify-between gap-2">
              <p className={`a-stat ${t.accent ? "text-oxblood" : ""}`}>{t.value}</p>
              <ArrowRight size={16} aria-hidden className="mb-1 text-muted-2 transition-transform group-hover:translate-x-0.5 group-hover:text-ink" />
            </div>
          </Link>
        ))}
      </section>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <section aria-labelledby="latest">
          <div className="mb-3 flex items-end justify-between gap-4">
            <h2 id="latest" className="a-h2">
              Ultimele cereri
            </h2>
            <Link href="/admin/bookings" className="inline-flex items-center gap-1.5 text-sm font-medium text-oxblood hover:underline">
              Toate programările <ArrowRight size={14} aria-hidden />
            </Link>
          </div>
          {latest.length === 0 ? (
            <EmptyState title="Încă nicio cerere">Când cineva trimite formularul de pe site, cererea apare aici.</EmptyState>
          ) : (
            <ul className="a-list">
              {latest.map((b) => (
                <li key={b.id} className="grid gap-x-6 gap-y-1 border-b border-[var(--line)] py-4 sm:grid-cols-[1fr_auto] sm:items-center">
                  <div className="min-w-0">
                    <p className="a-h3 truncate">{b.name}</p>
                    <p className="truncate text-sm text-muted">
                      {[b.serviceLabel, [b.preferredDate, timeLabel(b.preferredTime)].filter(Boolean).join(" · ")].filter(Boolean).join(" — ") ||
                        "Fără detalii"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 sm:justify-end">
                    <span className="a-num text-[0.8125rem] text-muted">{formatDateTime(b.createdAt)}</span>
                    <StatusPill status={b.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <aside aria-labelledby="quick">
          <h2 id="quick" className="a-h2 mb-3">
            Scurtături
          </h2>
          <ul className="a-list">
            {QUICK.map((q) => (
              <li key={q.href}>
                <Link href={q.href} className="flex items-center justify-between gap-3 py-3 text-sm font-medium transition-colors hover:text-oxblood">
                  {q.label}
                  <ArrowRight size={15} aria-hidden className="text-muted-2" />
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
