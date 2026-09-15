import type { IssueDto, IssueListDto, LabelFacetDto } from "@gov-portal/shared";
import useSWR from "swr";

export type IssuesQuery = {
  page: number;
  perPage: number;
  q?: string;
  label?: string;
};

function issuesKey(query: IssuesQuery): string {
  const search = new URLSearchParams({
    page: String(query.page),
    perPage: String(query.perPage),
  });
  if (query.q !== undefined) {
    search.set("q", query.q);
  }
  if (query.label !== undefined) {
    search.set("label", query.label);
  }
  return `/project/issues?${search.toString()}`;
}

/** Paginated, filterable issue list for the given query. Pass `enabled: false`
 * to skip fetching — e.g. while the parent project hasn't resolved yet. */
export function useProjectIssues(query: IssuesQuery, enabled = true) {
  const { data, error, isLoading } = useSWR<IssueListDto>(enabled ? issuesKey(query) : null);
  return {
    issues: data?.issues ?? [],
    total: data?.total ?? 0,
    isLoading,
    error: error as Error | undefined,
  };
}

/** A single issue by number. */
export function useProjectIssue(number: number | undefined) {
  const { data, error, isLoading } = useSWR<{ issue: IssueDto }>(
    number !== undefined ? `/project/issues/${number}` : null,
  );
  return {
    issue: data?.issue,
    isLoading,
    error: error as Error | undefined,
  };
}

/** Open-issue label facets, used to build the filter chips. */
export function useIssueLabels() {
  const { data, error, isLoading } = useSWR<{ labels: LabelFacetDto[] }>("/project/issues/labels");
  return {
    labels: data?.labels ?? [],
    isLoading,
    error: error as Error | undefined,
  };
}
