"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { InkSplat } from "@/components/ink/splat";

export default function LocaleError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const t = useTranslations("error");
  useEffect(() => console.error(error), [error]);
  return (
    <section className="paper relative grid min-h-svh place-items-center overflow-hidden px-gutter py-32 text-center">
      <InkSplat className="absolute left-1/2 top-1/2 size-[70vmin] -translate-x-1/2 -translate-y-1/2 text-oxblood/15" seed={500} />
      <div className="relative">
        <h1 className="display text-[clamp(4rem,12vw,10rem)] italic">{t("title")}</h1>
        <p className="mx-auto mt-6 max-w-sm text-muted">{t("body")}</p>
        <div className="mt-10 flex items-center justify-center gap-6">
          <button type="button" onClick={reset} className="label bg-ink px-5 py-3 text-bone hover:bg-oxblood">
            {t("retry")}
          </button>
          <Link href="/" className="label border-b border-ink pb-1">
            {t("home")}
          </Link>
        </div>
      </div>
    </section>
  );
}
