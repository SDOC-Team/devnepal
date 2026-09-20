import { spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dir, "..");

function run(command: string[], { allowFailure = false } = {}): boolean {
  const [bin, ...args] = command;
  if (bin === undefined) {
    throw new Error("Empty command");
  }
  const result = spawnSync(bin, args, { cwd: root, stdio: "inherit" });
  if (result.error !== undefined || result.status !== 0) {
    if (allowFailure) {
      return false;
    }
    throw new Error(
      `Command failed: ${command.join(" ")}${result.error ? ` (${result.error.message})` : ""}`,
    );
  }
  return true;
}

function sleepSync(ms: number): void {
  Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);
}

function bootstrapEnvFiles(): void {
  const apiEnvPath = path.join(root, "apps/api/.env.local");
  if (!existsSync(apiEnvPath)) {
    const example = readFileSync(path.join(root, "apps/api/.env.example"), "utf8");
    const secret = randomBytes(48).toString("base64");
    writeFileSync(apiEnvPath, example.replace(/^AUTH_SECRET=.*$/m, `AUTH_SECRET=${secret}`));
    console.log("✔ created apps/api/.env.local with a generated AUTH_SECRET");
  } else {
    console.log("• apps/api/.env.local already exists — left untouched");
  }
}

function githubCredentialsConfigured(): boolean {
  const env = readFileSync(path.join(root, "apps/api/.env.local"), "utf8");
  const value = (key: string): string =>
    new RegExp(`^${key}=(.*)$`, "m").exec(env)?.[1]?.trim() ?? "";
  return (
    value("AUTH_GITHUB_ID").length > 0 &&
    !value("AUTH_GITHUB_ID").startsWith("placeholder") &&
    value("AUTH_GITHUB_SECRET").length > 0 &&
    !value("AUTH_GITHUB_SECRET").startsWith("placeholder")
  );
}

async function main(): Promise<void> {
  console.log("gov-portal setup\n");

  if (!run(["docker", "compose", "version"], { allowFailure: true })) {
    console.error(
      "✖ Docker is not available. Install Docker (or start colima with `colima start`) and rerun `bun run setup`.",
    );
    process.exit(1);
  }

  bootstrapEnvFiles();

  console.log("\n▸ starting PostgreSQL");
  run(["docker", "compose", "up", "-d", "db"]);

  let ready = false;
  for (let attempt = 1; attempt <= 60; attempt += 1) {
    const healthy = spawnSync(
      "docker",
      ["compose", "exec", "-T", "db", "pg_isready", "-U", "refined", "-d", "refined"],
      { cwd: root, stdio: "ignore" },
    );
    if (healthy.status === 0) {
      ready = true;
      break;
    }
    sleepSync(1000);
  }
  if (!ready) {
    console.error("✖ PostgreSQL did not become healthy within 60 seconds.");
    process.exit(1);
  }
  console.log("✔ PostgreSQL is ready");

  console.log("\n▸ installing dependencies");
  run(["bun", "install"]);

  console.log("\n▸ applying database migrations");
  run(["bun", "run", "--cwd", "apps/api", "db:migrate"]);

  console.log("\n▸ initializing the GitHub project and issues");
  run(["bun", "run", "--cwd", "apps/api", "db:init"]);

  console.log("\nDone. Start the app:");
  console.log("  bun run dev       # UI + API → http://localhost:3000/en");
  if (!githubCredentialsConfigured()) {
    console.log(
      "\nNote: GitHub sign-in is not configured yet. Add OAuth credentials before creating member profiles.",
    );
    console.log(
      "To enable sign-in, add AUTH_GITHUB_ID / AUTH_GITHUB_SECRET to apps/api/.env.local (see README).",
    );
  }
}

main().catch((error) => {
  console.error(`\n✖ Setup failed: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
