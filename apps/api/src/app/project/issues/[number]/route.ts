import { NotFoundError } from "@/server/errors";
import { errorResponse, json, preflight } from "@/server/http";
import { getProjectIssue } from "@/server/projects/service";

export const runtime = "nodejs";
export const OPTIONS = preflight;

export async function GET(
  _request: Request,
  context: { params: Promise<{ number: string }> },
): Promise<Response> {
  try {
    const { number } = await context.params;
    if (!/^\d+$/.test(number)) {
      throw new NotFoundError("Issue not found");
    }
    return json({ issue: await getProjectIssue(Number(number)) });
  } catch (error) {
    return errorResponse(error);
  }
}
