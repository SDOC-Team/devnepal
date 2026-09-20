import { createApiClient } from "@gov-portal/api-client";

/**
 * Typed same-origin client for browser data hooks. Server Components and
 * Server Actions continue to call the service layer directly.
 */
export const apiClient = createApiClient({ baseUrl: "/v1" });
