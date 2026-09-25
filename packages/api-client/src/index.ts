import createClient from "openapi-fetch";

import type { components, paths } from "./schema.gen";

export type ApiErrorBody = components["schemas"]["ErrorResponse"];
export type AdminMember = components["schemas"]["AdminMember"];
export type Issue = components["schemas"]["Issue"];
export type IssueLabel = components["schemas"]["IssueLabel"];
export type IssueLabelFacet = components["schemas"]["IssueLabelFacet"];
export type IssueList = components["schemas"]["IssueList"];
export type Member = components["schemas"]["Member"];
export type Profile = components["schemas"]["Profile"];
export type ProfileResponse = components["schemas"]["ProfileResponse"];
export type Project = components["schemas"]["Project"];
export type ProfileUpdate = components["schemas"]["ProfileUpdate"];
export type AdminMemberUpdate = components["schemas"]["AdminMemberUpdate"];

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details: ApiErrorBody["error"]["details"];

  constructor(status: number, body: ApiErrorBody) {
    super(body.error.message);
    this.name = "ApiError";
    this.status = status;
    this.code = body.error.code;
    this.details = body.error.details;
  }
}

export type ApiClientOptions = {
  baseUrl: string;
  fetch?: typeof globalThis.fetch;
  headers?: HeadersInit;
};

function expectData<T>(result: { data?: T; error?: ApiErrorBody; response: Response }): T {
  if (result.data !== undefined) {
    return result.data;
  }
  if (result.error !== undefined) {
    throw new ApiError(result.response.status, result.error);
  }
  throw new Error(`API returned an empty response with status ${result.response.status}`);
}

/**
 * The only HTTP entry point for browser presentation code. `baseUrl` is the
 * application's same-origin versioned API path (`/v1`). Server Components
 * should call backend services directly instead of making a loopback request.
 * This client intentionally exposes API representations only.
 */
export function createApiClient(options: ApiClientOptions) {
  const client = createClient<paths>({
    baseUrl: options.baseUrl,
    credentials: "include",
    fetch: options.fetch,
    headers: options.headers,
  });

  return {
    async getProject(): Promise<Project> {
      return expectData(await client.GET("/project")).project;
    },

    async listIssues(
      input: { label?: string; q?: string; page?: number; perPage?: number } = {},
    ): Promise<IssueList> {
      return expectData(await client.GET("/project/issues", { params: { query: input } }));
    },

    async getIssue(number: number): Promise<Issue> {
      const result = await client.GET("/project/issues/{number}", {
        params: { path: { number } },
      });
      return expectData(result).issue;
    },

    async listIssueLabels(): Promise<IssueLabelFacet[]> {
      return expectData(await client.GET("/project/issues/labels")).labels;
    },

    async listMembers(): Promise<Member[]> {
      return expectData(await client.GET("/members")).members;
    },

    async getMember(username: string): Promise<Member> {
      const result = await client.GET("/members/{username}", {
        params: { path: { username } },
      });
      return expectData(result).member;
    },

    async getMemberByGithubId(githubId: number): Promise<Member> {
      const result = await client.GET("/members/id/{githubId}", {
        params: { path: { githubId } },
      });
      return expectData(result).member;
    },

    async getProfile(): Promise<ProfileResponse> {
      return expectData(await client.GET("/profile"));
    },

    async updateProfile(input: ProfileUpdate): Promise<Profile> {
      return expectData(await client.PATCH("/profile", { body: input })).member;
    },

    async listAdminMembers(status?: AdminMember["status"]): Promise<AdminMember[]> {
      const result = await client.GET("/admin/members", {
        params: { query: status === undefined ? {} : { status } },
      });
      return expectData(result).members;
    },

    async updateAdminMember(id: string, input: AdminMemberUpdate): Promise<AdminMember> {
      const result = await client.PATCH("/admin/members/{id}", {
        params: { path: { id } },
        body: input,
      });
      return expectData(result).member;
    },
  };
}
