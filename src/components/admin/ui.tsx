import type { ComponentProps, ReactNode } from "react";
import { CircleNotch } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

/* ---------- buttons ---------- */

type Variant = "primary" | "secondary" | "ghost" | "danger";

const variants: Record<Variant, string> = {
  primary: "border border-oxblood bg-oxblood text-bone shadow-[0_1px_2px_rgba(110,27,23,0.25)] hover:bg-oxblood-2 hover:border-oxblood-2",
  secondary: "border border-[var(--line-strong)] bg-[var(--surface)] text-ink shadow-[0_1px_2px_rgba(21,17,14,0.05)] hover:bg-[var(--surface-2)] hover:border-ink/30",
  ghost: "border border-transparent text-ink-3 hover:bg-ink/5 hover:text-ink",
  danger: "border border-[var(--line-strong)] bg-[var(--surface)] text-oxblood hover:bg-oxblood hover:text-bone hover:border-oxblood",
};

export function buttonCls(variant: Variant = "secondary", size: "md" | "sm" = "md") {
  return cn(
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg font-sans font-medium tracking-[-0.005em] transition-colors",
    "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
    size === "md" ? "h-10 px-4 text-sm" : "h-8 px-3 text-[0.8125rem]",
    variants[variant],
  );
}

export function Button({
  variant = "secondary",
  size = "md",
  pending,
  className,
  children,
  disabled,
  type = "button",
  ...rest
}: ComponentProps<"button"> & { variant?: Variant; size?: "md" | "sm"; pending?: boolean }) {
  return (
    <button type={type} disabled={disabled || pending} className={cn(buttonCls(variant, size), className)} {...rest}>
      {pending && <CircleNotch size={16} className="animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

/* ---------- page chrome ---------- */

export function PageHeader({
  eyebrow,
  title,
  lede,
  actions,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-5 border-b border-[var(--line)] pb-7">
      <div className="min-w-0 max-w-2xl">
        <p className="a-eyebrow text-oxblood">{eyebrow}</p>
        <h1 className="a-title mt-2 break-words">{title}</h1>
        {lede && <p className="mt-2.5 text-[0.9375rem] leading-relaxed text-muted">{lede}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2.5">{actions}</div>}
    </header>
  );
}

export function EmptyState({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-2 rounded-[14px] border border-dashed border-[var(--line-strong)] bg-[var(--surface)]/60 px-6 py-12 sm:items-center sm:text-center">
      <p className="a-h2">{title}</p>
      {children && <p className="max-w-md text-[0.9375rem] text-muted">{children}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

export function Badge({ tone = "plain", children }: { tone?: "plain" | "accent" | "ok"; children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium leading-5",
        // Opaque fills: badges also sit on top of photos in the portfolio grid.
        tone === "plain" && "border-[var(--line-strong)] bg-[var(--surface)] text-ink-3",
        tone === "accent" && "border-oxblood bg-oxblood text-bone",
        tone === "ok" && "border-[#d9bf8f] bg-[#f1e3c6] text-chocolate",
      )}
    >
      {children}
    </span>
  );
}

/* ---------- form fields ---------- */

const SELECT_CHEVRON = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'><path d='M1 1.5l5 5 5-5' fill='none' stroke='%2315110e' stroke-width='1.4'/></svg>\")";

const control = cn(
  "w-full min-h-10 rounded-lg border border-[var(--line-strong)] bg-[var(--surface)] px-3 py-2 text-[0.9375rem] text-ink",
  "shadow-[inset_0_1px_1px_rgba(21,17,14,0.04)] placeholder:text-muted-2 transition-[border-color,box-shadow]",
  "hover:border-ink/30 focus:border-oxblood focus:outline-none focus:ring-4 focus:ring-[var(--ring)]",
  "disabled:opacity-50 aria-[invalid=true]:border-oxblood-2 aria-[invalid=true]:ring-4 aria-[invalid=true]:ring-[var(--ring)]",
);

type FieldShell = { label: string; tag?: "RO" | "RU"; hint?: string; error?: string; className?: string };

function Shell({ label, tag, hint, error, className, children }: FieldShell & { children: ReactNode }) {
  return (
    <label className={cn("block", className)}>
      <span className="a-field">
        {label}
        {tag && <span className="rounded border border-[var(--line-strong)] bg-[var(--surface-2)] px-1.5 text-[0.625rem] font-semibold tracking-wide text-muted">{tag}</span>}
      </span>
      {children}
      {hint && !error && <span className="mt-1.5 block text-[0.8125rem] leading-snug text-muted">{hint}</span>}
      {error && (
        <span role="alert" className="mt-1.5 block text-[0.8125rem] font-medium text-oxblood-2">
          {error}
        </span>
      )}
    </label>
  );
}

export function TextField({ label, tag, hint, error, className, ...rest }: FieldShell & ComponentProps<"input">) {
  return (
    <Shell {...{ label, tag, hint, error, className }}>
      <input {...rest} aria-invalid={error ? true : undefined} className={control} />
    </Shell>
  );
}

export function TextArea({ label, tag, hint, error, className, ...rest }: FieldShell & ComponentProps<"textarea">) {
  return (
    <Shell {...{ label, tag, hint, error, className }}>
      <textarea rows={3} {...rest} aria-invalid={error ? true : undefined} className={cn(control, "resize-y leading-relaxed")} />
    </Shell>
  );
}

export function SelectField({ label, hint, error, className, children, ...rest }: FieldShell & ComponentProps<"select">) {
  return (
    <Shell {...{ label, hint, error, className }}>
      <select
        {...rest}
        aria-invalid={error ? true : undefined}
        className={cn(control, "appearance-none bg-[length:12px] bg-[right_0.85rem_center] bg-no-repeat pr-9")}
        style={{ backgroundImage: SELECT_CHEVRON }}
      >
        {children}
      </select>
    </Shell>
  );
}

export function FileField({
  label,
  hint,
  error,
  className,
  ...rest
}: FieldShell & Omit<ComponentProps<"input">, "type">) {
  return (
    <Shell {...{ label, hint, error, className }}>
      <input
        {...rest}
        type="file"
        aria-invalid={error ? true : undefined}
        className={cn(
          control,
          "cursor-pointer py-1.5 text-sm text-muted file:mr-3 file:h-7 file:cursor-pointer file:rounded-md file:border file:border-[var(--line-strong)] file:bg-[var(--surface-2)] file:px-3 file:font-sans file:text-[0.8125rem] file:font-medium file:text-ink hover:file:bg-bone-2",
        )}
      />
    </Shell>
  );
}

/** Checkbox styled as a small switch. Unchecked sends nothing, which the zod checkbox preprocessor reads as false. */
export function Toggle({ label, hint, className, ...rest }: { label: string; hint?: string; className?: string } & Omit<ComponentProps<"input">, "type">) {
  return (
    <label className={cn("flex cursor-pointer items-start gap-3", className)}>
      <input type="checkbox" className="peer sr-only" {...rest} />
      <span
        aria-hidden
        className={cn(
          "relative mt-0.5 h-5 w-9 shrink-0 rounded-full border border-[var(--line-strong)] bg-ink/10 transition-colors",
          "after:absolute after:left-[3px] after:top-[3px] after:h-3 after:w-3 after:rounded-full after:bg-[var(--surface)] after:shadow-sm after:transition-transform",
          "peer-checked:border-oxblood peer-checked:bg-oxblood peer-checked:after:translate-x-4",
          "peer-focus-visible:outline peer-focus-visible:outline-[1.5px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-oxblood-2",
        )}
      />
      <span className="text-[0.9375rem] font-medium leading-snug">
        {label}
        {hint && <span className="mt-0.5 block text-[0.8125rem] font-normal text-muted">{hint}</span>}
      </span>
    </label>
  );
}

/** RO | RU columns on desktop, stacked on mobile. */
export function Bilingual({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("grid gap-5 md:grid-cols-2", className)}>{children}</div>;
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="a-card grid gap-5 p-5 sm:p-6">
      <h2 className="a-h3 border-b border-[var(--line)] pb-3">{title}</h2>
      {children}
    </section>
  );
}
