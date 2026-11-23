"use client";

import type { ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";

/** The big "book now" block is pointless on the booking page itself. */
export function FooterCta({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/book") return null;
  return <>{children}</>;
}
