"use client";

import { Trash } from "@phosphor-icons/react/dist/ssr";
import { deleteService, deleteCategory } from "@/lib/admin/services";
import { deleteCollab } from "@/lib/admin/collabs";
import { deletePalette } from "@/lib/admin/palette";
import { deleteAdmin } from "@/lib/admin/users";
import { deleteWork } from "@/lib/admin/works";
import { deletePost } from "@/lib/admin/posts";
import { deleteFaq, deleteTestimonial } from "@/lib/admin/testimonials";
import { ConfirmDelete } from "./modal";
import { Button } from "./ui";

const KINDS = {
  category: { action: deleteCategory, title: "Ștergi categoria?", extra: "Toate serviciile din ea vor fi șterse odată cu ea." },
  service: { action: deleteService, title: "Ștergi serviciul?", extra: "Dispare de pe site imediat." },
  work: { action: deleteWork, title: "Ștergi lucrarea?", extra: "Dispare din portofoliu imediat." },
  post: { action: deletePost, title: "Ștergi articolul?", extra: "Linkul lui nu va mai funcționa." },
  testimonial: { action: deleteTestimonial, title: "Ștergi recenzia?", extra: "Dispare de pe site imediat." },
  palette: { action: deletePalette, title: "Ștergi culoarea?", extra: "Dispare din paleta de pe prima pagină." },
  collab: { action: deleteCollab, title: "Ștergi colaborarea?", extra: "Dispare de pe site imediat." },
  admin: { action: deleteAdmin, title: "Ștergi administratorul?", extra: "Nu se va mai putea autentifica." },
  faq: { action: deleteFaq, title: "Ștergi întrebarea?", extra: "Dispare de pe site imediat." },
} as const;

export function DeleteButton({
  kind,
  id,
  name,
  onDeleted,
  iconOnly = true,
}: {
  kind: keyof typeof KINDS;
  id: number;
  name: string;
  onDeleted?: () => void;
  iconOnly?: boolean;
}) {
  const k = KINDS[kind];
  return (
    <ConfirmDelete
      id={id}
      action={k.action}
      title={k.title}
      description={`„${name}” va fi șters definitiv. ${k.extra}`}
      onDeleted={onDeleted}
      trigger={(open) => (
        <Button size="sm" variant="danger" onClick={open} aria-label={`Șterge ${name}`}>
          <Trash size={16} aria-hidden />
          {!iconOnly && "Șterge"}
        </Button>
      )}
    />
  );
}
