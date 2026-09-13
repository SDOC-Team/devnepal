import { describe, expect, it } from "vitest";

import { ForbiddenError } from "@/server/errors";
import { assertSameOrigin } from "@/server/http";

function mutationRequest(
  url: string,
  options: { origin?: string; headers?: Record<string, string> } = {},
): Request {
  const headers = new Headers(options.headers ?? {});
  if (options.origin !== undefined) {
    headers.set("origin", options.origin);
  }
  return new Request(url, { method: "PATCH", headers });
}

describe("assertSameOrigin", () => {
  it("allows requests without an Origin header (non-browser clients)", () => {
    expect(() => assertSameOrigin(mutationRequest("http://localhost:3000/profile"))).not.toThrow();
  });

  it("allows same-origin mutations from the app itself", () => {
    expect(() =>
      assertSameOrigin(
        mutationRequest("http://localhost:3000/admin/members/abc", {
          origin: "http://localhost:3000",
        }),
      ),
    ).not.toThrow();
  });

  it("allows the configured external web origin", () => {
    expect(() =>
      assertSameOrigin(
        mutationRequest("http://localhost:3000/profile", { origin: "http://localhost:5173" }),
      ),
    ).not.toThrow();
  });

  it("resolves the app origin from proxy headers when deployed behind one", () => {
    expect(() =>
      assertSameOrigin(
        mutationRequest("http://127.0.0.1:3000/profile", {
          origin: "https://portal.example.gov.np",
          headers: {
            "x-forwarded-host": "portal.example.gov.np",
            "x-forwarded-proto": "https",
          },
        }),
      ),
    ).not.toThrow();
  });

  it("rejects foreign origins", () => {
    expect(() =>
      assertSameOrigin(
        mutationRequest("http://localhost:3000/profile", { origin: "http://evil.example" }),
      ),
    ).toThrow(ForbiddenError);
  });
});
