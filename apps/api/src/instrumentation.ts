export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { getEnv, getAdminGithubIds } = await import("./config");
    getEnv();
    getAdminGithubIds();
  }
}
