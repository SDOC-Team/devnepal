import { adminMemberUpdateSchema } from "@gov-portal/shared";
import { z } from "zod";

import { requireActor } from "@/server/actor";
import { NotFoundError } from "@/server/errors";
import { assertSameOrigin, errorResponse, json, parseJsonBody, preflight } from "@/server/http";
import { toAdminMemberDto } from "@/server/members/dto";
import { adminUpdateMember } from "@/server/members/service";

export const runtime = "nodejs";
export const OPTIONS = preflight;

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  try {
    assertSameOrigin(request);
    const actor = await requireActor();
    const { id } = await context.params;
    if (!z.uuid().safeParse(id).success) {
      throw new NotFoundError("Member not found");
    }
    const update = await parseJsonBody(request, adminMemberUpdateSchema);
    const updated = await adminUpdateMember(actor, id, update);
    return json({ member: toAdminMemberDto(updated) });
  } catch (error) {
    return errorResponse(error);
  }
}
