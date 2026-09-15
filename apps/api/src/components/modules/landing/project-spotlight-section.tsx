import type { IssueDto, ProjectDto } from "@gov-portal/shared";
import Link from "next/link";

import { ArrowLink } from "@/components/modules/common";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { type Dictionary, type Locale, localePath } from "@/lib/i18n";

/**
 * "Open for contribution" section. Two-column layout: left column shows the
 * project card (image placeholder + details + buttons), right column shows
 * an issues sidebar grouped by label category.
 */
export function ProjectSpotlightSection({
  dict,
  locale,
  project,
  issues = [],
}: {
  dict: Dictionary;
  locale: Locale;
  project: ProjectDto | null;
  issues?: IssueDto[];
}) {
  if (project === null) {
    return null;
  }

  /* Group issues by their first label name for the sidebar categories. */
  const labelGroups = new Map<string, { title: string; description: string }>();
  for (const issue of issues) {
    const label = issue.labels[0]?.name ?? "General";
    if (!labelGroups.has(label)) {
      labelGroups.set(label, {
        title: label.charAt(0).toUpperCase() + label.slice(1),
        description: issue.title,
      });
    }
  }

  return (
    <section className="py-12" aria-labelledby="contrib-heading">
      <div className="container">
        <h2 id="contrib-heading" className="mb-8 leading-[1.08] tracking-[-0.01em]">
          {dict.home.openForContribTitle}
        </h2>

        <div className="grid grid-cols-1 items-start gap-6 min-[821px]:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)]">
          <article className="grid grid-cols-[minmax(0,320px)_minmax(0,1fr)] items-stretch overflow-hidden rounded-md border border-divider bg-paper">
            <div
              className="min-h-full border-r border-divider bg-[url('/assets/devnepal/images/devnepal-project-card.png')] bg-cover bg-center bg-no-repeat"
              aria-hidden="true"
            />
            <div className="flex flex-col gap-3 p-6">
              <h3 className="m-0 text-xl leading-tight">
                <Link
                  href={localePath(locale, "/project")}
                  className="text-text no-underline hover:text-accent-700 hover:underline"
                >
                  {project.title}
                </Link>
              </h3>
              <p className="m-0 text-sm text-neutral-600">{dict.home.openForContribOwner}</p>
              <p className="m-0 text-sm leading-normal text-neutral-700">
                {dict.home.openForContribDesc}
              </p>

              <p className="m-0 text-xs text-neutral-600">{dict.home.stackLabel}</p>

              <div className="flex flex-wrap gap-1">
                {dict.home.openForContribTopics.map((topic, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: placeholder copy repeats the same topic label
                  <Chip key={`${topic}-${index}`}>{topic}</Chip>
                ))}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Button render={<a href={project.htmlUrl} rel="noreferrer" target="_blank" />}>
                  {dict.project.viewOnGitHub}
                </Button>
                <Button variant="outline" render={<Link href={localePath(locale, "/issues")} />}>
                  {dict.home.seeTheIssues}
                </Button>
              </div>
            </div>
          </article>

          <aside className="overflow-hidden rounded-md border border-divider bg-paper">
            <div className="flex items-center justify-between border-b border-divider px-5 py-4">
              <h3 className="m-0 text-md font-semibold">{dict.home.issuesPanelTitle}</h3>
              <ArrowLink href={localePath(locale, "/issues")}>
                {dict.home.browseAllIssues}
              </ArrowLink>
            </div>
            {Array.from(labelGroups.entries()).map(([label, group]) => (
              <Link
                key={label}
                href={localePath(locale, "/issues")}
                className="flex items-center justify-between gap-4 border-b border-divider px-5 py-4 text-text no-underline transition-colors last:border-b-0 hover:bg-bg"
              >
                <div className="min-w-0">
                  <strong className="block text-sm leading-snug font-semibold">
                    {group.title}
                  </strong>
                  <span className="mt-0.5 block text-xs leading-normal text-neutral-600">
                    {group.description}
                  </span>
                </div>
                <span className="flex-none text-lg text-neutral-400" aria-hidden="true">
                  ›
                </span>
              </Link>
            ))}
          </aside>
        </div>
      </div>
    </section>
  );
}
