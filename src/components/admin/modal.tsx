"use client";

import { useEffect, useRef, useState, useTransition, type ReactNode } from "react";
import { X } from "@phosphor-icons/react/dist/ssr";
import { toast } from "sonner";
import type { ActionState } from "@/lib/admin/result";
import { cn } from "@/lib/utils";
import { Button } from "./ui";

/** Side drawer on a native <dialog>: focus trap, Esc and inert background come from the platform. Mount it only while open. */
export function Drawer({
  title,
  eyebrow,
  onClose,
  children,
  size = "lg",
}: {
  title: string;
  eyebrow?: string;
  onClose: () => void;
  children: ReactNode;
  size?: "md" | "lg" | "xl";
}) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      aria-label={title}
      className={cn(
        "fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-full max-w-none overflow-hidden bg-[var(--canvas)] p-0 text-ink",
        "border-l border-[var(--line-strong)] shadow-2xl backdrop:bg-ink/50 backdrop:backdrop-blur-[2px]",
        size === "md" && "sm:w-[34rem]",
        size === "lg" && "sm:w-[46rem]",
        size === "xl" && "sm:w-[60rem]",
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-4 border-b border-[var(--line)] bg-[var(--surface)] px-6 py-5 sm:px-8">
          <div>
            {eyebrow && <p className="a-eyebrow text-oxblood">{eyebrow}</p>}
            <h2 className="a-h2 mt-1 text-[1.375rem]">{title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Închide"
            className="grid size-9 shrink-0 place-items-center rounded-lg text-muted transition-colors hover:bg-ink/5 hover:text-ink"
          >
            <X size={18} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
      </div>
    </dialog>
  );
}

/** Sticky action row for forms inside a Drawer. */
export function DrawerFooter({ children }: { children: ReactNode }) {
  return (
    <div className="sticky bottom-0 flex flex-wrap items-center justify-end gap-2.5 border-t border-[var(--line)] bg-[var(--surface)] px-6 py-4 sm:px-8">
      {children}
    </div>
  );
}

/** Drawer toggled by its trigger; `render` receives a close callback so forms can dismiss on success. */
export function DrawerTrigger({
  trigger,
  title,
  eyebrow,
  size,
  render,
}: {
  trigger: (open: () => void) => ReactNode;
  title: string;
  eyebrow?: string;
  size?: "md" | "lg" | "xl";
  render: (close: () => void) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <>
      {trigger(() => setOpen(true))}
      {open && (
        <Drawer title={title} eyebrow={eyebrow} size={size} onClose={close}>
          {render(close)}
        </Drawer>
      )}
    </>
  );
}

/** Two-step delete: a small native dialog asks before the server action runs. */
export function ConfirmDelete({
  id,
  action,
  title,
  description,
  trigger,
  onDeleted,
}: {
  id: number;
  action: (id: number) => Promise<ActionState>;
  title: string;
  description: string;
  trigger: (open: () => void) => ReactNode;
  onDeleted?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (open && dialog && !dialog.open) dialog.showModal();
  }, [open]);

  function confirm() {
    startTransition(async () => {
      const result = await action(id);
      if (result?.ok) {
        toast.success(result.message);
        setOpen(false);
        onDeleted?.();
      } else {
        toast.error(result?.message ?? "Nu s-a putut șterge.");
      }
    });
  }

  return (
    <>
      {trigger(() => setOpen(true))}
      {open && (
        <dialog
          ref={ref}
          onClose={() => !pending && setOpen(false)}
          onClick={(e) => e.target === e.currentTarget && !pending && setOpen(false)}
          aria-labelledby={`confirm-${id}`}
          className="fixed top-1/2 left-1/2 m-0 w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-0 text-ink shadow-2xl backdrop:bg-ink/50 backdrop:backdrop-blur-[2px]"
        >
          <div className="grid gap-4 p-6">
            <h2 id={`confirm-${id}`} className="a-h2">
              {title}
            </h2>
            <p className="text-[0.9375rem] leading-relaxed text-muted">{description}</p>
            <div className="mt-2 flex justify-end gap-3">
              <Button onClick={() => setOpen(false)} disabled={pending}>
                Anulează
              </Button>
              <Button variant="primary" onClick={confirm} pending={pending}>
                Șterge definitiv
              </Button>
            </div>
          </div>
        </dialog>
      )}
    </>
  );
}
