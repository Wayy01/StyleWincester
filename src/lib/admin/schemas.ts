import { z } from "zod";
import { BOOKING_STATUSES, WORK_TAGS } from "@/db/schema";

const required = (max = 200) => z.string().trim().min(1, "Câmp obligatoriu").max(max, `Maximum ${max} de caractere`);
const optional = (max = 600) => z.string().trim().max(max, `Maximum ${max} de caractere`).default("");
const checkbox = z.preprocess((v) => v === "on" || v === "true", z.boolean());
const NUM_ERR = "Introdu un număr întreg";
const int = (min = 0, max = 1_000_000) =>
  z.preprocess(
    (v) => (v === "" || v == null ? undefined : Number(v)),
    z.number({ error: NUM_ERR }).int(NUM_ERR).min(min, `Minim ${min}`).max(max, `Maxim ${max}`),
  );
const optionalInt = z.preprocess(
  (v) => (v === "" || v == null ? null : Number(v)),
  z.number({ error: NUM_ERR }).int(NUM_ERR).min(0, "Minim 0").nullable(),
);

export const idSchema = z.coerce.number().int().positive();
export const optionalId = z.preprocess((v) => (v === "" || v == null ? undefined : v), idSchema.optional());

export const bookingStatusSchema = z.enum(BOOKING_STATUSES);
export const bookingNoteSchema = optional(2000);

export const categorySchema = z.object({
  id: optionalId,
  nameRo: required(120),
  nameRu: required(120),
  introRo: optional(),
  introRu: optional(),
  sort: int(0, 9999),
});

export const serviceSchema = z
  .object({
    id: optionalId,
    categoryId: idSchema,
    nameRo: required(160),
    nameRu: required(160),
    noteRo: optional(300),
    noteRu: optional(300),
    priceFrom: int(0, 1_000_000),
    priceTo: optionalInt,
    isFrom: checkbox,
    durationMin: int(5, 1440),
    featured: checkbox,
    visible: checkbox,
    sort: int(0, 9999),
  })
  .refine((d) => d.priceTo == null || d.priceTo >= d.priceFrom, {
    path: ["priceTo"],
    message: "Prețul maxim trebuie să fie ≥ prețul minim",
  });

export const workSchema = z.object({
  id: optionalId,
  titleRo: required(160),
  titleRu: required(160),
  captionRo: optional(400),
  captionRu: optional(400),
  tag: z.enum(WORK_TAGS),
  credit: optional(160),
  featured: checkbox,
  published: checkbox,
  sort: int(0, 9999),
});

export const postSchema = z.object({
  id: optionalId,
  slug: z
    .string()
    .trim()
    .min(1, "Câmp obligatoriu")
    .max(90)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Doar litere latine mici, cifre și cratime"),
  titleRo: required(200),
  titleRu: required(200),
  excerptRo: optional(500),
  excerptRu: optional(500),
  topicRo: optional(80),
  topicRu: optional(80),
  bodyRo: z.string().max(100_000),
  bodyRu: z.string().max(100_000),
  readingMin: int(1, 120),
  published: checkbox,
  removeCover: checkbox,
  removeVideo: checkbox,
});

export const testimonialSchema = z.object({
  id: optionalId,
  name: required(120),
  serviceRo: optional(160),
  serviceRu: optional(160),
  textRo: required(1200),
  textRu: required(1200),
  visible: checkbox,
  sort: int(0, 9999),
});

export const faqSchema = z.object({
  id: optionalId,
  questionRo: required(300),
  questionRu: required(300),
  answerRo: required(3000),
  answerRu: required(3000),
  visible: checkbox,
  sort: int(0, 9999),
});

const handle = optional(60).transform((v) => v.replace(/^@+/, ""));
const optionalUrl = optional(500).refine((v) => v === "" || /^https?:\/\//i.test(v), "Introdu un link complet (https://…)");

export const settingsSchema = z.object({
  phone: optional(40),
  email: optional(160).refine((v) => v === "" || z.email().safeParse(v).success, "Adresă de email invalidă"),
  instagram: handle,
  telegram: handle,
  addressRo: optional(300),
  addressRu: optional(300),
  mapUrl: optionalUrl,
  announcementRo: optional(200),
  announcementRu: optional(200),
  heroVideo: optional(300),
  heroPoster: optional(300),
});

export const hourRowSchema = z.object({ daysRo: optional(80), daysRu: optional(80), time: optional(40) });

export const passwordSchema = z
  .object({
    current: z.string().min(1, "Introdu parola curentă"),
    next: z.string().min(10, "Minim 10 caractere").max(200),
    confirm: z.string(),
  })
  .refine((d) => d.next === d.confirm, { path: ["confirm"], message: "Parolele nu coincid" });

export const loginSchema = z.object({
  email: z.string().trim().min(1).max(200),
  password: z.string().min(1).max(200),
});

export const collabSchema = z.object({
  id: optionalId,
  name: required(160),
  roleRo: optional(160),
  roleRu: optional(160),
  url: optionalUrl,
  visible: checkbox,
  sort: int(0, 9999),
});

export const paletteSchema = z.object({
  id: optionalId,
  nameRo: required(80),
  nameRu: required(80),
  noteRo: optional(160),
  noteRu: optional(160),
  color: z.string().trim().regex(/^#[0-9a-f]{6}$/i, "Culoare în formatul #RRGGBB"),
  /** "src|width|height" of a portfolio image chosen instead of uploading one. */
  library: optional(600),
  visible: checkbox,
  sort: int(0, 9999),
});

export const notifySchema = z.object({
  // Empty keeps the saved token; the saved value is never sent back to the browser.
  telegramToken: z.string().trim().max(200).default(""),
  telegramChatId: z
    .string()
    .trim()
    .max(40)
    .refine((v) => v === "" || /^-?\d+$/.test(v), "Chat ID-ul este un număr (poate începe cu -)")
    .default(""),
  enabled: checkbox,
});

const adminEmail = z.string().trim().toLowerCase().max(200).pipe(z.email("Adresă de email invalidă"));
const adminName = required(120);

export const adminCreateSchema = z
  .object({
    name: adminName,
    email: adminEmail,
    password: z.string().min(10, "Minim 10 caractere").max(200),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, { path: ["confirm"], message: "Parolele nu coincid" });

export const profileSchema = z.object({ name: adminName, email: adminEmail });
