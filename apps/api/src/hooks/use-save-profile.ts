import type { Profile, ProfileUpdate } from "@gov-portal/api-client";
import { useState } from "react";

import { apiClient } from "@/lib/api-client";
import { ApiError } from "@/lib/api-error";

export type SaveProfileState =
  | { status: "idle" }
  | { status: "saving" }
  | { status: "error"; message: string; fieldErrors: Record<string, string> };

function fieldErrorsFrom(error: ApiError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.details ?? []) {
    errors[issue.path] = issue.message;
  }
  return errors;
}

/** PATCH /v1/profile, then revalidate the caller's SWR profile cache via `onSaved`. */
export function useSaveProfile(onSaved: (member: Profile) => void) {
  const [state, setState] = useState<SaveProfileState>({ status: "idle" });

  async function save(update: ProfileUpdate): Promise<boolean> {
    setState({ status: "saving" });
    try {
      const member = await apiClient.updateProfile(update);
      setState({ status: "idle" });
      onSaved(member);
      return true;
    } catch (error) {
      const apiError = error instanceof ApiError ? error : null;
      if (apiError === null) {
        console.error("Failed to save profile", error);
      }
      setState({
        status: "error",
        message: apiError?.message ?? "Unexpected error",
        fieldErrors: apiError === null ? {} : fieldErrorsFrom(apiError),
      });
      return false;
    }
  }

  return { save, state };
}
