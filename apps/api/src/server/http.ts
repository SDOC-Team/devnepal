import { ZodError, type z } from "zod";

import { getEnv } from "@/config";

import {
  AppError,
  ForbiddenError,
  RateLimitedError,
  ValidationError,
  type ValidationIssue,
} from "./errors";

function applyCors(headers: Headers): void {
  headers.set("access-control-allow-origin", getEnv().WEB_ORIGIN);
  headers.set("access-control-allow-credentials", "true");
  const vary = headers.get("vary");
  if (vary === null) {
    headers.set("vary", "Origin");
  } else if (!vary.toLowerCase().includes("origin")) {
    headers.set("vary", `${vary}, Origin`);
  }
}

function corsHeaders(): Headers {
  const headers = new Headers();
  applyCors(headers);
  return headers;
}

/**
 * Adds the API CORS policy to a response produced elsewhere (e.g. the Auth.js
 * handlers). Mutates in place so Set-Cookie headers and redirects survive.
 */
export function withCors(response: Response): Response {
  applyCors(response.headers);
  return response;
}

export function json(body: unknown, init: ResponseInit = {}): Response {
  const headers = corsHeaders();
  headers.set("content-type", "application/json; charset=utf-8");
  for (const [key, value] of new Headers(init.headers)) {
    headers.set(key, value);
  }
  return new Response(JSON.stringify(body), { ...init, headers });
}

export function empty(status: number): Response {
  return new Response(null, { status, headers: corsHeaders() });
}

export function binary(data: Uint8Array, contentType: string, init: ResponseInit = {}): Response {
  const headers = corsHeaders();
  headers.set("content-type", contentType);
  for (const [key, value] of new Headers(init.headers)) {
    headers.set(key, value);
  }
  return new Response(new Uint8Array(data), { ...init, headers });
}

export function preflight(): Response {
  const headers = corsHeaders();
  headers.set("access-control-allow-methods", "GET, PATCH, OPTIONS");
  headers.set("access-control-allow-headers", "Content-Type");
  headers.set("access-control-max-age", "600");
  return new Response(null, { status: 204, headers });
}

function zodIssues(error: ZodError): ValidationIssue[] {
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  }));
}

export function errorResponse(error: unknown): Response {
  if (error instanceof RateLimitedError) {
    return json(
      { error: { code: error.code, message: error.message } },
      { status: error.status, headers: { "retry-after": String(error.retryAfterSeconds) } },
    );
  }
  if (error instanceof AppError) {
    return json(
      {
        error: {
          code: error.code,
          message: error.message,
          ...(error.details ? { details: error.details } : {}),
        },
      },
      { status: error.status },
    );
  }
  if (error instanceof ZodError) {
    return json(
      {
        error: { code: "validation_error", message: "Invalid request", details: zodIssues(error) },
      },
      { status: 400 },
    );
  }
  console.error("Unhandled API error:", error);
  return json(
    { error: { code: "internal_error", message: "Internal server error" } },
    { status: 500 },
  );
}

export async function parseJsonBody<T>(request: Request, schema: z.ZodType<T>): Promise<T> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    throw new ValidationError("Request body must be valid JSON");
  }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    throw new ValidationError("Invalid request body", zodIssues(parsed.error));
  }
  return parsed.data;
}

function requestOrigin(request: Request): string | null {
  try {
    const forwardedHost = request.headers.get("x-forwarded-host");
    const forwardedProto = request.headers.get("x-forwarded-proto");
    if (forwardedHost !== null && forwardedProto !== null) {
      return `${forwardedProto}://${forwardedHost}`;
    }
    return new URL(request.url).origin;
  } catch {
    return null;
  }
}

/**
 * CSRF defense for cookie-authenticated mutations: a browser always sends the
 * Origin header on cross-site requests; if it is present and is neither the
 * app's own origin (same-origin UI, proxied or not) nor the configured external
 * web origin, reject. Non-browser clients (no Origin) pass through.
 */
export function assertSameOrigin(request: Request): void {
  const origin = request.headers.get("origin");
  if (origin === null) {
    return;
  }
  const allowed = new Set<string>([getEnv().WEB_ORIGIN]);
  const own = requestOrigin(request);
  if (own !== null) {
    allowed.add(own);
  }
  if (!allowed.has(origin)) {
    throw new ForbiddenError("Request origin is not allowed");
  }
}
