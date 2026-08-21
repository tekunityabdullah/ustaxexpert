import "server-only";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

// Local filesystem storage under public/uploads — works because the app is
// deployed as a real Node server (`next build && next start`) with a
// persistent disk, not a serverless/edge target where the filesystem is
// ephemeral. If that ever changes, swap this module for an object-storage
// SDK; nothing outside it needs to know where files actually live.
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8MB

function extensionFor(mimeType: string, originalName: string): string {
  const fromName = path.extname(originalName);
  if (fromName) return fromName;
  const map: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/svg+xml": ".svg",
  };
  return map[mimeType] ?? "";
}

/** Saves an uploaded File to public/uploads and returns its site-relative URL (no basePath — next/image adds that automatically). */
export async function saveUploadedFile(file: File): Promise<{ url: string; filename: string }> {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }

  const ext = extensionFor(file.type, file.name);
  const filename = `${crypto.randomUUID()}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);

  return { url: `/uploads/${filename}`, filename };
}

export async function deleteUploadedFile(url: string): Promise<void> {
  if (!url.startsWith("/uploads/")) return; // never delete anything outside our own upload dir
  const filename = url.replace("/uploads/", "");
  try {
    await unlink(path.join(UPLOAD_DIR, filename));
  } catch {
    // Already gone — fine, the DB row is the source of truth for the admin UI.
  }
}
