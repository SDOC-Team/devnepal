import { errorResponse, json, preflight } from "@/server/http";
import { toPublicMemberDto } from "@/server/members/dto";
import { listDirectoryMembers } from "@/server/members/service";

export const runtime = "nodejs";
export const OPTIONS = preflight;

export async function GET(): Promise<Response> {
  try {
    const members = await listDirectoryMembers();
    return json({ members: members.map(toPublicMemberDto) });
  } catch (error) {
    return errorResponse(error);
  }
}
