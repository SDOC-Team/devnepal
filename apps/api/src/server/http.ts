import { ZodError, type z } from "zod";

import { getEnv } from "@/config";

import { AppError, ForbiddenError, ValidationError, type ValidationIssue } from "./errors";

function corsHeaders(): Headers {
  const headers = new Headers();
  headers.set("access-control-allow-origin", getEnv().WEB_ORIGIN);
  headers.set("access-control-allow-credentials", "true");
  headers.set("vary", "Origin");
  return headers;
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

/**
 * CSRF defense for cookie-authenticated mutations: a browser always sends the
 * Origin header on cross-site requests; if it is present and not the configured
 * web origin, reject. Non-browser clients (no Origin) pass through.
 */
export function assertSameOrigin(request: Request): void {
  const origin = request.headers.get("origin");
  if (origin !== null && origin !== getEnv().WEB_ORIGIN) {
    throw new ForbiddenError("Request origin is not allowed");
  }
}
