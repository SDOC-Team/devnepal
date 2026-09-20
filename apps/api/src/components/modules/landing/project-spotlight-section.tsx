import type { IssueDto, ProjectDto } from "@gov-portal/shared";
import { CaretRightIcon } from "@phosphor-icons/react/ssr";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { type Dictionary, type Locale, localePath } from "@/lib/i18n";

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

  const issueRows = Array.from(labelGroups.entries()).map(([label, group]) => ({
    key: label,
    title: group.title,
    description: group.description,
    href: localePath(locale, "/issues"),
  }));

  return (
    <section
      id="projects"
      data-slot="featured-project"
      className="flex scroll-mt-4 flex-col gap-8 px-4 py-12 sm:px-8 lg:px-16 lg:py-16"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">{dict.home.openForContribTitle}</h2>
      </div>

      <div className={`grid gap-5 ${issueRows.length > 0 ? "lg:grid-cols-3" : ""}`}>
        {/* Featured Project Card */}
        <Card
          data-slot="project-card"
          className={`gap-0 py-0 transition-colors duration-200 hover:bg-muted hover:ring-foreground/20 lg:flex-row ${issueRows.length > 0 ? "lg:col-span-2" : ""}`}
        >
          <div className="p-4 lg:max-w-[55%] lg:flex-1">
            <div className="relative aspect-[681/491] w-full overflow-hidden rounded-lg lg:aspect-auto lg:h-full">
              <Image
                src="/projects/featured.png"
                alt={project.title}
                fill
                sizes="(min-width: 1024px) 45vw, calc(100vw - 2rem)"
                className="object-cover"
              />
            </div>
          </div>
          <CardContent className="flex flex-1 flex-col gap-4 px-4 pt-4 pb-6 lg:justify-between">
            <div className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="min-w-0 flex-1 text-2xl font-semibold text-card-foreground">
                  <Link
                    href={localePath(locale, "/project")}
                    className="no-underline hover:text-primary"
                  >
                    {project.title}
                  </Link>
                </h3>
                {project.license !== null ? (
                  <Badge variant="outline" className="h-[22px]">
                    {project.license}
                  </Badge>
                ) : null}
              </div>
              <p className="text-base text-card-foreground">
                {project.description ?? dict.home.openForContribDesc}
              </p>
            </div>

            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-x-4">
                <p className="shrink-0 py-2 text-sm text-muted-foreground">
                  {dict.home.stackLabel}
                </p>
                <div className="flex min-w-0 flex-1 flex-wrap gap-2 py-2">
                  {dict.home.openForContribTopics.map((topic) => (
                    <Badge key={topic} variant="outline" className="h-[22px]">
                      {topic}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-4">
                <p className="shrink-0 py-2 text-sm text-muted-foreground">Interface languages</p>
                <div className="flex min-w-0 flex-1 flex-wrap gap-2 py-2">
                  <Badge variant="outline" className="h-[22px]">
                    नेपाली
                  </Badge>
                  <Badge variant="outline" className="h-[22px]">
                    English
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                nativeButton={false}
                render={<a href={project.htmlUrl} rel="noreferrer" target="_blank" />}
              >
                {dict.project.viewOnGitHub}
              </Button>
              <Button
                size="lg"
                variant="outline"
                nativeButton={false}
                render={<Link href={localePath(locale, "/issues")} />}
              >
                {dict.home.seeTheIssues}
              </Button>
            </div>
          </CardContent>
        </Card>

        {issueRows.length > 0 ? (
          <Card
            data-slot="open-issues-card"
            className="gap-0 py-0 transition-colors duration-200 hover:ring-foreground/20"
          >
            <CardContent className="flex flex-col gap-2 px-4 pt-4 pb-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold text-card-foreground">
                  {dict.home.issuesPanelTitle}
                </h3>
                <Button
                  variant="link"
                  nativeButton={false}
                  render={<Link href={localePath(locale, "/issues")} />}
                  className="h-auto p-0 text-sm text-secondary-foreground"
                >
                  {dict.home.browseAllIssues}
                </Button>
              </div>
              <div className="flex flex-col">
                {issueRows.map((issue) => (
                  <Link
                    key={issue.key}
                    href={issue.href}
                    className="group flex items-center gap-3 border-t border-border py-2 pr-4 pl-5 transition-colors outline-none first:border-t-0 hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
                  >
                    <span className="flex min-w-0 flex-1 flex-col gap-1">
                      <span className="text-base font-medium text-card-foreground">
                        {issue.title}
                      </span>
                      <span className="text-sm text-muted-foreground">{issue.description}</span>
                    </span>
                    <CaretRightIcon className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </section>
  );
}
