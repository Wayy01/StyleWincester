const NBSP = " ";

function group(n: number) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, NBSP);
}

/** Mirrors how the public site prints a price: "de la 2 800 lei" / "1 200 – 1 800 lei". */
export function formatPrice(from: number, to: number | null, isFrom: boolean) {
  if (to != null && to > from) return `${group(from)} – ${group(to)}${NBSP}lei`;
  return `${isFrom ? `de${NBSP}la${NBSP}` : ""}${group(from)}${NBSP}lei`;
}

export function formatDateTime(value: Date) {
  return new Intl.DateTimeFormat("ro-RO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Chisinau",
  }).format(value);
}

const CYRILLIC: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i", й: "y", к: "k", л: "l",
  м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh",
  щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

export function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[а-яё]/g, (c) => CYRILLIC[c] ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

export function estimateReadingMin(body: string) {
  const words = body.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
