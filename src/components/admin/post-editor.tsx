"use client";

import { useMemo, useRef, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, ImageSquare, PencilSimpleLine } from "@phosphor-icons/react/dist/ssr";
import { marked } from "marked";
import { toast } from "sonner";
import type { Post } from "@/db/schema";
import { IMAGE_ACCEPT, VIDEO_ACCEPT, VIDEO_HINT } from "@/lib/admin/constants";
import { estimateReadingMin, slugify } from "@/lib/admin/format";
import { savePost, uploadPostImage } from "@/lib/admin/posts";
import { cn } from "@/lib/utils";
import { DeleteButton } from "./delete-button";
import { MediaThumb } from "./media-thumb";
import { Button, FileField, TextArea, TextField, Toggle } from "./ui";
import { useAdminAction } from "./use-admin-action";

type Lang = "ro" | "ru";

export function PostEditor({ post }: { post?: Post }) {
  const router = useRouter();
  const { onSubmit, pending, error } = useAdminAction(savePost);

  const bodyRefs = { ro: useRef<HTMLTextAreaElement>(null), ru: useRef<HTMLTextAreaElement>(null) };
  const imageInput = useRef<HTMLInputElement>(null);
  const [inserting, startInsert] = useTransition();

  const [lang, setLang] = useState<Lang>("ro");
  const [preview, setPreview] = useState(false);
  const [titleRo, setTitleRo] = useState(post?.titleRo ?? "");
  const [titleRu, setTitleRu] = useState(post?.titleRu ?? "");
  const [bodyRo, setBodyRo] = useState(post?.bodyRo ?? "");
  const [bodyRu, setBodyRu] = useState(post?.bodyRu ?? "");
  // An existing slug is a published URL: only a manual edit may change it. New posts follow the title.
  const [slugManual, setSlugManual] = useState<string | null>(post ? post.slug : null);
  const [readingManual, setReadingManual] = useState<string | null>(post ? String(post.readingMin) : null);

  const slug = slugManual ?? slugify(titleRo || titleRu);
  const reading = readingManual ?? String(estimateReadingMin(bodyRo || bodyRu));

  const body = lang === "ro" ? bodyRo : bodyRu;
  const html = useMemo(() => (preview ? (marked.parse(body, { async: false }) as string) : ""), [preview, body]);

  function insertImage(file: File) {
    const target = lang;
    const setBody = target === "ro" ? setBodyRo : setBodyRu;
    const fd = new FormData();
    fd.set("file", file);
    startInsert(async () => {
      const result = await uploadPostImage(fd);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      const el = bodyRefs[target].current;
      const text = el?.value ?? "";
      const start = el?.selectionStart ?? text.length;
      const end = el?.selectionEnd ?? start;
      const before = text.slice(0, start);
      const lead = before && !before.endsWith("\n\n") ? (before.endsWith("\n") ? "\n" : "\n\n") : "";
      const md = `${lead}![](${result.src})\n\n`;
      setBody(before + md + text.slice(end));
      const caret = before.length + md.length;
      requestAnimationFrame(() => {
        el?.focus();
        el?.setSelectionRange(caret, caret);
      });
      toast.success("Imaginea a fost inserată.");
    });
  }

  const tabs: { key: Lang; label: string }[] = [
    { key: "ro", label: "Română" },
    { key: "ru", label: "Русский" },
  ];

  return (
    <form onSubmit={onSubmit} className="grid gap-8">
      {post && <input type="hidden" name="id" value={post.id} />}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/admin/journal" className="inline-flex items-center gap-2 text-sm text-muted hover:text-ink">
          <ArrowLeft size={16} aria-hidden />
          Înapoi la jurnal
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          {post && <DeleteButton kind="post" id={post.id} name={post.titleRo} iconOnly={false} onDeleted={() => router.push("/admin/journal")} />}
          <Button type="submit" variant="primary" pending={pending}>
            {pending ? "Se încarcă…" : post ? "Salvează" : "Creează articolul"}
          </Button>
        </div>
      </div>

      <div className="grid items-start gap-10 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="grid min-w-0 gap-6">
          <div role="tablist" aria-label="Limba conținutului" className="flex border-b border-[var(--line)]">
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                id={`tab-${t.key}`}
                aria-selected={lang === t.key}
                aria-controls={`panel-${t.key}`}
                onClick={() => setLang(t.key)}
                className={cn(
                  "-mb-px border-b-2 px-5 py-3 text-[0.95rem] transition-colors",
                  lang === t.key ? "border-oxblood font-medium text-oxblood" : "border-transparent text-muted hover:text-ink",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Both panels stay mounted (just hidden) so a single submit carries RO and RU. */}
          {(["ro", "ru"] as const).map((l) => {
            const R = l === "ro";
            return (
              <div key={l} role="tabpanel" id={`panel-${l}`} aria-labelledby={`tab-${l}`} hidden={lang !== l} className="grid gap-6">
                <TextField
                  label="Titlu"
                  tag={R ? "RO" : "RU"}
                  name={R ? "titleRo" : "titleRu"}
                  value={R ? titleRo : titleRu}
                  onChange={(e) => (R ? setTitleRo : setTitleRu)(e.target.value)}
                  error={error(R ? "titleRo" : "titleRu")}
                  lang={l}
                  required
                />
                <div className="grid gap-6 sm:grid-cols-[1fr_14rem]">
                  <TextArea
                    label="Rezumat"
                    tag={R ? "RO" : "RU"}
                    name={R ? "excerptRo" : "excerptRu"}
                    defaultValue={R ? post?.excerptRo : post?.excerptRu}
                    error={error(R ? "excerptRo" : "excerptRu")}
                    lang={l}
                    rows={3}
                  />
                  <TextField
                    label="Subiect"
                    tag={R ? "RO" : "RU"}
                    name={R ? "topicRo" : "topicRu"}
                    defaultValue={R ? post?.topicRo : post?.topicRu}
                    error={error(R ? "topicRo" : "topicRu")}
                    lang={l}
                    placeholder="Îngrijire"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="a-field mb-0">Markdown</span>
                    <div className="flex flex-wrap justify-end gap-2">
                      <Button size="sm" onClick={() => imageInput.current?.click()} pending={inserting} disabled={lang !== l}>
                        {!inserting && <ImageSquare size={16} aria-hidden />}
                        {inserting ? "Se încarcă…" : "Inserează imagine"}
                      </Button>
                      <button
                        type="button"
                        onClick={() => setPreview((p) => !p)}
                        aria-pressed={preview}
                        className="inline-flex h-8 items-center gap-2 rounded-lg border border-[var(--line-strong)] bg-[var(--surface)] px-3 text-[0.8125rem] font-medium hover:bg-[var(--surface-2)]"
                      >
                        {preview ? <PencilSimpleLine size={16} aria-hidden /> : <Eye size={16} aria-hidden />}
                        {preview ? "Editează" : "Previzualizare"}
                      </button>
                    </div>
                  </div>
                  <TextArea
                    label="Conținut"
                    ref={bodyRefs[l]}
                    name={R ? "bodyRo" : "bodyRu"}
                    value={R ? bodyRo : bodyRu}
                    onChange={(e) => (R ? setBodyRo : setBodyRu)(e.target.value)}
                    lang={l}
                    rows={22}
                    spellCheck
                    className={cn(preview && "hidden")}
                    hint="## Titlu secțiune, **bold**, *italic*, > citat, - listă"
                  />
                  {preview && (
                    <div className="mt-2 min-h-64 overflow-x-auto rounded-lg border border-[var(--line)] bg-bone p-4 sm:p-10">
                      {body.trim() ? (
                        <div className="prose-ink max-w-prose" dangerouslySetInnerHTML={{ __html: html }} />
                      ) : (
                        <p className="text-muted">Nimic de previzualizat încă.</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <aside className="grid gap-6 border border-[var(--line)] p-5 xl:sticky xl:top-8">
          <Toggle
            label="Publicat"
            hint={post?.publishedAt ? "Data publicării rămâne cea inițială." : "Data se setează la prima publicare."}
            name="published"
            defaultChecked={post?.published ?? false}
          />
          <TextField
            label="Slug (adresa articolului)"
            name="slug"
            value={slug}
            onChange={(e) => setSlugManual(slugify(e.target.value))}
            error={error("slug")}
            hint="Generat din titlul în română. Trebuie să fie unic."
            required
          />
          <TextField
            label="Timp de citire (minute)"
            name="readingMin"
            type="number"
            inputMode="numeric"
            min={1}
            value={reading}
            onChange={(e) => setReadingManual(e.target.value)}
            error={error("readingMin")}
            hint="Estimat automat din text."
          />

          <div className="grid gap-3 border-t border-[var(--line)] pt-5">
            <p className="a-field">Copertă</p>
            {post?.cover && (
              <div className="relative aspect-[4/3] overflow-hidden bg-bone-3">
                <MediaThumb kind="photo" src={post.cover} alt="Coperta actuală" />
              </div>
            )}
            <FileField label={post?.cover ? "Înlocuiește coperta" : "Încarcă o copertă"} name="coverFile" accept={IMAGE_ACCEPT} error={error("coverFile")} />
            {post?.cover && <Toggle label="Elimină coperta" name="removeCover" />}
          </div>

          <div className="grid gap-3 border-t border-[var(--line)] pt-5">
            <p className="a-field">Video (opțional)</p>
            {post?.video && (
              <div className="relative aspect-video overflow-hidden bg-bone-3">
                <MediaThumb kind="video" src={post.video} alt="Video actual" />
              </div>
            )}
            <FileField
              label={post?.video ? "Înlocuiește video" : "Încarcă un video"}
              name="videoFile"
              accept={VIDEO_ACCEPT}
              hint={VIDEO_HINT}
              error={error("videoFile")}
            />
            {post?.video && <Toggle label="Elimină video" name="removeVideo" />}
          </div>
        </aside>
      </div>
      <input
        ref={imageInput}
        type="file"
        accept={IMAGE_ACCEPT}
        className="hidden"
        tabIndex={-1}
        aria-hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) insertImage(file);
        }}
      />
    </form>
  );
}
