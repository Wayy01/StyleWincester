"use client";

import { useState } from "react";
import Image from "next/image";
import { PencilSimple, Plus } from "@phosphor-icons/react/dist/ssr";
import type { PaletteSwatch } from "@/db/schema";
import { IMAGE_ACCEPT } from "@/lib/admin/constants";
import { savePalette } from "@/lib/admin/palette";
import { cn } from "@/lib/utils";
import { DrawerFooter, DrawerTrigger } from "./modal";
import { Bilingual, Button, FileField, TextField, Toggle } from "./ui";
import { useAdminAction } from "./use-admin-action";

/** A portfolio image that can be reused as a swatch photo (photos, or video posters). */
export type LibraryImage = { src: string; width: number; height: number; title: string };

function PaletteForm({ item, library, nextSort, close }: { item?: PaletteSwatch; library: LibraryImage[]; nextSort: number; close: () => void }) {
  const { onSubmit, pending, error } = useAdminAction(savePalette, close);
  const [color, setColor] = useState(item?.color ?? "#3b2418");
  const [chosen, setChosen] = useState(item?.photo ?? "");
  const validHex = /^#[0-9a-f]{6}$/i.test(color);

  return (
    <form onSubmit={onSubmit} className="flex min-h-full flex-col">
      {item && <input type="hidden" name="id" value={item.id} />}
      <div className="grid flex-1 content-start gap-6 p-6 sm:p-8">
        <Bilingual>
          <TextField label="Nume" tag="RO" name="nameRo" defaultValue={item?.nameRo} error={error("nameRo")} placeholder="Dark Chocolate" required />
          <TextField label="Nume" tag="RU" name="nameRu" defaultValue={item?.nameRu} error={error("nameRu")} placeholder="Dark Chocolate" required lang="ru" />
        </Bilingual>
        <Bilingual>
          <TextField label="Descriere scurtă" tag="RO" name="noteRo" defaultValue={item?.noteRo} error={error("noteRo")} placeholder="castaniu rece, luciu de oglindă" />
          <TextField label="Descriere scurtă" tag="RU" name="noteRu" defaultValue={item?.noteRu} error={error("noteRu")} placeholder="холодный каштан, зеркальный блеск" lang="ru" />
        </Bilingual>

        <div className="grid gap-2">
          <span className="a-field mb-0">Culoare</span>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={validHex ? color : "#000000"}
              onChange={(e) => setColor(e.target.value)}
              aria-label="Alege culoarea"
              className="h-10 w-12 shrink-0 cursor-pointer rounded-lg border border-[var(--line-strong)] bg-[var(--surface)] p-1"
            />
            <TextField label="Cod hex" name="color" value={color} onChange={(e) => setColor(e.target.value.trim())} error={error("color")} className="max-w-40 flex-1" spellCheck={false} />
            <span aria-hidden className="h-10 flex-1 rounded-lg border border-[var(--line)]" style={{ background: validHex ? color : "transparent" }} />
          </div>
          <span className="text-sm text-muted">Pe site apare ca o tușă de pensulă în această culoare.</span>
        </div>

        <div className="grid gap-3">
          <FileField
            label={item ? "Încarcă o fotografie nouă" : "Încarcă o fotografie"}
            name="photoFile"
            accept={IMAGE_ACCEPT}
            hint="Sau alege mai jos o fotografie din portofoliu. Încărcarea are prioritate."
            error={error("photoFile")}
          />
          {library.length > 0 && (
            <fieldset>
              <legend className="a-field">Din portofoliu</legend>
              <div className="grid max-h-72 grid-cols-4 gap-2 overflow-y-auto pr-1 sm:grid-cols-5" data-lenis-prevent>
                {library.map((img) => {
                  const value = `${img.src}|${img.width}|${img.height}`;
                  const selected = chosen === img.src;
                  return (
                    <label key={img.src} className="group relative block cursor-pointer" title={img.title}>
                      <input type="radio" name="library" value={value} checked={selected} onChange={() => setChosen(img.src)} className="peer sr-only" />
                      <span
                        className={cn(
                          "relative block aspect-[4/5] overflow-hidden rounded-lg border-2 transition-colors peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-oxblood",
                          selected ? "border-oxblood" : "border-transparent group-hover:border-[var(--line-strong)]",
                        )}
                      >
                        <Image src={img.src} alt={img.title} fill unoptimized sizes="96px" className="object-cover" />
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
          )}
          {item && !library.some((l) => l.src === item.photo) && (
            <p className="text-sm text-muted">Fotografia actuală rămâne dacă nu alegi alta.</p>
          )}
        </div>

        <div className="grid items-end gap-5 sm:grid-cols-2">
          <TextField label="Ordine" name="sort" type="number" inputMode="numeric" defaultValue={item?.sort ?? nextSort} error={error("sort")} />
          <Toggle label="Vizibilă pe site" name="visible" defaultChecked={item?.visible ?? true} />
        </div>
      </div>
      <DrawerFooter>
        <Button onClick={close}>Anulează</Button>
        <Button type="submit" variant="primary" pending={pending}>
          {item ? "Salvează" : "Adaugă"}
        </Button>
      </DrawerFooter>
    </form>
  );
}

/** New colours default to the end of the list. */
export function PaletteButton({ item, library, nextSort = 0 }: { item?: PaletteSwatch; library: LibraryImage[]; nextSort?: number }) {
  return (
    <DrawerTrigger
      title={item ? "Editează culoarea" : "Culoare nouă"}
      eyebrow="Paletă"
      size="lg"
      trigger={(open) =>
        item ? (
          <Button size="sm" onClick={open} aria-label={`Editează ${item.nameRo}`}>
            <PencilSimple size={16} aria-hidden />
            Editează
          </Button>
        ) : (
          <Button variant="primary" onClick={open}>
            <Plus size={18} aria-hidden />
            Culoare nouă
          </Button>
        )
      }
      render={(close) => <PaletteForm item={item} library={library} nextSort={nextSort} close={close} />}
    />
  );
}
