import Image from "next/image";
import type { Post } from "@/db/schema";
import type { Locale } from "@/i18n/routing";
import { pick } from "@/lib/i18n";
import { formatDate } from "@/lib/format";
import { TransitionLink } from "@/components/motion/transition";
import { cn } from "@/lib/utils";

type Props = { post: Post; locale: Locale; readLabel: string; size?: "lg" | "md"; className?: string };

export function PostCard({ post, locale, readLabel, size = "md", className }: Props) {
  const title = pick(post, "title", locale);
  return (
    <TransitionLink href={`/journal/${post.slug}`} label={title} className={cn("group block", className)}>
      <div className={cn("relative overflow-hidden bg-ink", size === "lg" ? "aspect-[4/5] sm:aspect-[16/11]" : "aspect-[4/5]")}>
        {post.cover && (
          <Image
            src={post.cover}
            alt=""
            fill
            sizes={size === "lg" ? "(min-width: 1024px) 55vw, 100vw" : "(min-width: 1024px) 28vw, 90vw"}
            className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
          />
        )}
        <span className="label absolute left-3 top-3 bg-bone px-2 py-1 text-ink">{pick(post, "topic", locale)}</span>
      </div>
      <div className="mt-5 flex items-center gap-3 text-muted">
        <span className="label">{post.publishedAt ? formatDate(post.publishedAt, locale) : ""}</span>
        <span className="h-px w-6 bg-current opacity-40" />
        <span className="label">{readLabel}</span>
      </div>
      <h3 className={cn("display-wide mt-3 transition-colors group-hover:text-oxblood", size === "lg" ? "text-[clamp(2rem,3.6vw,3.4rem)]" : "text-[1.85rem]")}>{title}</h3>
      <p className="mt-3 max-w-xl text-[0.98rem] leading-relaxed text-muted">{pick(post, "excerpt", locale)}</p>
    </TransitionLink>
  );
}
