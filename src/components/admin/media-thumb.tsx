import Image from "next/image";
import { cn } from "@/lib/utils";

/** Shows a stored photo or video at whatever size its parent gives it (parent must set the aspect ratio). */
export function MediaThumb({
  kind,
  src,
  poster,
  alt,
  className,
}: {
  kind: "photo" | "video";
  src: string;
  poster?: string | null;
  alt: string;
  className?: string;
}) {
  // A poster is a cheap still; only fall back to loading the video when there isn't one.
  if (kind === "photo" || poster) {
    return <Image src={kind === "photo" ? src : poster!} alt={alt} fill unoptimized sizes="(min-width:1024px) 22vw, 50vw" className={cn("object-cover", className)} />;
  }
  return (
    <video
      src={`${src}#t=0.1`}
      muted
      playsInline
      preload="metadata"
      aria-label={alt}
      className={cn("absolute inset-0 h-full w-full object-cover", className)}
    />
  );
}
