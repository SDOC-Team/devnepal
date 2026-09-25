import { sql } from "drizzle-orm";

import { db } from "@/db/client";
import { json } from "@/server/http";

export const runtime = "nodejs";

export async function GET(): Promise<Response> {
  try {
    await db.execute(sql`select 1`);
    return json({ status: "ok" });
  } catch (error) {
    console.error("Health check failed:", error);
    return json({ status: "unavailable" }, { status: 503 });
  }
}
