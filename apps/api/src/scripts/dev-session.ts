import { config as loadEnv } from "dotenv";
import { sql } from "drizzle-orm";

loadEnv({ path: ".env.local" });
loadEnv();

async function main(): Promise<void> {
  const username = process.argv[2];
  if (username === undefined || username.trim().length === 0) {
    console.error("usage: bun run dev:session <githubUsername>");
    process.exit(1);
  }

  const { db } = await import("../db/client");
  const { members } = await import("../db/schema");
  const { encode } = await import("next-auth/jwt");

  const secret = process.env.AUTH_SECRET;
  if (secret === undefined || secret.length === 0) {
    throw new Error("AUTH_SECRET is missing from the environment");
  }

  const rows = await db
    .select()
    .from(members)
    .where(sql`lower(${members.githubUsername}) = ${username.trim().toLowerCase()}`)
    .limit(1);
  const member = rows[0];
  if (member === undefined) {
    console.error(
      `No member with GitHub username "${username}". Seed the database first: bun run db:seed`,
    );
    process.exit(1);
  }

  const token = await encode({
    salt: "authjs.session-token",
    secret,
    token: { memberId: member.id },
  });

  console.log(`Member:   ${member.displayName} (@${member.githubUsername})`);
  console.log(`Status:   ${member.status}`);
  console.log(`GitHub:   id ${member.githubId}`);
  console.log("");
  console.log("Session cookie (dev only — never share or commit):");
  console.log("");
  console.log(`  authjs.session-token=${token}`);
  console.log("");
  console.log("To use it:");
  console.log("  1. Start the app:  bun run dev");
  console.log("  2. Open http://localhost:3000/en and sign in is already active once set.");
  console.log("  3. DevTools → Application → Cookies → http://localhost:3000 →");
  console.log("     add a cookie named authjs.session-token with the value above.");
  console.log("");
  console.log("For admin screens, add this to apps/api/.env.local and restart:");
  console.log(`  ADMIN_GITHUB_IDS=${member.githubId}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("dev:session failed:", error);
    process.exit(1);
  });
