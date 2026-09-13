import { sql } from "drizzle-orm";

import { db } from "@/db/client";

export async function resetDatabase(): Promise<void> {
  await db.execute(
    sql`truncate table github_events, github_issues, projects, members restart identity cascade`,
  );
}
