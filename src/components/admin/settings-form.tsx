"use client";

import { useRef, useState } from "react";
import { Plus, X } from "@phosphor-icons/react/dist/ssr";
import type { SiteSettings } from "@/db/schema";
import { IMAGE_ACCEPT, VIDEO_ACCEPT, VIDEO_HINT } from "@/lib/admin/constants";
import { saveSettings } from "@/lib/admin/settings";
import { Bilingual, Button, FileField, Section, TextField } from "./ui";
import { useAdminAction } from "./use-admin-action";

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const { onSubmit, pending, error } = useAdminAction(saveSettings);
  const nextKey = useRef(settings.hours.length);
  const [rows, setRows] = useState(() => settings.hours.map((h, i) => ({ ...h, key: i })));

  return (
    <form onSubmit={onSubmit} className="grid max-w-4xl gap-10 pb-24">
      <Section title="Contact">
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Telefon" name="phone" type="tel" defaultValue={settings.phone} error={error("phone")} placeholder="+373 …" />
          <TextField label="Email" name="email" type="email" defaultValue={settings.email} error={error("email")} />
          <TextField label="Instagram" name="instagram" defaultValue={settings.instagram} error={error("instagram")} placeholder="stylewincester" hint="Fără @." />
          <TextField label="Telegram" name="telegram" defaultValue={settings.telegram} error={error("telegram")} hint="Fără @." />
        </div>
      </Section>

      <Section title="Adresă">
        <Bilingual>
          <TextField label="Adresă" tag="RO" name="addressRo" defaultValue={settings.addressRo} error={error("addressRo")} />
          <TextField label="Adresă" tag="RU" name="addressRu" defaultValue={settings.addressRu} error={error("addressRu")} lang="ru" />
        </Bilingual>
        <TextField label="Link hartă" name="mapUrl" type="url" defaultValue={settings.mapUrl} error={error("mapUrl")} placeholder="https://maps.google.com/…" />
      </Section>

      <Section title="Program">
        {rows.length === 0 && <p className="text-muted">Niciun interval. Adaugă primul rând.</p>}
        <ul className="grid gap-4">
          {rows.map((r, i) => (
            <li key={r.key} className="grid gap-3 border border-[var(--line)] p-4 sm:grid-cols-[1fr_1fr_9rem_auto] sm:items-end">
              <TextField label="Zile" tag="RO" name="hoursDaysRo" defaultValue={r.daysRo} placeholder="Luni – Vineri" maxLength={80} />
              <TextField label="Zile" tag="RU" name="hoursDaysRu" defaultValue={r.daysRu} placeholder="Пн – Пт" maxLength={80} lang="ru" />
              <TextField label="Ore" name="hoursTime" defaultValue={r.time} placeholder="10:00 – 20:00" maxLength={40} />
              <Button size="sm" variant="ghost" onClick={() => setRows((all) => all.filter((x) => x.key !== r.key))} aria-label={`Șterge rândul ${i + 1}`} className="h-11 sm:w-11 sm:px-0">
                <X size={16} aria-hidden />
                <span className="sm:sr-only">Șterge</span>
              </Button>
            </li>
          ))}
        </ul>
        <div>
          <Button size="sm" onClick={() => setRows((all) => [...all, { daysRo: "", daysRu: "", time: "", key: nextKey.current++ }])}>
            <Plus size={16} aria-hidden />
            Adaugă interval
          </Button>
        </div>
      </Section>

      <Section title="Anunț în bara de sus">
        <Bilingual>
          <TextField label="Anunț" tag="RO" name="announcementRo" defaultValue={settings.announcementRo} error={error("announcementRo")} maxLength={200} />
          <TextField label="Anunț" tag="RU" name="announcementRu" defaultValue={settings.announcementRu} error={error("announcementRu")} maxLength={200} lang="ru" />
        </Bilingual>
        <p className="-mt-2 text-sm text-muted">Lasă ambele câmpuri goale ca să ascunzi bara.</p>
      </Section>

      <Section title="Hero (prima pagină)">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="grid content-start gap-3">
            <TextField label="Video hero (cale)" name="heroVideo" defaultValue={settings.heroVideo} error={error("heroVideo")} />
            <FileField label="Sau încarcă un video nou" name="heroVideoFile" accept={VIDEO_ACCEPT} error={error("heroVideoFile")} hint={`Înlocuiește calea de mai sus. ${VIDEO_HINT}`} />
          </div>
          <div className="grid content-start gap-3">
            <TextField label="Poster hero (cale)" name="heroPoster" defaultValue={settings.heroPoster} error={error("heroPoster")} />
            <FileField label="Sau încarcă un poster nou" name="heroPosterFile" accept={IMAGE_ACCEPT} error={error("heroPosterFile")} hint="Înlocuiește calea de mai sus. Dacă lipsește, se folosește primul cadru al video-ului nou." />
          </div>
        </div>
      </Section>

      <div className="fixed inset-x-0 bottom-0 z-20 flex justify-end border-t border-[var(--line)] bg-[var(--surface)]/95 px-4 py-3 backdrop-blur sm:px-8 lg:left-[16.5rem]">
        <Button type="submit" variant="primary" pending={pending}>
          {pending ? "Se încarcă…" : "Salvează setările"}
        </Button>
      </div>
    </form>
  );
}
