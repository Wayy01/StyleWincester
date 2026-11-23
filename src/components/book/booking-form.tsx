"use client";

import { useRef, useState, useTransition, type FormEvent, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, CircleNotch } from "@phosphor-icons/react";
import { requestBooking, type BookingState } from "@/lib/booking";
import { gsap, useGSAP } from "@/components/motion/gsap";
import { InkCircle } from "@/components/ink/strokes";
import { cn } from "@/lib/utils";

type Group = { label: string; options: { id: number; label: string; price: string }[] };

export function BookingForm({ groups, preselect, today }: { groups: Group[]; preselect?: number; today: string }) {
  const t = useTranslations("book");
  const ts = useTranslations("services");
  const locale = useLocale();
  const [state, setState] = useState<BookingState>({ status: "idle" });
  const [pending, start] = useTransition();
  const form = useRef<HTMLFormElement>(null);
  const done = useRef<HTMLDivElement>(null);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    start(async () => setState(await requestBooking(state, data)));
  };

  useGSAP(
    () => {
      if (state.status !== "ok") return;
      gsap.from(done.current, { autoAlpha: 0, y: 30, duration: 0.9 });
      gsap.fromTo("[data-check] [data-draw]", { drawSVG: "0%" }, { drawSVG: "100%", duration: 1.2, stagger: 0.25, ease: "power2.inOut" });
    },
    { dependencies: [state.status], scope: done },
  );

  if (state.status === "ok") {
    return (
      <div ref={done} className="flex min-h-[32rem] flex-col items-start justify-center gap-6 bg-ink p-8 text-bone sm:p-14">
        <svg data-check viewBox="0 0 120 120" fill="none" className="size-28 text-honey" aria-hidden>
          <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" filter="url(#ink-rough)">
            <path data-draw d="M100 34C90 16 70 8 52 12 28 17 12 40 16 64c4 26 30 44 56 38 22-5 36-26 34-48" />
            <path data-draw d="M38 60l16 16 34-38" />
          </g>
        </svg>
        <h2 className="display text-[clamp(3.6rem,8vw,6rem)] italic">{t("successTitle")}</h2>
        <p className="max-w-sm text-lg text-bone/75">{t("successBody", { name: state.name })}</p>
        <button
          type="button"
          onClick={() => {
            setState({ status: "idle" });
            form.current?.reset();
          }}
          className="label mt-4 border-b border-bone/40 pb-1 hover:border-bone"
        >
          {t("another")}
        </button>
      </div>
    );
  }

  const err = state.status === "error" ? state.fields : {};

  return (
    <form ref={form} onSubmit={submit} noValidate className="relative min-w-0 bg-bone-2/60 p-5 sm:p-10">
      <input type="hidden" name="locale" value={locale} />
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden>
        <label>
          Website <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <Step n={1} title={t("step1")}>
        <div className="grid gap-6 sm:grid-cols-2">
          <Field label={t("name")} error={err.name && t("errRequired")}>
            <input name="name" required autoComplete="name" placeholder={t("namePh")} className={inputCls(!!err.name)} />
          </Field>
          <Field label={t("phone")} error={err.phone && t(err.phone === "phone" ? "errPhone" : "errRequired")}>
            <input name="phone" type="tel" required autoComplete="tel" inputMode="tel" placeholder={t("phonePh")} className={inputCls(!!err.phone)} />
          </Field>
          <Field label={t("instagram")} className="sm:col-span-2">
            <input name="instagram" autoComplete="off" placeholder={t("instagramPh")} className={inputCls(false)} />
          </Field>
        </div>
      </Step>

      <Step n={2} title={t("step2")}>
        <Field label={t("service")}>
          <select name="serviceId" defaultValue={preselect ? String(preselect) : ""} className={cn(inputCls(false), "appearance-none bg-[length:12px] bg-[right_0.25rem_center] bg-no-repeat pr-8")} style={{ backgroundImage: SELECT_CHEVRON }}>
            <option value="">{t("servicePh")}</option>
            <option value="consult">{t("notSure")}</option>
            {groups.map((g) => (
              <optgroup key={g.label} label={g.label}>
                {g.options.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label} — {o.price}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </Field>
        <fieldset className="mt-7">
          <legend className="label mb-3 text-muted">{t("hairLength")}</legend>
          <Chips
            name="hairLength"
            options={[
              { value: "short", label: ts("lengthShort") },
              { value: "medium", label: ts("lengthMedium") },
              { value: "long", label: ts("lengthLong") },
              { value: "xlong", label: ts("lengthXLong") },
            ]}
          />
        </fieldset>
      </Step>

      <Step n={3} title={t("step3")}>
        <div className="grid gap-7 sm:grid-cols-[minmax(0,14rem)_1fr]">
          <Field label={t("date")}>
            <input name="preferredDate" type="date" min={today} className={inputCls(false)} />
          </Field>
          <fieldset>
            <legend className="label mb-3 text-muted">{t("time")}</legend>
            <Chips
              name="preferredTime"
              options={[
                { value: "morning", label: t("morning") },
                { value: "afternoon", label: t("afternoon") },
                { value: "evening", label: t("evening") },
                { value: "any", label: t("any") },
              ]}
            />
          </fieldset>
        </div>
        <Field label={t("message")} className="mt-7">
          <textarea name="message" rows={3} placeholder={t("messagePh")} className={cn(inputCls(false), "resize-none")} />
        </Field>
      </Step>

      {state.status === "error" && state.generic && <p className="mb-4 text-sm text-oxblood-2">{t("errGeneric")}</p>}

      <div className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-xs text-xs text-muted">{t("consent")}</p>
        <button
          type="submit"
          disabled={pending}
          className="group relative inline-flex items-center justify-center gap-3 bg-ink px-8 py-4 text-bone transition-colors hover:bg-oxblood disabled:opacity-70"
        >
          <span className="label text-[0.7rem]">{pending ? t("sending") : t("submit")}</span>
          {pending ? <CircleNotch className="size-4 animate-spin" /> : <ArrowRight weight="light" className="transition-transform duration-500 group-hover:translate-x-1" />}
        </button>
      </div>
    </form>
  );
}

const SELECT_CHEVRON = "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'><path d='M1 1.5l5 5 5-5' fill='none' stroke='%2315110e' stroke-width='1.2'/></svg>\")";

function inputCls(invalid: boolean) {
  return cn(
    "w-full border-0 border-b bg-transparent px-0 py-2.5 text-[1.05rem] outline-none transition-colors placeholder:text-muted-2 focus:border-oxblood",
    invalid ? "border-oxblood-2" : "border-[var(--line-strong)]",
  );
}

function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section className="mb-12 grid gap-6 sm:grid-cols-[4.5rem_1fr]">
      <div className="flex items-baseline gap-3 sm:block">
        <span className="display text-6xl leading-none text-ink/85">{String(n).padStart(2, "0")}</span>
        <span className="label text-muted sm:mt-2 sm:block">{title}</span>
      </div>
      <div>{children}</div>
    </section>
  );
}

function Field({ label, error, className, children }: { label: string; error?: string | false; className?: string; children: ReactNode }) {
  return (
    <label className={cn("block", className)}>
      <span className="label text-muted">{label}</span>
      {children}
      {error && <span className="mt-1.5 block text-xs text-oxblood-2">{error}</span>}
    </label>
  );
}

function Chips({ name, options }: { name: string; options: { value: string; label: string }[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <label key={o.value} className="group relative cursor-pointer">
          <input type="radio" name={name} value={o.value} className="peer sr-only" />
          <span className="relative z-10 block border border-[var(--line-strong)] px-4 py-2 text-sm transition-colors peer-checked:border-ink peer-checked:bg-ink peer-checked:text-bone peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-oxblood group-hover:border-ink">
            {o.label}
          </span>
          <InkCircle className="pointer-events-none absolute -inset-x-2 -inset-y-1.5 z-20 h-[calc(100%+0.75rem)] w-[calc(100%+1rem)] text-oxblood-2 opacity-0 transition-opacity duration-300 peer-checked:opacity-100" />
        </label>
      ))}
    </div>
  );
}
