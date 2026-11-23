import type { Metadata } from "next";
import { NotifyForm } from "@/components/admin/notify-form";
import { PageHeader, Section } from "@/components/admin/ui";
import { db } from "@/db";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Notificări" };

const STEPS = [
  <>Deschide Telegram și caută <strong className="font-medium">@BotFather</strong>. Trimite-i comanda <code>/newbot</code> și urmează pașii (alege un nume și un username care se termină în „bot”).</>,
  <>BotFather îți trimite un <strong className="font-medium">token</strong> (de forma <code>123456789:AA…</code>). Copiază-l și lipește-l mai jos.</>,
  <>Caută noul bot în Telegram, deschide-l și trimite-i orice mesaj (de exemplu „salut”). Dacă vrei notificările într-un grup, adaugă botul în grup și scrie un mesaj acolo.</>,
  <>Apasă <strong className="font-medium">Detectează chat ID</strong>. Câmpul se completează cu ultimul chat în care botul a primit un mesaj.</>,
  <>Bifează <strong className="font-medium">Notificări active</strong> și apasă Salvează.</>,
  <>Apasă <strong className="font-medium">Trimite un mesaj de test</strong>. Dacă mesajul ajunge în Telegram, ești gata.</>,
];

export default async function NotificationsPage() {
  await requireAdmin();
  const row = await db.query.notifySettings.findFirst({ where: (t, { eq }) => eq(t.id, 1) });
  // The token never leaves the server; only its last four characters are shown.
  const tokenHint = row?.telegramToken ? `…${row.telegramToken.slice(-4)}` : null;

  return (
    <div className="grid gap-10">
      <PageHeader
        eyebrow="Telegram"
        title="Notificări"
        lede="Primești un mesaj în Telegram de fiecare dată când cineva trimite o cerere de programare."
      />
      <div className="grid items-start gap-12 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <Section title="Configurare">
          <NotifyForm tokenHint={tokenHint} chatId={row?.telegramChatId ?? ""} enabled={row?.enabled ?? false} />
        </Section>
        <section aria-labelledby="steps" className="min-w-0 border border-[var(--line)] p-5 sm:p-6">
          <h2 id="steps" className="label text-muted">
            Cum configurezi
          </h2>
          <ol className="mt-4 grid gap-4 text-[0.95rem] leading-relaxed text-ink-3 [&_code]:break-all [&_code]:rounded [&_code]:bg-[var(--surface-2)] [&_code]:px-1 [&_code]:font-mono [&_code]:text-[0.85em]">
            {STEPS.map((step, i) => (
              <li key={i} className="grid grid-cols-[1.5rem_minmax(0,1fr)] gap-2">
                <span className="label pt-1 text-oxblood">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
