import "server-only";
import { execFile } from "node:child_process";
import { mkdir, readFile, rm, unlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import sharp from "sharp";

const run = promisify(execFile);

// Runtime data folder, not part of the build: tell Turbopack not to trace the whole project through it.
export const UPLOAD_ROOT = path.resolve(/* turbopackIgnore: true */ process.cwd(), process.env.UPLOAD_DIR ?? "uploads");
const FFMPEG = process.env.FFMPEG_PATH ?? "ffmpeg";

const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/heic", "image/heif"]);
const VIDEO_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime"]);
export const MAX_IMAGE_BYTES = 25 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 300 * 1024 * 1024;

export type StoredUpload = {
  src: string;
  kind: "photo" | "video";
  width: number | null;
  height: number | null;
  /** First-frame still for videos (null when ffmpeg is unavailable). */
  poster: string | null;
};

const isHeic = (file: File) => /image\/hei[cf]/.test(file.type) || /\.hei[cf]$/i.test(file.name);
const isImage = (file: File) => IMAGE_TYPES.has(file.type) || isHeic(file);
const isVideo = (file: File) => VIDEO_TYPES.has(file.type) || /\.(mp4|mov|webm|m4v)$/i.test(file.name);

/**
 * Images are re-encoded to WebP (max 2400px, EXIF stripped). Videos are transcoded to H.264 MP4 so iPhone
 * HEVC/.mov clips play in every browser, and get a WebP poster. Without ffmpeg, MP4/WebM are stored as-is.
 */
export async function storeUpload(file: File, folder: "works" | "posts" | "site" | "palette"): Promise<StoredUpload> {
  const month = new Date().toISOString().slice(0, 7);
  const dir = path.join(/* turbopackIgnore: true */ UPLOAD_ROOT, folder, month);
  await mkdir(dir, { recursive: true });
  const id = crypto.randomUUID().slice(0, 12);
  const url = (name: string) => `/uploads/${folder}/${month}/${name}`;

  if (isImage(file)) {
    if (file.size > MAX_IMAGE_BYTES) throw new UploadError("too_large");
    const input = isHeic(file) ? await heicToJpeg(file) : Buffer.from(await file.arrayBuffer());
    const { data, info } = await sharp(input)
      .rotate()
      .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer({ resolveWithObject: true })
      .catch(() => {
        throw new UploadError("unreadable");
      });
    const name = `${id}.webp`;
    await writeFile(path.join(/* turbopackIgnore: true */ dir, name), data);
    return { src: url(name), kind: "photo", width: info.width, height: info.height, poster: null };
  }

  if (isVideo(file)) {
    if (file.size > MAX_VIDEO_BYTES) throw new UploadError("too_large");
    const work = path.join(tmpdir(), `sw-${id}`);
    await mkdir(work, { recursive: true });
    try {
      const input = path.join(work, `in${path.extname(file.name) || ".mp4"}`);
      await writeFile(input, Buffer.from(await file.arrayBuffer()));
      const name = `${id}.mp4`;
      const out = path.join(/* turbopackIgnore: true */ dir, name);
      const transcoded = await transcode(input, out);
      if (!transcoded) {
        if (file.type === "video/quicktime" || /\.mov$/i.test(file.name)) throw new UploadError("needs_ffmpeg");
        await writeFile(out, await readFile(input));
        return { src: url(name), kind: "video", width: null, height: null, poster: null };
      }
      const still = path.join(work, "poster.png");
      await run(FFMPEG, ["-y", "-ss", "0.3", "-i", out, "-frames:v", "1", still], { timeout: 60_000 });
      const { data, info } = await sharp(still).webp({ quality: 80 }).toBuffer({ resolveWithObject: true });
      const posterName = `${id}-poster.webp`;
      await writeFile(path.join(/* turbopackIgnore: true */ dir, posterName), data);
      return { src: url(name), kind: "video", width: info.width, height: info.height, poster: url(posterName) };
    } finally {
      await rm(work, { recursive: true, force: true });
    }
  }

  throw new UploadError("unsupported_type");
}

/** Longest side capped at 1920, muted (the site always plays clips silently), web-optimised. */
async function transcode(input: string, output: string) {
  try {
    await run(
      FFMPEG,
      [
        "-y",
        "-i",
        input,
        "-an",
        "-vf",
        "scale='if(gte(iw,ih),min(1920,iw),-2)':'if(gte(iw,ih),-2,min(1920,ih))',format=yuv420p",
        "-c:v",
        "libx264",
        "-preset",
        "veryfast",
        "-crf",
        "24",
        "-movflags",
        "+faststart",
        output,
      ],
      { timeout: 15 * 60_000 },
    );
    return true;
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") return false;
    throw new UploadError("unreadable");
  }
}

/** sharp's prebuilt libheif can't decode HEVC iPhone photos; macOS `sips` (the host OS here) can. */
async function heicToJpeg(file: File) {
  const work = path.join(tmpdir(), `sw-heic-${crypto.randomUUID().slice(0, 8)}`);
  await mkdir(work, { recursive: true });
  try {
    const input = path.join(work, "in.heic");
    const output = path.join(work, "out.jpg");
    await writeFile(input, Buffer.from(await file.arrayBuffer()));
    await run("sips", ["-s", "format", "jpeg", input, "--out", output], { timeout: 60_000 }).catch(() => {
      throw new UploadError("unreadable");
    });
    return await readFile(output);
  } finally {
    await rm(work, { recursive: true, force: true });
  }
}

/** Removes a file previously returned by storeUpload. Static `/media/…` seed files are never touched. */
export async function deleteUpload(src: string | null | undefined) {
  if (!src?.startsWith("/uploads/")) return;
  const file = path.resolve(/* turbopackIgnore: true */ UPLOAD_ROOT, src.slice("/uploads/".length));
  if (!file.startsWith(UPLOAD_ROOT + path.sep)) return;
  await unlink(file).catch(() => {});
}

export class UploadError extends Error {
  constructor(public code: "too_large" | "unsupported_type" | "unreadable" | "needs_ffmpeg") {
    super(code);
  }
}
