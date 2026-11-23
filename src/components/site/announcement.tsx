import { Marquee } from "@/components/motion/marquee";

/** Top ribbon, only rendered when the admin has written an announcement. */
export function Announcement({ text }: { text: string }) {
  if (!text) return null;
  return (
    <div className="relative z-40 bg-oxblood text-bone">
      <Marquee speed={36} className="py-2">
        {Array.from({ length: 4 }, (_, i) => (
          <span key={i} className="label flex items-center gap-6 pr-6">
            {text} <span aria-hidden>✶</span>
          </span>
        ))}
      </Marquee>
    </div>
  );
}
