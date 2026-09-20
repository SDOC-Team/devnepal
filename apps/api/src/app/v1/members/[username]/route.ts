import { getActor } from "@/server/actor";
import { NotFoundError } from "@/server/errors";
import { errorResponse, json, preflight } from "@/server/http";
import { toPublicMemberDto } from "@/server/members/dto";
import { getVisibleMemberByUsername } from "@/server/members/service";

export const runtime = "nodejs";
export const OPTIONS = preflight;

const MAX_GITHUB_USERNAME_LENGTH = 39;

export async function GET(
  _request: Request,
  context: { params: Promise<{ username: string }> },
): Promise<Response> {
  try {
    const { username } = await context.params;
    if (username.length === 0 || username.length > MAX_GITHUB_USERNAME_LENGTH) {
      throw new NotFoundError("Member not found");
    }
    const viewer = await getActor();
    const member = await getVisibleMemberByUsername(username, viewer);
    return json({ member: toPublicMemberDto(member) });
  } catch (error) {
    return errorResponse(error);
  }
}
