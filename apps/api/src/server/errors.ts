export type ValidationIssue = {
  path: string;
  message: string;
};

export class AppError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: ValidationIssue[],
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Authentication required") {
    super(401, "unauthorized", message);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Not allowed") {
    super(403, "forbidden", message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found") {
    super(404, "not_found", message);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Invalid request", details?: ValidationIssue[]) {
    super(400, "validation_error", message, details);
  }
}

export class RateLimitedError extends AppError {
  readonly retryAfterSeconds: number;

  constructor(retryAfterSeconds: number) {
    super(429, "rate_limited", "Too many requests");
    this.retryAfterSeconds = retryAfterSeconds;
  }
}
