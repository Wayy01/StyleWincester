import type { BookingStatus } from "@/db/schema";
import { STATUS_LABEL } from "@/lib/admin/constants";
import { cn } from "@/lib/utils";

const tone: Record<BookingStatus, string> = {
  new: "border-oxblood bg-oxblood text-bone",
  confirmed: "border-[#d9bf8f] bg-[#f1e3c6] text-chocolate",
  done: "border-[#b9c7b2] bg-[#e4ecdf] text-[#2f4a2a]",
  cancelled: "border-[var(--line-strong)] bg-[var(--surface-2)] text-muted line-through",
};

export function StatusPill({ status }: { status: BookingStatus }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium leading-5", tone[status])}>
      {STATUS_LABEL[status]}
    </span>
  );
}
