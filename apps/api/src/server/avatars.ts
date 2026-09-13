import { randomUUID } from "node:crypto";

import { getFileStorage, isAvatarKey } from "./storage";

const MAX_AVATAR_BYTES = 2 * 1024 * 1024;
const AVATAR_SIZE = 400;

export type ImageKind = {
  ext: "png" | "jpg" | "webp";
};

export function sniffImage(bytes: Buffer): ImageKind | null {
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return { ext: "png" };
  }
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return { ext: "jpg" };
  }
  if (
    bytes.length >= 12 &&
    bytes.subarray(0, 4).toString("ascii") === "RIFF" &&
    bytes.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return { ext: "webp" };
  }
  return null;
}

export async function storeGithubAvatar(
  githubId: number,
  githubAvatarUrl: string,
): Promise<string | null> {
  try {
    const url = new URL(githubAvatarUrl);
    if (url.protocol !== "https:") {
      return null;
    }
    url.searchParams.set("size", String(AVATAR_SIZE));
    const response = await fetch(url, { headers: { "user-agent": "refined-devnepal" } });
    if (!response.ok) {
      return null;
    }
    const declaredLength = Number(response.headers.get("content-length") ?? "0");
    if (declaredLength > MAX_AVATAR_BYTES) {
      return null;
    }
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.byteLength === 0 || bytes.byteLength > MAX_AVATAR_BYTES) {
      return null;
    }
    const kind = sniffImage(bytes);
    if (kind === null) {
      return null;
    }
    const key = `avatars/${randomUUID()}.${kind.ext}`;
    await getFileStorage().put(key, bytes);
    return key;
  } catch (error) {
    console.warn(
      `Avatar download failed for GitHub user ${githubId}: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    return null;
  }
}

export async function deleteAvatarIfStored(key: string | null): Promise<void> {
  if (key === null || !isAvatarKey(key)) {
    return;
  }
  try {
    await getFileStorage().delete(key);
  } catch (error) {
    console.warn(
      `Avatar cleanup failed for key ${key}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
