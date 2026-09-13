export type RedirectTargetInput = {
  url: string;
  baseUrl: string;
  webOrigin: string;
};

/**
 * Open-redirect-safe resolver for Auth.js post-authentication redirects.
 * Allows relative paths and absolute URLs on the API origin or the configured
 * frontend origin; everything else falls back to the API base URL.
 */
export function resolveRedirectTarget({ url, baseUrl, webOrigin }: RedirectTargetInput): string {
  if (url.startsWith("/") && !url.startsWith("//")) {
    try {
      return new URL(url, baseUrl).toString();
    } catch {
      return baseUrl;
    }
  }

  const allowedOrigins = new Set<string>();
  for (const candidate of [baseUrl, webOrigin]) {
    try {
      allowedOrigins.add(new URL(candidate).origin);
    } catch {
      // Ignore invalid configured origins; they simply allow nothing.
    }
  }

  try {
    const parsed = new URL(url);
    if (allowedOrigins.has(parsed.origin)) {
      return parsed.toString();
    }
  } catch {
    // Not an absolute URL; fall through to the safe default.
  }

  return baseUrl;
}
