"use client";

import { Plus } from "@phosphor-icons/react/dist/ssr";
import { createAdmin } from "@/lib/admin/users";
import { DrawerFooter, DrawerTrigger } from "./modal";
import { Button, TextField } from "./ui";
import { useAdminAction } from "./use-admin-action";

function AdminForm({ close }: { close: () => void }) {
  const { onSubmit, pending, error } = useAdminAction(createAdmin, close);
  return (
    <form onSubmit={onSubmit} className="flex min-h-full flex-col">
      <div className="grid flex-1 content-start gap-6 p-6 sm:p-8">
        <TextField label="Nume" name="name" autoComplete="off" error={error("name")} required />
        <TextField label="Email" name="email" type="email" autoComplete="off" error={error("email")} required />
        <TextField label="Parolă" name="password" type="password" autoComplete="new-password" minLength={10} error={error("password")} hint="Minim 10 caractere." required />
        <TextField label="Confirmă parola" name="confirm" type="password" autoComplete="new-password" error={error("confirm")} required />
      </div>
      <DrawerFooter>
        <Button onClick={close}>Anulează</Button>
        <Button type="submit" variant="primary" pending={pending}>
          {pending ? "Se adaugă…" : "Adaugă administrator"}
        </Button>
      </DrawerFooter>
    </form>
  );
}

export function AdminButton() {
  return (
    <DrawerTrigger
      title="Administrator nou"
      eyebrow="Utilizatori"
      size="md"
      trigger={(open) => (
        <Button variant="primary" onClick={open}>
          <Plus size={18} aria-hidden />
          Administrator nou
        </Button>
      )}
      render={(close) => <AdminForm close={close} />}
    />
  );
}
