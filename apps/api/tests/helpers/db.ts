import { sql } from "drizzle-orm";

import { db } from "@/db/client";

export async function resetDatabase(): Promise<void> {
  await db.execute(sql`truncate table members restart identity cascade`);
}
