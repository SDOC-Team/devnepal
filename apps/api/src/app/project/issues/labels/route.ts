import { errorResponse, json, preflight } from "@/server/http";
import { listIssueLabels } from "@/server/projects/service";

export const runtime = "nodejs";
export const OPTIONS = preflight;

export async function GET(): Promise<Response> {
  try {
    return json({ labels: await listIssueLabels() });
  } catch (error) {
    return errorResponse(error);
  }
}
