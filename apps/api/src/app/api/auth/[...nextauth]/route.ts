import type { NextRequest } from "next/server";

import { handlers } from "@/auth";
import { withCors } from "@/server/http";

export const runtime = "nodejs";

export async function GET(request: NextRequest): Promise<Response> {
  return withCors(await handlers.GET(request));
}

export async function POST(request: NextRequest): Promise<Response> {
  return withCors(await handlers.POST(request));
}
