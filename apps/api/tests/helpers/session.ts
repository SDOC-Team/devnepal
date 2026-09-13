import type { Session } from "next-auth";
import type { MockedFunction } from "vitest";

import { auth } from "@/auth";
import type { Member } from "@/db/schema";

const mockedAuth = auth as unknown as MockedFunction<() => Promise<Session | null>>;

export function mockSessionAs(member: Member | null): void {
  if (member === null) {
    mockedAuth.mockResolvedValue(null);
    return;
  }
  const session = {
    user: { id: member.id },
    expires: new Date(Date.now() + 3_600_000).toISOString(),
  } as Session;
  mockedAuth.mockResolvedValue(session);
}

export function jsonRequest(
  url: string,
  method: string,
  options: { body?: unknown; origin?: string } = {},
): Request {
  const headers = new Headers();
  if (options.body !== undefined) {
    headers.set("content-type", "application/json");
  }
  if (options.origin !== undefined) {
    headers.set("origin", options.origin);
  }
  return new Request(url, {
    method,
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
}
