import fs from "node:fs/promises";
import path from "node:path";
import type { Request } from "express";

/**
 * Single source of truth for where uploads live. Both the writer (storagePut)
 * and the static file server import this.
 *
 * It must NOT be derived from import.meta.dirname: the production build bundles
 * this file into dist/index.js, so import.meta.dirname resolves to dist/ rather
 * than the backend directory, and uploads land somewhere nobody serves from.
 *
 * Set UPLOADS_DIR to a directory outside the checkout in production, otherwise
 * employee documents sit inside the code tree where a deploy can wipe them.
 */
export const UPLOADS_DIR = process.env.UPLOADS_DIR
  ? path.resolve(process.env.UPLOADS_DIR)
  : path.resolve(process.cwd(), "uploads");

function normalizeKey(relKey: string): string {
  return relKey.replace(/^\/+/, "").replace(/\\/g, "/");
}

function toBuffer(data: Buffer | Uint8Array | string): Buffer {
  if (typeof data === "string") {
    return Buffer.from(data);
  }
  return Buffer.from(data);
}

async function ensureDirForFile(filePath: string) {
  const dir = path.dirname(filePath);
  await fs.mkdir(dir, { recursive: true });
}

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  _contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  const key = normalizeKey(relKey);
  const filePath = path.join(UPLOADS_DIR, key);
  await ensureDirForFile(filePath);
  await fs.writeFile(filePath, toBuffer(data));
  return { key, url: `/uploads/${key}` };
}

export async function storageGet(
  relKey: string
): Promise<{ key: string; url: string }> {
  const key = normalizeKey(relKey);
  return { key, url: `/uploads/${key}` };
}

export function storagePublicUrl(req: Request, url: string): string {
  if (/^https?:\/\//i.test(url)) return url;

  const configuredBaseUrl = process.env.PUBLIC_API_URL?.trim();
  const railwayDomain = process.env.RAILWAY_PUBLIC_DOMAIN?.trim();
  const forwardedHost = req.headers["x-forwarded-host"];
  const forwardedProto = req.headers["x-forwarded-proto"];

  const baseUrl =
    configuredBaseUrl ||
    (railwayDomain ? `https://${railwayDomain}` : undefined) ||
    `${Array.isArray(forwardedProto) ? forwardedProto[0] : forwardedProto || req.protocol}://${
      Array.isArray(forwardedHost) ? forwardedHost[0] : forwardedHost || req.headers.host
    }`;

  return `${baseUrl.replace(/\/+$/, "")}/${url.replace(/^\/+/, "")}`;
}
