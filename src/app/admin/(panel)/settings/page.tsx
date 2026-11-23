import type { Metadata } from "next";
import { eq } from "drizzle-orm";
import { PageHeader } from "@/components/admin/ui";
import { SettingsForm } from "@/components/admin/settings-form";
import { db } from "@/db";
import { settings, type SiteSettings } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Setări site" };

const EMPTY: SiteSettings = {
  phone: "",
  email: "",
  instagram: "",
  telegram: "",
  addressRo: "",
  addressRu: "",
  mapUrl: "",
  hours: [],
  announcementRo: "",
  announcementRu: "",
  heroVideo: "",
  heroPoster: "",
};

export default async function SettingsPage() {
  await requireAdmin();
  const row = await db.query.settings.findFirst({ where: eq(settings.key, "site") });

  return (
    <div className="grid gap-10">
      <PageHeader eyebrow="Informații generale" title="Setări site" lede="Contact, program, anunț și materialele din prima pagină." />
      <SettingsForm settings={{ ...EMPTY, ...row?.value }} />
    </div>
  );
}
