import type { IssueDto } from "@gov-portal/shared";

import { ArrowLink, SectionHeading } from "@/components/modules/common";
import { IssueRow } from "@/components/ui/issue-row";
import { type Dictionary, type Locale, localePath } from "@/lib/i18n";

/** Most recent open issues. The caller omits this section when there are none. */
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
          kicker={dict.project.issuesKicker}
          title={dict.project.issuesTitle}
          titleId="recent-issues-heading"
          action={
            <ArrowLink href={localePath(locale, "/issues")}>{dict.home.browseIssues} →</ArrowLink>
          }
        />
        <div className="mt-5 overflow-hidden rounded-md border border-divider bg-paper">
          {issues.map((issue) => (
            <IssueRow key={issue.number} issue={issue} locale={locale} />
          ))}
        </div>
      </div>
    </section>
  );
}
