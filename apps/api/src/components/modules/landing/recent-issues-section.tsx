import type { IssueDto } from "@gov-portal/shared";

import { ArrowLink, SectionHeading } from "@/components/modules/common";
import { IssueRow } from "@/components/ui/issue-row";
import { type Dictionary, type Locale, localePath } from "@/lib/i18n";

/** Most recently updated open issues from the active project's GitHub sync. */
export function RecentIssuesSection({
  dict,
  locale,
  issues,
}: {
  dict: Dictionary;
  locale: Locale;
  issues: IssueDto[];
}) {
  return (
    <section className="py-12" aria-labelledby="recent-issues-heading">
      <div className="container">
        <SectionHeading
          kicker={dict.home.githubActivityKicker}
          title={dict.home.githubActivityTitle}
          titleId="recent-issues-heading"
          lede={dict.home.githubActivityBody}
          action={
            <ArrowLink href={localePath(locale, "/issues")}>{dict.home.browseIssues} →</ArrowLink>
          }
        />
        <div className="mt-5 overflow-hidden rounded-md border border-border bg-card">
          {issues.map((issue) => (
            <IssueRow key={issue.number} issue={issue} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}
