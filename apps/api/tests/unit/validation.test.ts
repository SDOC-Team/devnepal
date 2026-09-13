import {
  bioSchema,
  displayNameSchema,
  linksSchema,
  profileUpdateSchema,
  skillsSchema,
} from "@gov-portal/shared";
import { describe, expect, it } from "vitest";

describe("displayNameSchema", () => {
  it("accepts a normal name and trims whitespace", () => {
    expect(displayNameSchema.parse("  Ashish Thapa  ")).toBe("Ashish Thapa");
  });

  it("rejects empty and oversized names", () => {
    expect(displayNameSchema.safeParse("").success).toBe(false);
    expect(displayNameSchema.safeParse("   ").success).toBe(false);
    expect(displayNameSchema.safeParse("a".repeat(81)).success).toBe(false);
  });

  it("rejects URLs", () => {
    expect(displayNameSchema.safeParse("visit https://example.com").success).toBe(false);
    expect(displayNameSchema.safeParse("http://example.com").success).toBe(false);
    expect(displayNameSchema.safeParse("www.example.com").success).toBe(false);
  });

  it("rejects control characters, including newlines", () => {
    expect(displayNameSchema.safeParse("bad\u0000name").success).toBe(false);
    expect(displayNameSchema.safeParse("line\nbreak").success).toBe(false);
    expect(displayNameSchema.safeParse("tab\there").success).toBe(false);
  });
});

describe("bioSchema", () => {
  it("allows plain multiline text", () => {
    expect(bioSchema.parse("line one\nline two")).toBe("line one\nline two");
  });

  it("rejects control characters and oversized bios", () => {
    expect(bioSchema.safeParse("nul\u0000byte").success).toBe(false);
    expect(bioSchema.safeParse("x".repeat(401)).success).toBe(false);
  });
});

describe("linksSchema", () => {
  it("accepts HTTPS links", () => {
    expect(linksSchema.safeParse(["https://example.com/a"]).success).toBe(true);
  });

  it("rejects non-HTTPS and invalid URLs", () => {
    expect(linksSchema.safeParse(["http://example.com"]).success).toBe(false);
    expect(linksSchema.safeParse(["javascript:alert(1)"]).success).toBe(false);
    expect(linksSchema.safeParse(["not a url"]).success).toBe(false);
  });

  it("rejects more than five links", () => {
    const six = Array.from({ length: 6 }, (_, index) => `https://example.com/${index}`);
    expect(linksSchema.safeParse(six).success).toBe(false);
  });

  it("rejects duplicate links", () => {
    expect(linksSchema.safeParse(["https://example.com", "https://example.com"]).success).toBe(
      false,
    );
  });
});

describe("skillsSchema", () => {
  it("accepts taxonomy slugs", () => {
    expect(skillsSchema.safeParse(["engineering", "ui-ux"]).success).toBe(true);
  });

  it("rejects unknown skills and duplicates", () => {
    expect(skillsSchema.safeParse(["magic"]).success).toBe(false);
    expect(skillsSchema.safeParse(["engineering", "engineering"]).success).toBe(false);
  });
});

describe("profileUpdateSchema", () => {
  it("accepts a partial valid update and explicit nulls", () => {
    expect(profileUpdateSchema.parse({ displayName: "Alice" }).displayName).toBe("Alice");
    expect(profileUpdateSchema.safeParse({ headline: null }).success).toBe(true);
    expect(profileUpdateSchema.safeParse({}).success).toBe(true);
  });

  it.each([
    "id",
    "githubId",
    "githubUsername",
    "status",
    "priority",
    "avatarPath",
    "approvedAt",
    "approvedBy",
    "createdAt",
    "updatedAt",
  ])("rejects the unknown key %s", (key) => {
    const result = profileUpdateSchema.safeParse({ displayName: "Alice", [key]: "value" });
    expect(result.success).toBe(false);
  });
});
