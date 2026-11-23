import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { PageHeader } from "@/components/admin/ui";
import { PostEditor } from "@/components/admin/post-editor";
import { db } from "@/db";
import { posts } from "@/db/schema";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = { title: "Editează articolul" };

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const postId = Number(id);
  if (!Number.isInteger(postId)) notFound();

  const post = await db.query.posts.findFirst({ where: eq(posts.id, postId) });
  if (!post) notFound();

  return (
    <div className="grid gap-10">
      <PageHeader eyebrow="Jurnal" title="Editează articolul" />
      <PostEditor key={post.id} post={post} />
    </div>
  );
}
