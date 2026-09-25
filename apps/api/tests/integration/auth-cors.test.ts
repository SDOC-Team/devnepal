import { describe, expect, it, vi } from "vitest";

vi.mock("@/auth", () => ({
  handlers: {
    GET: vi.fn(
      async () =>
        new Response(JSON.stringify({ csrfToken: "test" }), {
          status: 200,
          headers: { "set-cookie": "authjs.csrf-token=abc; Path=/; HttpOnly" },
        }),
    ),
  },
}));

import { GET } from "@/app/api/auth/[...nextauth]/route";
import { withCors } from "@/server/http";

describe("Auth.js route wrapper", () => {
  it("adds CORS headers and preserves Auth.js Set-Cookie headers", async () => {
    const request = new Request("http://localhost:3000/api/auth/csrf");
    const response = await GET(request as Parameters<typeof GET>[0]);

    expect(response.status).toBe(200);
    expect(response.headers.get("access-control-allow-origin")).toBe("http://localhost:5173");
    expect(response.headers.get("access-control-allow-credentials")).toBe("true");
    expect(response.headers.get("set-cookie")).toContain("authjs.csrf-token=abc");
  });
});

describe("withCors", () => {
  it("appends Origin to an existing Vary header without duplicating it", () => {
    const response = new Response(null, { headers: { vary: "rsc, next-router-state-tree" } });
    withCors(response);
    expect(response.headers.get("vary")).toBe("rsc, next-router-state-tree, Origin");

    withCors(response);
    const vary = response.headers.get("vary") ?? "";
    expect(vary.toLowerCase().split("origin").length - 1).toBe(1);
  });
});
