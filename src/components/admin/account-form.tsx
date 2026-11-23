"use client";

import { useRef } from "react";
import { changePassword } from "@/lib/admin/auth";
import { updateProfile } from "@/lib/admin/users";
import { Button, TextField } from "./ui";
import { useAdminAction } from "./use-admin-action";

export function ProfileForm({ name, email }: { name: string; email: string }) {
  const { onSubmit, pending, error } = useAdminAction(updateProfile);

  return (
    <form onSubmit={onSubmit} className="grid max-w-md gap-6">
      <TextField label="Nume" name="name" defaultValue={name} autoComplete="name" error={error("name")} required />
      <TextField label="Email" name="email" type="email" defaultValue={email} autoComplete="username" error={error("email")} required />
      <div>
        <Button type="submit" variant="primary" pending={pending}>
          {pending ? "Se salvează…" : "Salvează profilul"}
        </Button>
      </div>
    </form>
  );
}

export function AccountForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const { onSubmit, pending, error } = useAdminAction(changePassword, () => formRef.current?.reset());

  return (
    <form ref={formRef} onSubmit={onSubmit} className="grid max-w-md gap-6">
      <TextField label="Parola curentă" name="current" type="password" autoComplete="current-password" error={error("current")} required />
      <TextField label="Parola nouă" name="next" type="password" autoComplete="new-password" minLength={10} error={error("next")} hint="Minim 10 caractere." required />
      <TextField label="Confirmă parola nouă" name="confirm" type="password" autoComplete="new-password" error={error("confirm")} required />
      <div>
        <Button type="submit" variant="primary" pending={pending}>
          {pending ? "Se salvează…" : "Schimbă parola"}
        </Button>
      </div>
    </form>
  );
}
