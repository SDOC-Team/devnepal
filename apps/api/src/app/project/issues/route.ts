import { issueListParamsSchema } from "@gov-portal/shared";

import { ValidationError } from "@/server/errors";
import { errorResponse, json, preflight } from "@/server/http";
import { listProjectIssues } from "@/server/projects/service";

export const runtime = "nodejs";
export const OPTIONS = preflight;

export async function GET(request: Request): Promise<Response> {
  try {
    const raw = Object.fromEntries(new URL(request.url).searchParams.entries());
    const parsed = issueListParamsSchema.safeParse(raw);
    if (!parsed.success) {
      throw new ValidationError(
        "Invalid query parameters",
        parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        })),
      );
    }
    return json(await listProjectIssues(parsed.data));
  } catch (error) {
    return errorResponse(error);
  }
}
