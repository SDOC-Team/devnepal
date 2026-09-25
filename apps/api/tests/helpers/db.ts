import { sql } from "drizzle-orm";

import { db } from "@/db/client";
import { resetRateLimits } from "@/server/rate-limit";

export async function resetDatabase(): Promise<void> {
  resetRateLimits();
  await db.execute(
    sql`truncate table github_events, github_issues, projects, members restart identity cascade`,
  );
}
