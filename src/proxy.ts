import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Skip the admin, API routes, uploaded media, Next internals and any path with a file extension.
  matcher: "/((?!admin|api|uploads|media|_next|_vercel|.*\\..*).*)",
};
