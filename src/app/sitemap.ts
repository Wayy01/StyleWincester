import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/data";

export const revalidate = 3600;

const PAGES = ["", "/services", "/work", "/journal", "/about", "/book"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.SITE_URL ?? "http://localhost:3260";
  const posts = await getPosts();
  const paths = [...PAGES, ...posts.map((p) => `/journal/${p.slug}`)];
  // Romanian lives at the root, Russian under /ru.
  return paths.map((p) => ({
    url: `${base}${p || "/"}`,
    alternates: { languages: { ro: `${base}${p || "/"}`, ru: `${base}/ru${p}` } },
  }));
}
