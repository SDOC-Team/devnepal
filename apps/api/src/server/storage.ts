import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";

import { getEnv } from "@/config";

const AVATAR_KEY_PATTERN =
  /^avatars\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(png|jpg|webp)$/;

export function isAvatarKey(key: string): boolean {
  return AVATAR_KEY_PATTERN.test(key);
}

export function contentTypeForAvatarKey(key: string): string {
  if (key.endsWith(".png")) {
    return "image/png";
  }
  if (key.endsWith(".jpg")) {
    return "image/jpeg";
  }
  if (key.endsWith(".webp")) {
    return "image/webp";
  }
  throw new Error(`Not an avatar key: ${key}`);
}

export type StoredFile = {
  data: Buffer;
  contentType: string;
};

export interface FileStorage {
  put(key: string, data: Buffer): Promise<void>;
  get(key: string): Promise<StoredFile | null>;
  delete(key: string): Promise<void>;
}

export class LocalFileStorage implements FileStorage {
  private readonly baseDir: string;

  constructor(baseDir: string) {
    this.baseDir = path.resolve(baseDir);
  }

  private resolveKey(key: string): string {
    if (!isAvatarKey(key)) {
      throw new Error(`Invalid storage key: ${key}`);
    }
    const target = path.resolve(this.baseDir, key);
    if (!target.startsWith(this.baseDir + path.sep)) {
      throw new Error(`Storage key escapes the storage directory: ${key}`);
    }
    return target;
  }

  async put(key: string, data: Buffer): Promise<void> {
    const target = this.resolveKey(key);
    await mkdir(path.dirname(target), { recursive: true });
    const temp = `${target}.tmp-${process.pid}-${Date.now()}`;
    await writeFile(temp, data);
    await rename(temp, target);
  }

  async get(key: string): Promise<StoredFile | null> {
    const target = this.resolveKey(key);
    try {
      const data = await readFile(target);
      return { data, contentType: contentTypeForAvatarKey(key) };
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code === "ENOENT") {
        return null;
      }
      throw error;
    }
  }

  async delete(key: string): Promise<void> {
    const target = this.resolveKey(key);
    await rm(target, { force: true });
  }
}

let cachedStorage: FileStorage | null = null;

export function getFileStorage(): FileStorage {
  if (cachedStorage === null) {
    cachedStorage = new LocalFileStorage(getEnv().STORAGE_DIR);
  }
  return cachedStorage;
}
