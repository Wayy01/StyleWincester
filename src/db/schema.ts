import { relations } from "drizzle-orm";
import { boolean, integer, jsonb, pgSchema, serial, text, timestamp, uniqueIndex, index } from "drizzle-orm/pg-core";

// Everything lives in its own Postgres schema so the shared `app` database stays tidy.
export const sw = pgSchema("winchester");

export const admins = sw.table("admins", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const serviceCategories = sw.table("service_categories", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  nameRo: text("name_ro").notNull(),
  nameRu: text("name_ru").notNull(),
  introRo: text("intro_ro").notNull().default(""),
  introRu: text("intro_ru").notNull().default(""),
  sort: integer("sort").notNull().default(0),
});

export const services = sw.table(
  "services",
  {
    id: serial("id").primaryKey(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => serviceCategories.id, { onDelete: "cascade" }),
    nameRo: text("name_ro").notNull(),
    nameRu: text("name_ru").notNull(),
    noteRo: text("note_ro").notNull().default(""),
    noteRu: text("note_ru").notNull().default(""),
    /** MDL. `priceTo` set means a range ("1 200 – 1 800"); `priceFrom` alone with `isFrom` means "de la". */
    priceFrom: integer("price_from").notNull(),
    priceTo: integer("price_to"),
    isFrom: boolean("is_from").notNull().default(false),
    durationMin: integer("duration_min").notNull().default(60),
    featured: boolean("featured").notNull().default(false),
    visible: boolean("visible").notNull().default(true),
    sort: integer("sort").notNull().default(0),
  },
  (t) => [index("services_category_idx").on(t.categoryId, t.sort)],
);

export const WORK_TAGS = ["cut", "color", "styling", "men", "editorial"] as const;
export type WorkTag = (typeof WORK_TAGS)[number];

export const works = sw.table(
  "works",
  {
    id: serial("id").primaryKey(),
    titleRo: text("title_ro").notNull(),
    titleRu: text("title_ru").notNull(),
    captionRo: text("caption_ro").notNull().default(""),
    captionRu: text("caption_ru").notNull().default(""),
    tag: text("tag", { enum: WORK_TAGS }).notNull().default("cut"),
    kind: text("kind", { enum: ["photo", "video"] }).notNull().default("photo"),
    src: text("src").notNull(),
    poster: text("poster"),
    width: integer("width"),
    height: integer("height"),
    credit: text("credit").notNull().default(""),
    featured: boolean("featured").notNull().default(false),
    published: boolean("published").notNull().default(true),
    sort: integer("sort").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("works_sort_idx").on(t.published, t.sort)],
);

export const posts = sw.table(
  "posts",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    titleRo: text("title_ro").notNull(),
    titleRu: text("title_ru").notNull(),
    excerptRo: text("excerpt_ro").notNull().default(""),
    excerptRu: text("excerpt_ru").notNull().default(""),
    /** Markdown. */
    bodyRo: text("body_ro").notNull().default(""),
    bodyRu: text("body_ru").notNull().default(""),
    cover: text("cover"),
    video: text("video"),
    topicRo: text("topic_ro").notNull().default(""),
    topicRu: text("topic_ru").notNull().default(""),
    readingMin: integer("reading_min").notNull().default(3),
    published: boolean("published").notNull().default(false),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("posts_slug_idx").on(t.slug), index("posts_published_idx").on(t.published, t.publishedAt)],
);

export const testimonials = sw.table("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  serviceRo: text("service_ro").notNull().default(""),
  serviceRu: text("service_ru").notNull().default(""),
  textRo: text("text_ro").notNull(),
  textRu: text("text_ru").notNull(),
  visible: boolean("visible").notNull().default(true),
  sort: integer("sort").notNull().default(0),
});

export const faqs = sw.table("faqs", {
  id: serial("id").primaryKey(),
  questionRo: text("question_ro").notNull(),
  questionRu: text("question_ru").notNull(),
  answerRo: text("answer_ro").notNull(),
  answerRu: text("answer_ru").notNull(),
  visible: boolean("visible").notNull().default(true),
  sort: integer("sort").notNull().default(0),
});

/** People and publications credited on the About page and in the home marquee. */
export const collabs = sw.table("collabs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  roleRo: text("role_ro").notNull().default(""),
  roleRu: text("role_ru").notNull().default(""),
  url: text("url").notNull().default(""),
  visible: boolean("visible").notNull().default(true),
  sort: integer("sort").notNull().default(0),
});

/** Hair colours on the home page: a painted swatch and the portrait shown when it's chosen. */
export const paletteSwatches = sw.table("palette_swatches", {
  id: serial("id").primaryKey(),
  nameRo: text("name_ro").notNull(),
  nameRu: text("name_ru").notNull(),
  noteRo: text("note_ro").notNull().default(""),
  noteRu: text("note_ru").notNull().default(""),
  /** Hex, e.g. #3b2418. */
  color: text("color").notNull(),
  photo: text("photo").notNull(),
  photoWidth: integer("photo_width").notNull().default(4),
  photoHeight: integer("photo_height").notNull().default(5),
  visible: boolean("visible").notNull().default(true),
  sort: integer("sort").notNull().default(0),
});

/** Where new booking requests are announced. Single row (id = 1); never read by public pages. */
export const notifySettings = sw.table("notify_settings", {
  id: integer("id").primaryKey(),
  telegramToken: text("telegram_token").notNull().default(""),
  telegramChatId: text("telegram_chat_id").notNull().default(""),
  enabled: boolean("enabled").notNull().default(false),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const BOOKING_STATUSES = ["new", "confirmed", "done", "cancelled"] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const bookings = sw.table(
  "bookings",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    phone: text("phone").notNull(),
    instagram: text("instagram").notNull().default(""),
    serviceId: integer("service_id").references(() => services.id, { onDelete: "set null" }),
    /** Snapshot so the request still reads correctly if the service is renamed or deleted. */
    serviceLabel: text("service_label").notNull().default(""),
    preferredDate: text("preferred_date").notNull().default(""),
    preferredTime: text("preferred_time").notNull().default(""),
    hairLength: text("hair_length").notNull().default(""),
    message: text("message").notNull().default(""),
    locale: text("locale").notNull().default("ro"),
    status: text("status", { enum: BOOKING_STATUSES }).notNull().default("new"),
    adminNote: text("admin_note").notNull().default(""),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("bookings_status_idx").on(t.status, t.createdAt)],
);

export type Hours = { daysRo: string; daysRu: string; time: string }[];

export type SiteSettings = {
  phone: string;
  email: string;
  instagram: string;
  telegram: string;
  addressRo: string;
  addressRu: string;
  mapUrl: string;
  hours: Hours;
  announcementRo: string;
  announcementRu: string;
  heroVideo: string;
  heroPoster: string;
};

/** One row, keyed "site". Kept as JSON so new fields don't need a migration. */
export const settings = sw.table("settings", {
  key: text("key").primaryKey(),
  value: jsonb("value").$type<SiteSettings>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Service = typeof services.$inferSelect;
export type ServiceCategory = typeof serviceCategories.$inferSelect;
export type Work = typeof works.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type Faq = typeof faqs.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type Admin = typeof admins.$inferSelect;
export type Collab = typeof collabs.$inferSelect;
export type PaletteSwatch = typeof paletteSwatches.$inferSelect;
export type NotifySettings = typeof notifySettings.$inferSelect;

export const serviceCategoriesRelations = relations(serviceCategories, ({ many }) => ({
  services: many(services),
}));

export const servicesRelations = relations(services, ({ one }) => ({
  category: one(serviceCategories, { fields: [services.categoryId], references: [serviceCategories.id] }),
}));
