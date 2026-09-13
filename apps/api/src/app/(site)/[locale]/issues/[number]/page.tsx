import type { IssueDto } from "@gov-portal/shared";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Markdown } from "@/components/ui/markdown";
import { getDictionary, isLocale, type Locale, localePath } from "@/lib/i18n";
import { NotFoundError } from "@/server/errors";
import { getProjectIssue } from "@/server/projects/service";

export const dynamic = "force-dynamic";

export default async function IssueDetailPage({
  params,
}: {
  params: Promise<{ locale: string; number: string }>;
}) {
  const { locale, number } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  const activeLocale: Locale = locale;
  const dict = getDictionary(activeLocale);

  if (!/^\d+$/.test(number)) {
    notFound();
  }

  let issue: IssueDto;
  try {
    issue = await getProjectIssue(Number(number));
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }
    throw error;
  }

  return (
    <section className="dn-container dn-github-issue" aria-labelledby="issue-title">
      <nav className="dn-breadcrumbs" aria-label={dict.issues.breadcrumbProject}>
        <Link href={localePath(activeLocale, "/issues")}>{dict.issue.breadcrumbProjects}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">
          {dict.issues.issueLabel} #{issue.number}
        </span>
      </nav>

      <article className="dn-github-issue__card">
        <header>
          <div className="dn-project-hero__labels">
            <span className={`Label ${issue.state === "open" ? "Label--success" : ""}`}>
              {issue.state === "open" ? dict.issue.stateOpen : dict.issue.stateClosed}
            </span>
            {issue.labels.map((label) => (
              <span key={label.name} className="Label">
                {label.name}
              </span>
            ))}
          </div>
          <h1 id="issue-title">{issue.title}</h1>
          <p>
            #{issue.number} · {dict.issue.openedBy} @{issue.authorLogin} · {issue.commentsCount}{" "}
            {dict.issue.comments}
          </p>
        </header>

        <div className="dn-github-issue__body">
          {issue.body !== null && issue.body.trim().length > 0 ? (
            <Markdown>{issue.body}</Markdown>
          ) : (
            <p>{dict.issue.noDescription}</p>
          )}
        </div>

        <footer>
          <a
            className="btn btn--primary"
            href={issue.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {dict.issue.startContributing}
          </a>
          <p>{dict.issue.sourceNote}</p>
        </footer>
      </article>
    </section>
  );
}
