export const NAV = [
  { href: "/services", key: "services" },
  { href: "/work", key: "work" },
  { href: "/journal", key: "journal" },
  { href: "/about", key: "about" },
] as const;

export function instagramUrl(handle: string) {
  return `https://instagram.com/${handle.replace(/^@/, "")}`;
}

/** Opens a DM thread with the studio directly in the Instagram app. */
export function dmUrl(handle: string) {
  return `https://ig.me/m/${handle.replace(/^@/, "")}`;
}

export function telegramUrl(handle: string) {
  return `https://t.me/${handle.replace(/^@/, "")}`;
}
