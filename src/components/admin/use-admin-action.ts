"use client";

import { useActionState, useEffect, useRef, startTransition, type FormEvent } from "react";
import { toast } from "sonner";
import type { ActionState } from "@/lib/admin/result";

type FormAction = (prev: ActionState, fd: FormData) => Promise<ActionState>;

/**
 * Wraps a server action for a form. The form is submitted through onSubmit (not the `action` prop)
 * because React resets uncontrolled fields after an action, which would wipe the user's input on a validation error.
 */
export function useAdminAction(action: FormAction, onSuccess?: () => void) {
  const [state, dispatch, pending] = useActionState(action, null);
  const handled = useRef<ActionState>(null);
  const successRef = useRef(onSuccess);
  useEffect(() => {
    successRef.current = onSuccess;
  });

  useEffect(() => {
    if (!state || handled.current === state) return;
    handled.current = state;
    if (state.ok) {
      toast.success(state.message);
      successRef.current?.();
    } else {
      toast.error(state.message);
    }
  }, [state]);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => dispatch(fd));
  }

  const errors = state?.fieldErrors;
  return { onSubmit, pending, error: (name: string) => errors?.[name]?.[0] };
}
