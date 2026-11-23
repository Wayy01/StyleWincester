const GREETING = {
  ro: (name: string) => `Bună, ${name}! Vă scriem de la Style Wincester despre programarea dvs.`,
  ru: (name: string) => `Здравствуйте, ${name}! Пишем вам из Style Wincester по поводу вашей записи.`,
};

/** Local Moldovan numbers (0XX XXX XXX) get the 373 country code; anything else is used as typed. */
export function whatsappUrl(phone: string, name: string, locale: string) {
  let digits = phone.replace(/\D/g, "").replace(/^00/, "");
  if (digits.startsWith("0") && digits.length === 9) digits = `373${digits.slice(1)}`;
  const text = (locale === "ru" ? GREETING.ru : GREETING.ro)(name);
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export const instagramDmUrl = (handle: string) => `https://ig.me/m/${encodeURIComponent(handle)}`;
