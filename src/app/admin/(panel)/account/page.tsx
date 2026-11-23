import type { Metadata } from "next";
import { AccountForm, ProfileForm } from "@/components/admin/account-form";
import { PageHeader, Section } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Contul meu" };

export default async function AccountPage() {
  const admin = await requireAdmin();
  return (
    <div className="grid gap-10">
      <PageHeader eyebrow={admin.email} title="Contul meu" lede="Numele, emailul și parola de administrator." />
      <div className="grid gap-10">
        <Section title="Profil">
          <ProfileForm name={admin.name} email={admin.email} />
        </Section>
        <Section title="Schimbă parola">
          <AccountForm />
        </Section>
      </div>
    </div>
  );
}
