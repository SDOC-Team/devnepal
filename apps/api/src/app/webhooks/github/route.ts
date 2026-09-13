import { createHmac, timingSafeEqual } from "node:crypto";

import { eq } from "drizzle-orm";

import { getEnv } from "@/config";
import { db } from "@/db/client";
import { githubEvents } from "@/db/schema";
import * as repo from "@/server/projects/repository";
import { type GithubApiIssue, mapGitHubIssue } from "@/server/projects/sync";

export const runtime = "nodejs";

const HEADER_SIGNATURE = "x-hub-signature-256";
const HEADER_DELIVERY = "x-github-delivery";
const HEADER_EVENT = "x-github-event";

type WebhookPayload = {
  action?: string;
  repository?: { full_name?: string };
  issue?: GithubApiIssue;
};

type ProcessOutcome = {
  status: "processed" | "ignored";
  note?: string;
};

function verifySignature(rawBody: string, header: string | null, secret: string): boolean {
  if (header === null || !header.startsWith("sha256=")) {
    return false;
  }
  const expected = Buffer.from(createHmac("sha256", secret).update(rawBody).digest("hex"), "hex");
  const providedHex = header.slice("sha256=".length);
  if (!/^[0-9a-fA-F]+$/.test(providedHex)) {
    return false;
  }
  const provided = Buffer.from(providedHex, "hex");
  return expected.length === provided.length && timingSafeEqual(expected, provided);
}

async function processEvent(
  eventType: string,
  payload: WebhookPayload | null,
): Promise<ProcessOutcome> {
  if (eventType === "ping") {
    return { status: "processed" };
  }
  if (eventType !== "issues" || payload?.issue === undefined) {
    return { status: "ignored", note: `event type ${eventType}` };
  }

  const repositoryFullName = payload.repository?.full_name;
  if (typeof repositoryFullName !== "string") {
    return { status: "ignored", note: "missing repository" };
  }
  const project = await repo.findProjectByFullName(repositoryFullName);
  if (project === null) {
    return { status: "ignored", note: "no matching project" };
  }

  if (payload.action === "deleted") {
    await repo.deleteIssueByNumber(project.id, payload.issue.number);
    return { status: "processed" };
  }

  await repo.upsertIssues(project.id, [mapGitHubIssue(payload.issue)]);
  return { status: "processed" };
}

async function recordRejectedDelivery(deliveryId: string, eventType: string): Promise<void> {
  await db
    .insert(githubEvents)
    .values({
      deliveryId,
      eventType,
      signatureValid: false,
      status: "failed",
      error: "invalid signature",
    })
    .onConflictDoNothing();
}

export async function POST(request: Request): Promise<Response> {
  const secret = getEnv().GITHUB_WEBHOOK_SECRET;
  if (secret.length === 0) {
    return Response.json({ error: "webhook_not_configured" }, { status: 503 });
  }

  const rawBody = await request.text();
  const deliveryId = request.headers.get(HEADER_DELIVERY);
  const eventType = request.headers.get(HEADER_EVENT) ?? "unknown";

  if (deliveryId === null) {
    return Response.json({ error: "missing_delivery_id" }, { status: 400 });
  }

  if (!verifySignature(rawBody, request.headers.get(HEADER_SIGNATURE), secret)) {
    await recordRejectedDelivery(deliveryId, eventType);
    return Response.json({ error: "invalid_signature" }, { status: 401 });
  }

  let payload: WebhookPayload | null = null;
  try {
    payload = JSON.parse(rawBody) as WebhookPayload;
  } catch {
    payload = null;
  }

  const inserted = await db
    .insert(githubEvents)
    .values({
      deliveryId,
      eventType,
      action: typeof payload?.action === "string" ? payload.action : null,
      repositoryFullName: payload?.repository?.full_name ?? null,
      signatureValid: true,
      status: "received",
      payload,
    })
    .onConflictDoNothing()
    .returning();

  const eventRow = inserted[0];
  if (eventRow === undefined) {
    return Response.json({ status: "duplicate" }, { status: 200 });
  }

  try {
    const outcome = await processEvent(eventType, payload);
    await db
      .update(githubEvents)
      .set({ status: outcome.status, error: outcome.note ?? null, processedAt: new Date() })
      .where(eq(githubEvents.id, eventRow.id));
    return Response.json({ status: outcome.status }, { status: 202 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await db
      .update(githubEvents)
      .set({ status: "failed", error: message, processedAt: new Date() })
      .where(eq(githubEvents.id, eventRow.id));
    console.error("Webhook processing failed:", error);
    return Response.json({ status: "failed" }, { status: 500 });
  }
}
