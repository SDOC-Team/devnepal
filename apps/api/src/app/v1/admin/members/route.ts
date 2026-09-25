import { memberStatusSchema } from "@gov-portal/shared";

import type { MemberStatus } from "@/db/schema";
import { requireActor } from "@/server/actor";
import { ValidationError } from "@/server/errors";
import { errorResponse, json, preflight } from "@/server/http";
import { toAdminMemberDto } from "@/server/members/dto";
import { adminListMembers } from "@/server/members/service";

export const runtime = "nodejs";
export const OPTIONS = preflight;

export async function GET(request: Request): Promise<Response> {
  try {
    const actor = await requireActor();
    const statusParam = new URL(request.url).searchParams.get("status");
    let status: MemberStatus | undefined;
    if (statusParam !== null) {
      const parsed = memberStatusSchema.safeParse(statusParam);
      if (!parsed.success) {
        throw new ValidationError("Invalid status filter", [
          {
            path: "status",
            message: "status must be one of: pending, approved, rejected, hidden",
          },
        ]);
      }
      status = parsed.data;
    }
    const members = await adminListMembers(actor, status);
    return json({ members: members.map(toAdminMemberDto) });
  } catch (error) {
    return errorResponse(error);
  }
}
