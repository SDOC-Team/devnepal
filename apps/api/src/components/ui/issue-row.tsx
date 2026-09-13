import type { IssueDto } from "@gov-portal/shared";
import Link from "next/link";

import { getDictionary, type Locale, localePath } from "@/lib/i18n";

export function IssueRow({ issue, locale }: { issue: IssueDto; locale: Locale }) {
  const dict = getDictionary(locale);
  const starter = issue.labels.some((label) => label.name.toLowerCase() === "good first issue");

  return (
    <article className="dn-issue-row">
      <div>
        <div className="dn-labels">
          {starter ? <span className="Label Label--accent">{dict.issues.goodFirst}</span> : null}
          {issue.labels
            .filter((label) => !(starter && label.name.toLowerCase() === "good first issue"))
            .map((label) => (
              <span key={label.name} className="Label">
                {label.name}
              </span>
            ))}
        </div>
        <h2>
          <Link href={localePath(locale, `/issues/${issue.number}`)}>
            #{issue.number} · {issue.title}
          </Link>
        </h2>
        <p className="dn-issue-meta">
          {dict.issues.openedBy} @{issue.authorLogin} · {issue.commentsCount} {dict.issues.comments}
        </p>
      </div>
      <span className="dn-issue-actions">
        <Link href={localePath(locale, `/issues/${issue.number}`)}>{dict.issues.readIssue}</Link>
        <a href={issue.htmlUrl} target="_blank" rel="noopener noreferrer">
          {dict.issues.github} ↗
        </a>
      </span>
    </article>
  );
}
