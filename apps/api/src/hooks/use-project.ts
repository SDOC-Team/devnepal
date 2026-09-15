import type { ProjectDto } from "@gov-portal/shared";
import useSWR from "swr";

import { ApiError } from "@/lib/api-error";

/**
 * The single active project overview. Resolves to `project: null` (not an
 * error state) when no project has been synced yet — mirrors what the old
 * server-rendered page treated as an empty state, not a failure.
 */
export function useProject() {
  const { data, error, isLoading } = useSWR<{ project: ProjectDto }, ApiError>("/project", {
    shouldRetryOnError: (err) => err.status !== 404,
  });
  const notFound = error instanceof ApiError && error.status === 404;
  return {
    project: data?.project ?? null,
    isLoading,
    error: notFound ? undefined : (error as Error | undefined),
  };
}
