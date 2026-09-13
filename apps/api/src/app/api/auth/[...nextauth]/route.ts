import type { NextRequest } from "next/server";

import { handlers } from "@/auth";
import { errorResponse, withCors } from "@/server/http";
import { enforceRateLimit } from "@/server/rate-limit";

export const runtime = "nodejs";

export async function GET(request: NextRequest): Promise<Response> {
  try {
    enforceRateLimit(request, "auth");
    return withCors(await handlers.GET(request));
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    enforceRateLimit(request, "auth");
    return withCors(await handlers.POST(request));
  } catch (error) {
    return errorResponse(error);
  }
}
