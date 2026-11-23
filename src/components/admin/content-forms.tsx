"use client";

import { PencilSimple, Plus } from "@phosphor-icons/react/dist/ssr";
import type { Collab, Faq, Testimonial } from "@/db/schema";
import { saveCollab } from "@/lib/admin/collabs";
import { saveFaq, saveTestimonial } from "@/lib/admin/testimonials";
import { DrawerFooter, DrawerTrigger } from "./modal";
import { Bilingual, Button, TextArea, TextField, Toggle } from "./ui";
import { useAdminAction } from "./use-admin-action";

function Footer({ close, pending, editing }: { close: () => void; pending: boolean; editing: boolean }) {
  return (
    <DrawerFooter>
      <Button onClick={close}>Anulează</Button>
      <Button type="submit" variant="primary" pending={pending}>
        {editing ? "Salvează" : "Adaugă"}
      </Button>
    </DrawerFooter>
  );
}

function TestimonialForm({ item, close }: { item?: Testimonial; close: () => void }) {
  const { onSubmit, pending, error } = useAdminAction(saveTestimonial, close);
  return (
    <form onSubmit={onSubmit} className="flex min-h-full flex-col">
      {item && <input type="hidden" name="id" value={item.id} />}
      <div className="grid flex-1 content-start gap-6 p-6 sm:p-8">
        <TextField label="Numele clientei / clientului" name="name" defaultValue={item?.name} error={error("name")} required />
        <Bilingual>
          <TextField label="Serviciu" tag="RO" name="serviceRo" defaultValue={item?.serviceRo} error={error("serviceRo")} />
          <TextField label="Serviciu" tag="RU" name="serviceRu" defaultValue={item?.serviceRu} error={error("serviceRu")} lang="ru" />
        </Bilingual>
        <Bilingual>
          <TextArea label="Recenzie" tag="RO" name="textRo" rows={6} defaultValue={item?.textRo} error={error("textRo")} required />
          <TextArea label="Recenzie" tag="RU" name="textRu" rows={6} defaultValue={item?.textRu} error={error("textRu")} required lang="ru" />
        </Bilingual>
        <div className="grid items-end gap-5 sm:grid-cols-2">
          <TextField label="Ordine" name="sort" type="number" inputMode="numeric" defaultValue={item?.sort ?? 0} error={error("sort")} />
          <Toggle label="Vizibilă pe site" name="visible" defaultChecked={item?.visible ?? true} />
        </div>
      </div>
      <Footer close={close} pending={pending} editing={!!item} />
    </form>
  );
}

export function TestimonialButton({ item }: { item?: Testimonial }) {
  return (
    <DrawerTrigger
      title={item ? "Editează recenzia" : "Recenzie nouă"}
      eyebrow="Recenzii"
      trigger={(open) =>
        item ? (
          <Button size="sm" onClick={open} aria-label={`Editează recenzia de la ${item.name}`}>
            <PencilSimple size={16} aria-hidden />
            Editează
          </Button>
        ) : (
          <Button variant="primary" onClick={open}>
            <Plus size={18} aria-hidden />
            Recenzie nouă
          </Button>
        )
      }
      render={(close) => <TestimonialForm item={item} close={close} />}
    />
  );
}

function FaqForm({ item, close }: { item?: Faq; close: () => void }) {
  const { onSubmit, pending, error } = useAdminAction(saveFaq, close);
  return (
    <form onSubmit={onSubmit} className="flex min-h-full flex-col">
      {item && <input type="hidden" name="id" value={item.id} />}
      <div className="grid flex-1 content-start gap-6 p-6 sm:p-8">
        <Bilingual>
          <TextField label="Întrebare" tag="RO" name="questionRo" defaultValue={item?.questionRo} error={error("questionRo")} required />
          <TextField label="Întrebare" tag="RU" name="questionRu" defaultValue={item?.questionRu} error={error("questionRu")} required lang="ru" />
        </Bilingual>
        <Bilingual>
          <TextArea label="Răspuns" tag="RO" name="answerRo" rows={7} defaultValue={item?.answerRo} error={error("answerRo")} required />
          <TextArea label="Răspuns" tag="RU" name="answerRu" rows={7} defaultValue={item?.answerRu} error={error("answerRu")} required lang="ru" />
        </Bilingual>
        <div className="grid items-end gap-5 sm:grid-cols-2">
          <TextField label="Ordine" name="sort" type="number" inputMode="numeric" defaultValue={item?.sort ?? 0} error={error("sort")} />
          <Toggle label="Vizibilă pe site" name="visible" defaultChecked={item?.visible ?? true} />
        </div>
      </div>
      <Footer close={close} pending={pending} editing={!!item} />
    </form>
  );
}

export function FaqButton({ item }: { item?: Faq }) {
  return (
    <DrawerTrigger
      title={item ? "Editează întrebarea" : "Întrebare nouă"}
      eyebrow="Întrebări frecvente"
      trigger={(open) =>
        item ? (
          <Button size="sm" onClick={open} aria-label={`Editează „${item.questionRo}”`}>
            <PencilSimple size={16} aria-hidden />
            Editează
          </Button>
        ) : (
          <Button variant="primary" onClick={open}>
            <Plus size={18} aria-hidden />
            Întrebare nouă
          </Button>
        )
      }
      render={(close) => <FaqForm item={item} close={close} />}
    />
  );
}

function CollabForm({ item, close }: { item?: Collab; close: () => void }) {
  const { onSubmit, pending, error } = useAdminAction(saveCollab, close);
  return (
    <form onSubmit={onSubmit} className="flex min-h-full flex-col">
      {item && <input type="hidden" name="id" value={item.id} />}
      <div className="grid flex-1 content-start gap-6 p-6 sm:p-8">
        <TextField label="Nume (persoană sau publicație)" name="name" defaultValue={item?.name} error={error("name")} required />
        <Bilingual>
          <TextField label="Rol" tag="RO" name="roleRo" defaultValue={item?.roleRo} error={error("roleRo")} placeholder="Fotograf" />
          <TextField label="Rol" tag="RU" name="roleRu" defaultValue={item?.roleRu} error={error("roleRu")} placeholder="Фотограф" lang="ru" />
        </Bilingual>
        <TextField label="Link" name="url" type="url" defaultValue={item?.url} error={error("url")} placeholder="https://…" hint="Opțional." />
        <div className="grid items-end gap-5 sm:grid-cols-2">
          <TextField label="Ordine" name="sort" type="number" inputMode="numeric" defaultValue={item?.sort ?? 0} error={error("sort")} />
          <Toggle label="Vizibilă pe site" name="visible" defaultChecked={item?.visible ?? true} />
        </div>
      </div>
      <Footer close={close} pending={pending} editing={!!item} />
    </form>
  );
}

export function CollabButton({ item }: { item?: Collab }) {
  return (
    <DrawerTrigger
      title={item ? "Editează colaborarea" : "Colaborare nouă"}
      eyebrow="Colaborări"
      size="md"
      trigger={(open) =>
        item ? (
          <Button size="sm" onClick={open} aria-label={`Editează ${item.name}`}>
            <PencilSimple size={16} aria-hidden />
            Editează
          </Button>
        ) : (
          <Button variant="primary" onClick={open}>
            <Plus size={18} aria-hidden />
            Colaborare nouă
          </Button>
        )
      }
      render={(close) => <CollabForm item={item} close={close} />}
    />
  );
}
