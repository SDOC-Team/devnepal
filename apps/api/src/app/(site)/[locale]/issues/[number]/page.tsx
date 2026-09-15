"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";

import { ErrorPanel, LoadingPanel } from "@/components/modules/common";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Markdown } from "@/components/ui/markdown";
import { useLocale, useProjectIssue } from "@/hooks";
import { ApiError } from "@/lib/api-error";
import { localePath } from "@/lib/i18n";

export default function IssueDetailPage() {
  const { locale, dict } = useLocale();
  const { number } = useParams<{ number: string }>();
  const parsedNumber = /^\d+$/.test(number) ? Number(number) : undefined;
  const { issue, isLoading, error } = useProjectIssue(parsedNumber);

  if (parsedNumber === undefined || (error instanceof ApiError && error.status === 404)) {
    notFound();
  }

  if (isLoading) {
    return <LoadingPanel label={dict.common.loading} />;
  }

  if (error !== undefined || issue === undefined) {
    return (
      <ErrorPanel
        message={error?.message ?? dict.common.errorTitle}
        retryLabel={dict.common.retry}
        title={dict.common.errorTitle}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <section
      className="mx-auto w-[calc(100%-var(--page-gutter)*2)] max-w-[880px] pt-4 pb-16"
      aria-labelledby="issue-title"
    >
      <nav
        className="flex flex-wrap gap-2 py-5 text-sm text-neutral-700"
        aria-label={dict.issues.breadcrumbProject}
      >
        <Link href={localePath(locale, "/issues")} className="text-accent-700 no-underline">
          {dict.issue.breadcrumbProjects}
        </Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">
          {dict.issues.issueLabel} #{issue.number}
        </span>
      </nav>

      <article className="overflow-hidden rounded-md border border-divider bg-paper">
        <header className="border-b border-divider p-6">
          <div className="mb-4 flex flex-wrap gap-2">
            <Chip tone={issue.state === "open" ? "success" : "neutral"}>
              {issue.state === "open" ? dict.issue.stateOpen : dict.issue.stateClosed}
            </Chip>
            {issue.labels.map((label) => (
              <Chip key={label.name}>{label.name}</Chip>
            ))}
          </div>
          <h1 id="issue-title" className="mt-3 mb-2 max-w-[26ch]">
            {issue.title}
          </h1>
          <p className="m-0 text-sm text-neutral-700">
            #{issue.number} · {dict.issue.openedBy} @{issue.authorLogin} · {issue.commentsCount}{" "}
            {dict.issue.comments}
          </p>
        </header>

        <div className="prose-issue border-b border-divider p-6">
          {issue.body !== null && issue.body.trim().length > 0 ? (
            <Markdown>{issue.body}</Markdown>
          ) : (
            <p>{dict.issue.noDescription}</p>
          )}
        </div>

        <footer className="p-6">
          <Button render={<a href={issue.htmlUrl} target="_blank" rel="noopener noreferrer" />}>
            {dict.issue.startContributing}
          </Button>
          <p className="mt-3 mb-0 text-sm text-neutral-700">{dict.issue.sourceNote}</p>
        </footer>
      </article>
    </section>
  );
}
