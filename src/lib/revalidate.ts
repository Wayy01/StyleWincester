import "server-only";
import { revalidatePath } from "next/cache";

/** Public pages are cached; call after any admin change that shows up on the site. */
export function revalidatePublicSite() {
  revalidatePath("/[locale]", "layout");
}
