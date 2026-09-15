/**
 * Client-side mirror of server/errors.ts's AppError shape. The API always
 * responds with `{ error: { code, message, details? } }` on failure — this
 * wraps that into a real Error so SWR's error state carries the HTTP status.
 */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: { path: string; message: string }[],
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export function isUnauthorized(error: unknown): boolean {
  return error instanceof ApiError && error.status === 401;
}

export function isForbidden(error: unknown): boolean {
  return error instanceof ApiError && error.status === 403;
}
