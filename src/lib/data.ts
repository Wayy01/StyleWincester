import "server-only";
import { cache } from "react";
import { and, asc, desc, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { collabs, faqs, paletteSwatches, posts, serviceCategories, services, settings, testimonials, works, type SiteSettings } from "@/db/schema";

const FALLBACK_SETTINGS: SiteSettings = {
  phone: "",
  email: "",
  instagram: "style.winces.ter",
  telegram: "",
  addressRo: "Chișinău, Moldova",
  addressRu: "Кишинёв, Молдова",
  mapUrl: "",
  hours: [],
  announcementRo: "",
  announcementRu: "",
  heroVideo: "/media/video/hero.mp4",
  heroPoster: "/media/poster/hero.webp",
};

export const getSettings = cache(async (): Promise<SiteSettings> => {
  const row = await db.query.settings.findFirst({ where: eq(settings.key, "site") });
  return { ...FALLBACK_SETTINGS, ...row?.value };
});

export const getMenu = cache(async () => {
  return db.query.serviceCategories.findMany({
    orderBy: asc(serviceCategories.sort),
    with: {
      services: {
        where: eq(services.visible, true),
        orderBy: asc(services.sort),
      },
    },
  });
});

export type MenuCategory = Awaited<ReturnType<typeof getMenu>>[number];

export const getWorks = cache(async () => {
  return db.select().from(works).where(eq(works.published, true)).orderBy(asc(works.sort), desc(works.createdAt));
});

export const getPosts = cache(async () => {
  return db
    .select()
    .from(posts)
    .where(eq(posts.published, true))
    .orderBy(desc(posts.publishedAt));
});

export const getPost = cache(async (slug: string) => {
  const post = await db.query.posts.findFirst({ where: and(eq(posts.slug, slug), eq(posts.published, true)) });
  if (!post) return null;
  const related = await db
    .select()
    .from(posts)
    .where(and(eq(posts.published, true), ne(posts.id, post.id)))
    .orderBy(desc(posts.publishedAt))
    .limit(2);
  return { post, related };
});

export const getFaqs = cache(async () => {
  return db.select().from(faqs).where(eq(faqs.visible, true)).orderBy(asc(faqs.sort));
});

export const getTestimonials = cache(async () => {
  return db.select().from(testimonials).where(eq(testimonials.visible, true)).orderBy(asc(testimonials.sort));
});

export const getCollabs = cache(async () => {
  return db.select().from(collabs).where(eq(collabs.visible, true)).orderBy(asc(collabs.sort));
});

export const getPalette = cache(async () => {
  return db.select().from(paletteSwatches).where(eq(paletteSwatches.visible, true)).orderBy(asc(paletteSwatches.sort), asc(paletteSwatches.id));
});
