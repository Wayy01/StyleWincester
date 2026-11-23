"use client";

import { startTransition, useActionState, type FormEvent } from "react";
import { login } from "@/lib/admin/auth";
import { Button, TextField } from "./ui";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, null);

  // Submitting through a transition instead of the `action` prop keeps the email filled after a wrong password
  // (React resets uncontrolled fields after a form action).
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => action(data));
  };

  return (
    <form onSubmit={submit} className="grid gap-6" noValidate>
      <TextField label="Email" name="email" type="email" autoComplete="username" autoFocus required />
      <TextField label="Parolă" name="password" type="password" autoComplete="current-password" required />
      <p role="alert" aria-live="polite" className="min-h-5 text-sm text-oxblood-2">
        {state && !state.ok ? state.message : ""}
      </p>
      <Button type="submit" variant="primary" pending={pending} className="w-full">
        {pending ? "Se verifică…" : "Intră în panou"}
      </Button>
    </form>
  );
}
