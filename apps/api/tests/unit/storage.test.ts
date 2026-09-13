import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { sniffImage } from "@/server/avatars";
import { isAvatarKey, LocalFileStorage } from "@/server/storage";

const PNG_BYTES = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);
const UUID = "123e4567-e89b-42d3-a456-426614174000";

describe("isAvatarKey", () => {
  it("accepts generated keys", () => {
    expect(isAvatarKey(`avatars/${UUID}.png`)).toBe(true);
    expect(isAvatarKey(`avatars/${UUID}.jpg`)).toBe(true);
    expect(isAvatarKey(`avatars/${UUID}.webp`)).toBe(true);
  });

  it("rejects traversal, arbitrary paths, and unexpected extensions", () => {
    expect(isAvatarKey("avatars/../../etc/passwd")).toBe(false);
    expect(isAvatarKey(`avatars/${UUID}.gif`)).toBe(false);
    expect(isAvatarKey(`${UUID}.png`)).toBe(false);
    expect(isAvatarKey("/etc/passwd")).toBe(false);
    expect(isAvatarKey("avatars/not-a-uuid.png")).toBe(false);
  });
});

describe("LocalFileStorage", () => {
  let directory: string;
  let storage: LocalFileStorage;

  beforeEach(async () => {
    directory = await mkdtemp(path.join(tmpdir(), "storage-test-"));
    storage = new LocalFileStorage(directory);
  });

  afterEach(async () => {
    await rm(directory, { recursive: true, force: true });
  });

  it("round-trips a file", async () => {
    const key = `avatars/${UUID}.png`;
    await storage.put(key, PNG_BYTES);
    const stored = await storage.get(key);
    expect(stored?.contentType).toBe("image/png");
    expect(stored?.data.equals(PNG_BYTES)).toBe(true);
  });

  it("returns null for missing files", async () => {
    expect(await storage.get(`avatars/${UUID}.png`)).toBeNull();
  });

  it("deletes files idempotently", async () => {
    const key = `avatars/${UUID}.png`;
    await storage.put(key, PNG_BYTES);
    await storage.delete(key);
    expect(await storage.get(key)).toBeNull();
    await storage.delete(key);
  });

  it("refuses invalid keys", async () => {
    await expect(storage.put("../../evil.png", PNG_BYTES)).rejects.toThrow();
    await expect(storage.get("../../etc/passwd")).rejects.toThrow();
  });
});

describe("sniffImage", () => {
  it("detects a PNG", () => {
    expect(sniffImage(PNG_BYTES)).toEqual({ ext: "png" });
  });

  it("detects a JPEG", () => {
    expect(sniffImage(Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00]))).toEqual({ ext: "jpg" });
  });

  it("detects a WEBP", () => {
    const webp = Buffer.concat([Buffer.from("RIFF"), Buffer.alloc(4), Buffer.from("WEBP")]);
    expect(sniffImage(webp)).toEqual({ ext: "webp" });
  });

  it("rejects non-images regardless of extension claims", () => {
    expect(sniffImage(Buffer.from("not an image at all"))).toBeNull();
    expect(sniffImage(Buffer.alloc(0))).toBeNull();
  });
});
