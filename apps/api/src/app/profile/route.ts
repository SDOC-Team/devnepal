import { profileUpdateSchema } from "@gov-portal/shared";

import { requireActor } from "@/server/actor";
import { assertSameOrigin, errorResponse, json, parseJsonBody, preflight } from "@/server/http";
import { toSelfMemberDto } from "@/server/members/dto";
import { updateOwnProfile } from "@/server/members/service";

export const runtime = "nodejs";
export const OPTIONS = preflight;

export async function GET(): Promise<Response> {
  try {
    const actor = await requireActor();
    return json({ member: toSelfMemberDto(actor) });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: Request): Promise<Response> {
  try {
    assertSameOrigin(request);
    const actor = await requireActor();
    const update = await parseJsonBody(request, profileUpdateSchema);
    const updated = await updateOwnProfile(actor, update);
    return json({ member: toSelfMemberDto(updated) });
  } catch (error) {
    return errorResponse(error);
  }
}
