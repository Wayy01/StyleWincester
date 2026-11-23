"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  CalendarBlank,
  ChatCircleText,
  BellRinging,
  GearSix,
  Handshake,
  Image as ImageIcon,
  List,
  Newspaper,
  Palette,
  Question,
  Scissors,
  SignOut,
  SquaresFour,
  UserCircle,
  UsersThree,
  X,
} from "@phosphor-icons/react/dist/ssr";
import { logout } from "@/lib/admin/auth";
import { cn } from "@/lib/utils";

const GROUPS = [
  {
    title: "Activitate",
    items: [
      { href: "/admin", label: "Prezentare", icon: SquaresFour, exact: true },
      { href: "/admin/bookings", label: "Programări", icon: CalendarBlank },
    ],
  },
  {
    title: "Conținut site",
    items: [
      { href: "/admin/services", label: "Servicii & prețuri", icon: Scissors },
      { href: "/admin/works", label: "Lucrări", icon: ImageIcon },
      { href: "/admin/journal", label: "Jurnal", icon: Newspaper },
      { href: "/admin/palette", label: "Paletă", icon: Palette },
      { href: "/admin/testimonials", label: "Recenzii", icon: ChatCircleText },
      { href: "/admin/faq", label: "Întrebări", icon: Question },
      { href: "/admin/collabs", label: "Colaborări", icon: Handshake },
    ],
  },
  {
    title: "Configurare",
    items: [
      { href: "/admin/settings", label: "Setări site", icon: GearSix },
      { href: "/admin/notifications", label: "Notificări", icon: BellRinging },
      { href: "/admin/users", label: "Utilizatori", icon: UsersThree },
      { href: "/admin/account", label: "Contul meu", icon: UserCircle },
    ],
  },
] as const;

function Brand() {
  return (
    <span className="inline-flex items-center gap-[0.4em] font-mono text-[0.8125rem] font-semibold uppercase leading-none tracking-[0.04em]">
      <span>Style</span>
      <span className="rounded-[3px] bg-bone px-[0.42em] pb-[0.26em] pt-[0.3em] text-ink">Wincester</span>
    </span>
  );
}

function Nav({ pathname, newBookings }: { pathname: string; newBookings: number }) {
  return (
    <nav aria-label="Administrare" className="grid gap-6">
      {GROUPS.map((group) => (
        <div key={group.title}>
          <p className="a-eyebrow mb-2 px-3 text-bone/45">{group.title}</p>
          <ul className="grid gap-0.5">
            {group.items.map(({ href, label, icon: Icon, ...rest }) => {
              const active = "exact" in rest ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      active ? "bg-bone/[0.09] text-bone" : "text-bone/70 hover:bg-bone/[0.05] hover:text-bone",
                    )}
                  >
                    {active && <span aria-hidden className="absolute inset-y-2 -left-4 w-[3px] rounded-r bg-oxblood-2" />}
                    <Icon size={18} weight={active ? "fill" : "regular"} aria-hidden className={active ? "text-honey" : "text-bone/55"} />
                    <span className="flex-1">{label}</span>
                    {href === "/admin/bookings" && newBookings > 0 && (
                      <span className="grid min-w-5 place-items-center rounded-full bg-oxblood-2 px-1.5 text-[0.6875rem] font-semibold leading-5 text-bone">
                        {newBookings}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function SidebarBody({ name, pathname, newBookings }: { name: string; pathname: string; newBookings: number }) {
  return (
    <div className="flex h-full flex-col gap-8 px-4 py-6">
      <div className="px-3">
        <Brand />
        <p className="mt-2.5 text-xs font-medium text-bone/50">Panou de administrare</p>
      </div>
      <Nav pathname={pathname} newBookings={newBookings} />
      <div className="mt-auto grid gap-2 border-t border-bone/10 pt-4">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-bone/70 transition-colors hover:bg-bone/[0.05] hover:text-bone"
        >
          Vezi site-ul
          <ArrowUpRight size={16} aria-hidden />
        </a>
        <div className="flex items-center justify-between gap-3 rounded-lg bg-bone/[0.05] px-3 py-2.5">
          <div className="flex min-w-0 items-center gap-2.5">
            <span aria-hidden className="grid size-8 shrink-0 place-items-center rounded-full bg-oxblood-2 text-xs font-semibold text-bone">
              {name.trim().charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-bone">{name}</p>
              <p className="text-xs text-bone/50">Administrator</p>
            </div>
          </div>
          <form action={logout}>
            <button
              type="submit"
              aria-label="Deconectare"
              title="Deconectare"
              className="grid size-8 place-items-center rounded-md text-bone/70 transition-colors hover:bg-bone/10 hover:text-bone"
            >
              <SignOut size={17} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export function AdminShell({ name, newBookings, children }: { name: string; newBookings: number; children: ReactNode }) {
  const pathname = usePathname();
  // Tied to the pathname it was opened on, so navigating closes the drawer without an effect.
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[16.5rem_minmax(0,1fr)]">
      <aside className="sticky top-0 hidden h-dvh overflow-y-auto bg-ink text-bone lg:block">
        <SidebarBody name={name} pathname={pathname} newBookings={newBookings} />
      </aside>

      <header className="sticky top-0 z-30 flex h-14 items-center justify-between bg-ink px-4 text-bone lg:hidden">
        <Brand />
        <button
          type="button"
          onClick={() => setOpenAt(pathname)}
          aria-label="Deschide meniul"
          aria-expanded={open}
          className="relative grid size-10 place-items-center rounded-lg text-bone/80 hover:bg-bone/10"
        >
          <List size={22} />
          {newBookings > 0 && <span aria-hidden className="absolute right-2 top-2 size-2 rounded-full bg-oxblood-2 ring-2 ring-ink" />}
        </button>
      </header>

      {open && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Meniu"
          onKeyDown={(e) => e.key === "Escape" && setOpenAt(null)}
        >
          <button type="button" aria-label="Închide meniul" className="absolute inset-0 bg-ink/55" onClick={() => setOpenAt(null)} />
          <div className="absolute inset-y-0 left-0 w-[min(18rem,85vw)] overflow-y-auto bg-ink text-bone shadow-2xl">
            <button
              type="button"
              onClick={() => setOpenAt(null)}
              aria-label="Închide meniul"
              autoFocus
              className="absolute right-3 top-4 grid size-9 place-items-center rounded-lg text-bone/70 hover:bg-bone/10 hover:text-bone"
            >
              <X size={18} />
            </button>
            <SidebarBody name={name} pathname={pathname} newBookings={newBookings} />
          </div>
        </div>
      )}

      <main className="min-w-0 px-4 py-7 sm:px-8 lg:px-12 lg:py-10">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
