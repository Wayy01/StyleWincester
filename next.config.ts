import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Public hostnames of the reverse proxy in front of the app (e.g. a Tailscale or Cloudflare URL), as
// "host" or "host:port", comma-separated. Server actions reject requests whose origin isn't listed here.
const PROXY_HOSTS = (process.env.PROXY_HOSTS ?? "")
  .split(",")
  .map((h) => h.trim())
  .filter(Boolean);

const nextConfig: NextConfig = {
  // Classic ISR: public pages are cached and refreshed with revalidatePath() when the admin edits content.
  cacheComponents: false,
  allowedDevOrigins: [...new Set(PROXY_HOSTS.map((h) => h.split(":")[0]))],
  experimental: {
    serverActions: {
      bodySizeLimit: "320mb",
      // The site is reached through an HTTPS proxy whose origin differs from the local host.
      allowedOrigins: PROXY_HOSTS,
    },
  },
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=31536000" },
        ],
      },
      // Seed media is fingerprint-free but never edited in place, so it can be cached hard.
      { source: "/media/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }] },
      { source: "/admin/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75, 85],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default withNextIntl(nextConfig);
