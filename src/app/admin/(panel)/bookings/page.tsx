import type { Metadata } from "next";
import Link from "next/link";
import { count, desc } from "drizzle-orm";
import { CaretLeft, CaretRight, DownloadSimple, InstagramLogo, MagnifyingGlass, Phone, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { BookingActions } from "@/components/admin/booking-actions";
import { StatusPill } from "@/components/admin/status-pill";
import { Button, EmptyState, PageHeader, TextField, buttonCls } from "@/components/admin/ui";
import { db } from "@/db";
import { bookings, type BookingStatus } from "@/db/schema";
import { BOOKINGS_PAGE_SIZE, bookingsWhere, parseBookingFilters, searchCondition } from "@/lib/admin/bookings-query";
import { STATUS_LABEL, STATUS_ORDER, lengthLabel, timeLabel } from "@/lib/admin/constants";
import { instagramDmUrl, whatsappUrl } from "@/lib/admin/contact";
import { formatDateTime } from "@/lib/admin/format";
import { requireAdmin } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Programări" };

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="a-eyebrow text-muted">{label}</dt>
      <dd className="mt-0.5">{children}</dd>
    </div>
  );
}

/** Builds /admin/bookings?… keeping only the params that carry a value. */
function href(base: string, params: Record<string, string | number | undefined>) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== "") qs.set(k, String(v));
  const str = qs.toString();
  return str ? `${base}?${str}` : base;
}

function PageLink({
  to,
  disabled,
  base,
  children,
}: {
  to: number;
  disabled: boolean;
  base: Record<string, string | undefined>;
  children: React.ReactNode;
}) {
  if (disabled) {
    return (
      <span aria-disabled="true" className={buttonCls("secondary", "sm")}>
        {children}
      </span>
    );
  }
  return (
    <Link href={href("/admin/bookings", { ...base, page: to > 1 ? to : undefined })} className={buttonCls("secondary", "sm")}>
      {children}
    </Link>
  );
}

export default async function BookingsPage({ searchParams }: { searchParams: Promise<{ status?: string; q?: string; page?: string }> }) {
  await requireAdmin();
  const params = await searchParams;
  const { status: active, q } = parseBookingFilters(params);
  const where = bookingsWhere({ status: active, q });

  // Chip counts follow the search, so they always add up to what the list can show.
  const [[{ total }], grouped] = await Promise.all([
    db.select({ total: count() }).from(bookings).where(where),
    db.select({ status: bookings.status, n: count() }).from(bookings).where(searchCondition(q)).groupBy(bookings.status),
  ]);
  const pages = Math.max(1, Math.ceil(total / BOOKINGS_PAGE_SIZE));
  const page = Math.min(Math.max(1, Math.floor(Number(params.page)) || 1), pages);
  const rows = await db.query.bookings.findMany({
    where,
    orderBy: desc(bookings.createdAt),
    limit: BOOKINGS_PAGE_SIZE,
    offset: (page - 1) * BOOKINGS_PAGE_SIZE,
  });

  const counts = Object.fromEntries(grouped.map((g) => [g.status, g.n])) as Partial<Record<BookingStatus, number>>;
  const all = grouped.reduce((sum, g) => sum + g.n, 0);

  const filters: { key: string; label: string; href: string; n: number; on: boolean }[] = [
    { key: "all", label: "Toate", href: href("/admin/bookings", { q }), n: all, on: !active },
    ...STATUS_ORDER.map((s) => ({
      key: s,
      label: STATUS_LABEL[s],
      href: href("/admin/bookings", { status: s, q }),
      n: counts[s] ?? 0,
      on: active === s,
    })),
  ];
  const exportHref = href("/admin/bookings/export", { status: active, q });

  return (
    <div className="grid gap-8">
      <PageHeader
        eyebrow="Cereri de la clienți"
        title="Programări"
        lede="Cererile trimise prin formularul de pe site, cele mai noi primele."
        actions={
          <a href={exportHref} download className={buttonCls("secondary")}>
            <DownloadSimple size={18} aria-hidden />
            Exportă CSV
          </a>
        }
      />

      <form role="search" action="/admin/bookings" className="flex flex-wrap items-end gap-3">
        {active && <input type="hidden" name="status" value={active} />}
        <TextField
          label="Caută"
          name="q"
          type="search"
          defaultValue={q}
          placeholder="Nume, telefon sau Instagram"
          className="min-w-0 flex-1 sm:max-w-sm"
        />
        <Button type="submit" variant="primary">
          <MagnifyingGlass size={18} aria-hidden />
          Caută
        </Button>
        {q && (
          <Link href={href("/admin/bookings", { status: active })} className={buttonCls("ghost")}>
            Șterge căutarea
          </Link>
        )}
      </form>

      <nav aria-label="Filtrează după status" className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <Link
            key={f.key}
            href={f.href}
            aria-current={f.on ? "page" : undefined}
            className={cn(
              "inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-sm font-medium transition-colors",
              f.on ? "border-ink bg-ink text-bone" : "border-[var(--line-strong)] bg-[var(--surface)] text-ink-3 hover:border-ink/30 hover:text-ink",
            )}
          >
            {f.label}
            <span className={cn("label", f.on ? "text-bone/80" : "text-muted")}>{f.n}</span>
          </Link>
        ))}
      </nav>

      {rows.length === 0 ? (
        <EmptyState title={active || q ? "Nimic de arătat" : "Încă nicio programare"}>
          {active || q ? "Schimbă filtrul sau căutarea ca să vezi celelalte cereri." : "Cererile din formularul de pe site vor apărea aici."}
        </EmptyState>
      ) : (
        <ul className="a-list">
          {rows.map((b) => {
            const when = [b.preferredDate, timeLabel(b.preferredTime)].filter(Boolean).join(" · ");
            const handle = b.instagram.replace(/^@+/, "").trim();
            return (
              <li key={b.id} className="grid gap-5 border-b border-[var(--line)] py-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_auto] lg:gap-8">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="a-h2 break-words">{b.name}</h2>
                    <StatusPill status={b.status} />
                  </div>
                  <div className="mt-3 grid gap-1.5">
                    <a href={`tel:${b.phone.replace(/[^\d+]/g, "")}`} className="inline-flex w-fit items-center gap-2 hover:text-oxblood">
                      <Phone size={16} aria-hidden />
                      {b.phone}
                    </a>
                    {handle && (
                      <a
                        href={`https://instagram.com/${encodeURIComponent(handle)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex w-fit items-center gap-2 hover:text-oxblood"
                      >
                        <InstagramLogo size={16} aria-hidden />@{handle}
                      </a>
                    )}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a href={`tel:${b.phone.replace(/[^\d+]/g, "")}`} className={buttonCls("secondary", "sm")}>
                      <Phone size={16} aria-hidden />
                      Sună
                    </a>
                    <a href={whatsappUrl(b.phone, b.name, b.locale)} target="_blank" rel="noreferrer" className={buttonCls("secondary", "sm")}>
                      <WhatsappLogo size={16} aria-hidden />
                      WhatsApp
                    </a>
                    {handle && (
                      <a href={instagramDmUrl(handle)} target="_blank" rel="noreferrer" className={buttonCls("secondary", "sm")}>
                        <InstagramLogo size={16} aria-hidden />
                        DM
                      </a>
                    )}
                  </div>
                  <p className="label mt-4 text-muted">
                    {formatDateTime(b.createdAt)} · {b.locale}
                  </p>
                </div>

                <dl className="grid content-start gap-3 sm:grid-cols-2">
                  <Detail label="Serviciu">{b.serviceLabel || "—"}</Detail>
                  <Detail label="Data dorită">{when || "—"}</Detail>
                  {b.hairLength && <Detail label="Lungime păr">{lengthLabel(b.hairLength)}</Detail>}
                  {b.message && (
                    <div className="sm:col-span-2">
                      <dt className="a-eyebrow text-muted">Mesaj</dt>
                      <dd className="mt-0.5 whitespace-pre-line break-words text-ink-3">{b.message}</dd>
                    </div>
                  )}
                  {b.adminNote && (
                    <div className="border-l-2 border-honey pl-3 sm:col-span-2">
                      <dt className="a-eyebrow text-muted">Notă internă</dt>
                      <dd className="mt-0.5 whitespace-pre-line break-words">{b.adminNote}</dd>
                    </div>
                  )}
                </dl>

                <BookingActions booking={{ id: b.id, name: b.name, status: b.status, adminNote: b.adminNote }} />
              </li>
            );
          })}
        </ul>
      )}

      {pages > 1 && (
        <nav aria-label="Pagini" className="flex items-center justify-between gap-3">
          <PageLink to={page - 1} disabled={page <= 1} base={{ status: active, q }}>
            <CaretLeft size={16} aria-hidden />
            Înapoi
          </PageLink>
          <p className="label text-muted">
            Pagina {page} din {pages} · {total} cereri
          </p>
          <PageLink to={page + 1} disabled={page >= pages} base={{ status: active, q }}>
            Înainte
            <CaretRight size={16} aria-hidden />
          </PageLink>
        </nav>
      )}
    </div>
  );
}
