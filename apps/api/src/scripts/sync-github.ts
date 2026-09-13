import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });
loadEnv();

async function main(): Promise<void> {
  const { syncProjectIssues } = await import("../server/projects/sync");
  const result = await syncProjectIssues();
  console.log(
    `Synced ${result.synced} issues (skipped ${result.skippedPullRequests} pull requests).`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("GitHub sync failed:", error);
    process.exit(1);
  });
