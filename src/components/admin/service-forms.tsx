"use client";

import { useState } from "react";
import { PencilSimple, Plus } from "@phosphor-icons/react/dist/ssr";
import type { Service, ServiceCategory } from "@/db/schema";
import { saveCategory, saveService } from "@/lib/admin/services";
import { formatPrice } from "@/lib/admin/format";
import { DrawerFooter, DrawerTrigger } from "./modal";
import { Bilingual, Button, SelectField, TextArea, TextField, Toggle } from "./ui";
import { useAdminAction } from "./use-admin-action";

function CategoryForm({ category, close }: { category?: ServiceCategory; close: () => void }) {
  const { onSubmit, pending, error } = useAdminAction(saveCategory, close);
  return (
    <form onSubmit={onSubmit} className="flex min-h-full flex-col">
      {category && <input type="hidden" name="id" value={category.id} />}
      <div className="grid flex-1 content-start gap-6 p-6 sm:p-8">
        <Bilingual>
          <TextField label="Nume" tag="RO" name="nameRo" defaultValue={category?.nameRo} error={error("nameRo")} required />
          <TextField label="Nume" tag="RU" name="nameRu" defaultValue={category?.nameRu} error={error("nameRu")} required lang="ru" />
        </Bilingual>
        <Bilingual>
          <TextArea label="Introducere" tag="RO" name="introRo" defaultValue={category?.introRo} error={error("introRo")} />
          <TextArea label="Introducere" tag="RU" name="introRu" defaultValue={category?.introRu} error={error("introRu")} lang="ru" />
        </Bilingual>
        <TextField
          label="Ordine"
          name="sort"
          type="number"
          inputMode="numeric"
          defaultValue={category?.sort ?? 0}
          error={error("sort")}
          hint="Numărul mai mic apare mai sus."
          className="max-w-40"
        />
      </div>
      <DrawerFooter>
        <Button onClick={close}>Anulează</Button>
        <Button type="submit" variant="primary" pending={pending}>
          {category ? "Salvează" : "Creează categoria"}
        </Button>
      </DrawerFooter>
    </form>
  );
}

export function CategoryButton({ category }: { category?: ServiceCategory }) {
  return (
    <DrawerTrigger
      title={category ? "Editează categoria" : "Categorie nouă"}
      eyebrow="Servicii"
      trigger={(open) =>
        category ? (
          <Button size="sm" onClick={open}>
            <PencilSimple size={16} aria-hidden />
            Categorie
          </Button>
        ) : (
          <Button variant="primary" onClick={open}>
            <Plus size={18} aria-hidden />
            Categorie nouă
          </Button>
        )
      }
      render={(close) => <CategoryForm category={category} close={close} />}
    />
  );
}

function ServiceForm({
  service,
  categories,
  categoryId,
  close,
}: {
  service?: Service;
  categories: Pick<ServiceCategory, "id" | "nameRo">[];
  categoryId?: number;
  close: () => void;
}) {
  const { onSubmit, pending, error } = useAdminAction(saveService, close);
  const [from, setFrom] = useState(String(service?.priceFrom ?? ""));
  const [to, setTo] = useState(service?.priceTo != null ? String(service.priceTo) : "");
  const [isFrom, setIsFrom] = useState(service?.isFrom ?? false);

  const fromN = Number(from);
  const toN = to === "" ? null : Number(to);
  const previewOk = from !== "" && Number.isFinite(fromN) && (toN === null || Number.isFinite(toN));

  return (
    <form onSubmit={onSubmit} className="flex min-h-full flex-col">
      {service && <input type="hidden" name="id" value={service.id} />}
      <div className="grid flex-1 content-start gap-6 p-6 sm:p-8">
        <SelectField label="Categorie" name="categoryId" defaultValue={service?.categoryId ?? categoryId} error={error("categoryId")} required>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nameRo}
            </option>
          ))}
        </SelectField>
        <Bilingual>
          <TextField label="Nume" tag="RO" name="nameRo" defaultValue={service?.nameRo} error={error("nameRo")} required />
          <TextField label="Nume" tag="RU" name="nameRu" defaultValue={service?.nameRu} error={error("nameRu")} required lang="ru" />
        </Bilingual>
        <Bilingual>
          <TextField label="Notă scurtă" tag="RO" name="noteRo" defaultValue={service?.noteRo} error={error("noteRo")} />
          <TextField label="Notă scurtă" tag="RU" name="noteRu" defaultValue={service?.noteRu} error={error("noteRu")} lang="ru" />
        </Bilingual>

        <div className="grid gap-6 border border-[var(--line)] p-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              label="Preț de la (lei)"
              name="priceFrom"
              type="number"
              inputMode="numeric"
              min={0}
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              error={error("priceFrom")}
              required
            />
            <TextField
              label="Preț până la (opțional)"
              name="priceTo"
              type="number"
              inputMode="numeric"
              min={0}
              value={to}
              onChange={(e) => setTo(e.target.value)}
              error={error("priceTo")}
            />
          </div>
          <Toggle
            label="Afișează „de la”"
            hint="Pentru prețuri care cresc în funcție de lungime sau complexitate."
            name="isFrom"
            checked={isFrom}
            onChange={(e) => setIsFrom(e.target.checked)}
          />
          <p className="flex items-baseline justify-between gap-4 border-t border-[var(--line)] pt-4">
            <span className="a-eyebrow text-muted">Previzualizare</span>
            <span className="a-num text-2xl font-semibold" aria-live="polite">
              {previewOk ? formatPrice(fromN, toN, isFrom) : "—"}
            </span>
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <TextField
            label="Durată (minute)"
            name="durationMin"
            type="number"
            inputMode="numeric"
            min={5}
            defaultValue={service?.durationMin ?? 60}
            error={error("durationMin")}
          />
          <TextField label="Ordine" name="sort" type="number" inputMode="numeric" defaultValue={service?.sort ?? 0} error={error("sort")} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Toggle label="Vizibil pe site" name="visible" defaultChecked={service?.visible ?? true} />
          <Toggle label="Recomandat" hint="Apare evidențiat." name="featured" defaultChecked={service?.featured ?? false} />
        </div>
      </div>
      <DrawerFooter>
        <Button onClick={close}>Anulează</Button>
        <Button type="submit" variant="primary" pending={pending}>
          {service ? "Salvează" : "Adaugă serviciul"}
        </Button>
      </DrawerFooter>
    </form>
  );
}

export function ServiceButton({
  service,
  categories,
  categoryId,
}: {
  service?: Service;
  categories: Pick<ServiceCategory, "id" | "nameRo">[];
  categoryId?: number;
}) {
  return (
    <DrawerTrigger
      title={service ? "Editează serviciul" : "Serviciu nou"}
      eyebrow="Servicii & prețuri"
      trigger={(open) =>
        service ? (
          <Button size="sm" onClick={open} aria-label={`Editează ${service.nameRo}`}>
            <PencilSimple size={16} aria-hidden />
            Editează
          </Button>
        ) : (
          <Button size="sm" onClick={open}>
            <Plus size={16} aria-hidden />
            Serviciu
          </Button>
        )
      }
      render={(close) => <ServiceForm service={service} categories={categories} categoryId={categoryId} close={close} />}
    />
  );
}
