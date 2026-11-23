"use client";

import { PencilSimple, Plus } from "@phosphor-icons/react/dist/ssr";
import type { Work } from "@/db/schema";
import { IMAGE_ACCEPT, VIDEO_ACCEPT, VIDEO_HINT, WORK_TAG_LABEL, WORK_TAG_ORDER } from "@/lib/admin/constants";
import { saveWork } from "@/lib/admin/works";
import { MediaThumb } from "./media-thumb";
import { DrawerFooter, DrawerTrigger } from "./modal";
import { Bilingual, Button, FileField, SelectField, TextArea, TextField, Toggle } from "./ui";
import { useAdminAction } from "./use-admin-action";

function WorkForm({ work, close }: { work?: Work; close: () => void }) {
  const { onSubmit, pending, error } = useAdminAction(saveWork, close);

  return (
    <form onSubmit={onSubmit} className="flex min-h-full flex-col">
      {work && <input type="hidden" name="id" value={work.id} />}
      <div className="grid flex-1 content-start gap-6 p-6 sm:p-8">
        {work && (
          <div className="relative aspect-[4/3] max-h-64 w-full overflow-hidden bg-bone-3">
            <MediaThumb kind={work.kind} src={work.src} poster={work.poster} alt={work.titleRo} className="object-contain" />
          </div>
        )}
        <div className="grid gap-5 sm:grid-cols-2">
          <FileField
            label={work ? "Înlocuiește fișierul" : "Fotografie sau video"}
            name="file"
            accept={`${IMAGE_ACCEPT},${VIDEO_ACCEPT}`}
            hint={`Foto până la 25 MB (se convertește în WebP). Video: ${VIDEO_HINT}`}
            error={error("file")}
            required={!work}
          />
          <FileField
            label="Copertă video (opțional)"
            name="posterFile"
            accept={IMAGE_ACCEPT}
            hint="Doar pentru video. Altfel se folosește primul cadru."
            error={error("posterFile")}
          />
        </div>

        <Bilingual>
          <TextField label="Titlu" tag="RO" name="titleRo" defaultValue={work?.titleRo} error={error("titleRo")} required />
          <TextField label="Titlu" tag="RU" name="titleRu" defaultValue={work?.titleRu} error={error("titleRu")} required lang="ru" />
        </Bilingual>
        <Bilingual>
          <TextArea label="Descriere" tag="RO" name="captionRo" defaultValue={work?.captionRo} error={error("captionRo")} />
          <TextArea label="Descriere" tag="RU" name="captionRu" defaultValue={work?.captionRu} error={error("captionRu")} lang="ru" />
        </Bilingual>

        <div className="grid gap-5 sm:grid-cols-3">
          <SelectField label="Categorie" name="tag" defaultValue={work?.tag ?? "cut"} error={error("tag")}>
            {WORK_TAG_ORDER.map((t) => (
              <option key={t} value={t}>
                {WORK_TAG_LABEL[t]}
              </option>
            ))}
          </SelectField>
          <TextField label="Credit foto" name="credit" defaultValue={work?.credit} error={error("credit")} placeholder="@fotograf" />
          <TextField label="Ordine" name="sort" type="number" inputMode="numeric" defaultValue={work?.sort ?? 0} error={error("sort")} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Toggle label="Publicată pe site" name="published" defaultChecked={work?.published ?? true} />
          <Toggle label="Evidențiată" hint="Video-urile evidențiate apar în banda de film de pe prima pagină." name="featured" defaultChecked={work?.featured ?? false} />
        </div>
      </div>
      <DrawerFooter>
        <Button onClick={close}>Anulează</Button>
        <Button type="submit" variant="primary" pending={pending}>
          {pending ? "Se încarcă…" : work ? "Salvează" : "Adaugă lucrarea"}
        </Button>
      </DrawerFooter>
    </form>
  );
}

export function WorkButton({ work }: { work?: Work }) {
  return (
    <DrawerTrigger
      title={work ? "Editează lucrarea" : "Lucrare nouă"}
      eyebrow="Portofoliu"
      trigger={(open) =>
        work ? (
          <Button size="sm" onClick={open} aria-label={`Editează ${work.titleRo}`}>
            <PencilSimple size={16} aria-hidden />
            Editează
          </Button>
        ) : (
          <Button variant="primary" onClick={open}>
            <Plus size={18} aria-hidden />
            Lucrare nouă
          </Button>
        )
      }
      render={(close) => <WorkForm work={work} close={close} />}
    />
  );
}
