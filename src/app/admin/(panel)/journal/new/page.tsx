import type { Metadata } from "next";
import { PageHeader } from "@/components/admin/ui";
import { PostEditor } from "@/components/admin/post-editor";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Articol nou" };

export default async function NewPostPage() {
  await requireAdmin();
  return (
    <div className="grid gap-10">
      <PageHeader eyebrow="Jurnal" title="Articol nou" />
      <PostEditor />
    </div>
  );
}
