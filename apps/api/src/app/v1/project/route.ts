import { errorResponse, json, preflight } from "@/server/http";
import { getProjectOverview } from "@/server/projects/service";

export const runtime = "nodejs";
export const OPTIONS = preflight;

export async function GET(): Promise<Response> {
  try {
    return json({ project: await getProjectOverview() });
  } catch (error) {
    return errorResponse(error);
  }
}
