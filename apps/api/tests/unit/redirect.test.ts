import { describe, expect, it } from "vitest";

import { resolveRedirectTarget } from "@/server/redirect";

const baseUrl = "http://localhost:3000";
const webOrigin = "http://localhost:5173";

function resolve(url: string): string {
  return resolveRedirectTarget({ url, baseUrl, webOrigin });
}

describe("resolveRedirectTarget", () => {
  it("allows relative paths on the API origin", () => {
    expect(resolve("/profile")).toBe("http://localhost:3000/profile");
  });

  it("allows absolute URLs on the API origin", () => {
    expect(resolve("http://localhost:3000/members")).toBe("http://localhost:3000/members");
  });

  it("allows absolute URLs on the frontend origin", () => {
    expect(resolve("http://localhost:5173/profile")).toBe("http://localhost:5173/profile");
  });

  it("rejects third-party origins", () => {
    expect(resolve("http://evil.example/phish")).toBe(baseUrl);
    expect(resolve("https://evil.example")).toBe(baseUrl);
  });

  it("rejects protocol-relative URLs", () => {
    expect(resolve("//evil.example/phish")).toBe(baseUrl);
  });

  it("rejects non-HTTP schemes and malformed values", () => {
    expect(resolve("javascript:alert(1)")).toBe(baseUrl);
    expect(resolve("not a url")).toBe(baseUrl);
    expect(resolve("")).toBe(baseUrl);
  });
});
