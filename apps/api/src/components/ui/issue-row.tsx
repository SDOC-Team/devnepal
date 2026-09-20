import type { Issue } from "@gov-portal/api-client";
import Link from "next/link";

import { Chip } from "@/components/ui/chip";
import { getDictionary, type Locale, localePath } from "@/lib/i18n";

export function IssueRow({ issue, locale }: { issue: Issue; locale: Locale }) {
  const dict = getDictionary(locale);
  const starter = issue.labels.some((label) => label.name.toLowerCase() === "good first issue");

  return (
    <article className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-3 px-5 py-4 hover:bg-neutral-100 [&+&]:border-t [&+&]:border-divider">
      <div>
        <div className="mt-2 flex flex-wrap gap-1">
          {starter ? <Chip tone="accent">{dict.issues.goodFirst}</Chip> : null}
          {issue.labels
            .filter((label) => !(starter && label.name.toLowerCase() === "good first issue"))
            .map((label) => (
              <Chip key={label.name}>{label.name}</Chip>
            ))}
        </div>
        <h2 className="mt-2 mb-1 text-md">
          <Link
            href={localePath(locale, `/issues/${issue.number}`)}
            className="text-text no-underline hover:text-accent-700 hover:underline"
          >
            #{issue.number} · {issue.title}
          </Link>
        </h2>
        <p className="m-0 text-sm text-neutral-700">
          {dict.issues.openedBy} @{issue.authorLogin} · {issue.commentsCount} {dict.issues.comments}
        </p>
      </div>
      <span className="flex flex-col items-end gap-1 whitespace-nowrap">
        <Link
          href={localePath(locale, `/issues/${issue.number}`)}
          className="text-sm font-semibold text-accent-700 no-underline hover:underline"
        >
          {dict.issues.readIssue}
        </Link>
        <a
          href={issue.htmlUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-neutral-600 no-underline hover:underline"
        >
          {dict.issues.github} ↗
        </a>
      </span>
    </article>
  );
}
