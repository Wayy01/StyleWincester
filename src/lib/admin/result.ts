export type ActionState = {
  ok: boolean;
  message: string;
  fieldErrors?: Record<string, string[] | undefined>;
} | null;

export type UploadResult = { ok: true; src: string } | { ok: false; message: string };
