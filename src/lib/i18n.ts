import type { Locale } from "@/i18n/routing";

type Bilingual<K extends string> = { [P in `${K}Ro` | `${K}Ru`]: string };

/** Reads the `…Ro` / `…Ru` column pair for the active locale, falling back to Romanian when RU is empty. */
export function pick<K extends string>(row: Bilingual<K>, key: K, locale: Locale): string {
  const ro = row[`${key}Ro` as keyof Bilingual<K>];
  if (locale === "ro") return ro;
  return row[`${key}Ru` as keyof Bilingual<K>] || ro;
}
