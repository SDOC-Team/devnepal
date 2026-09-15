import { ApiError } from "./api-error";

/**
 * Fetch JSON from this app's own REST routes (session cookie carried via
 * credentials: "include") and throw ApiError on any non-2xx response, using
 * the server's `{ error: { code, message, details } }` envelope.
 *
 * Used as SWR's default fetcher — see components/providers/swr-provider.tsx.
 */
export async function apiFetch<T>(input: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(input, {
    credentials: "include",
    ...init,
    headers: { "content-type": "application/json", ...init.headers },
  });

  if (!response.ok) {
    let code = "unknown_error";
    let message = `Request failed (${response.status})`;
    let details: { path: string; message: string }[] | undefined;
    try {
      const payload = (await response.json()) as {
        error?: { code?: string; message?: string; details?: typeof details };
      };
      if (payload.error !== undefined) {
        code = payload.error.code ?? code;
        message = payload.error.message ?? message;
        details = payload.error.details;
      }
    } catch {
      // Response body wasn't JSON — fall back to the status-derived message.
    }
    throw new ApiError(response.status, code, message, details);
  }

  return (await response.json()) as T;
}

export async function apiMutate<T>(
  input: string,
  method: "POST" | "PATCH" | "DELETE",
  body?: unknown,
): Promise<T> {
  return apiFetch<T>(input, {
    method,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
}
