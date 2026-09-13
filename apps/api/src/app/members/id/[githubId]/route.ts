import { getActor } from "@/server/actor";
import { NotFoundError } from "@/server/errors";
import { errorResponse, json, preflight } from "@/server/http";
import { toPublicMemberDto } from "@/server/members/dto";
import { getVisibleMemberByGithubId } from "@/server/members/service";

export const runtime = "nodejs";
export const OPTIONS = preflight;

export async function GET(
  _request: Request,
  context: { params: Promise<{ githubId: string }> },
): Promise<Response> {
  try {
    const { githubId } = await context.params;
    if (!/^\d+$/.test(githubId)) {
      throw new NotFoundError("Member not found");
    }
    const parsed = Number(githubId);
    if (!Number.isSafeInteger(parsed) || parsed <= 0) {
      throw new NotFoundError("Member not found");
    }
    const viewer = await getActor();
    const member = await getVisibleMemberByGithubId(parsed, viewer);
    return json({ member: toPublicMemberDto(member) });
  } catch (error) {
    return errorResponse(error);
  }
}
