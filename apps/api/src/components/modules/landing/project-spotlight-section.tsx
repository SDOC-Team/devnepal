import type { ProjectDto } from "@gov-portal/shared";
import { GithubLogoIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { type Dictionary, type Locale, localePath } from "@/lib/i18n";

export function ProjectSpotlightSection({
  dict,
  locale,
  project,
}: {
  dict: Dictionary;
  locale: Locale;
  project: ProjectDto | null;
}) {
  if (project === null) {
    return null;
  }

  return (
    <section
      id="projects"
      data-slot="featured-project"
      className="flex scroll-mt-4 flex-col gap-8 px-4 py-12 sm:px-8 lg:px-16 lg:py-16"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">{dict.home.openForContribTitle}</h2>
      </div>

      <Card
        data-slot="project-card"
        className="gap-0 py-0 transition-colors duration-200 hover:ring-foreground/20 lg:flex-row"
      >
        <div className="p-4 lg:max-w-[55%] lg:flex-1">
          <div className="flex aspect-[681/491] w-full flex-col justify-between overflow-hidden rounded-lg bg-primary p-6 text-primary-foreground lg:aspect-auto lg:h-full">
            <GithubLogoIcon className="size-10" aria-hidden="true" />
            <div>
              <p className="text-sm font-medium text-primary-foreground/75">
                {dict.stats.repository}
              </p>
              <p className="mt-1 break-words text-2xl font-semibold">{project.fullName}</p>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-primary-foreground/85">
                <span>
                  {project.openIssueCount} {dict.stats.openIssues}
                </span>
                <span>
                  {project.memberCount} {dict.stats.members}
                </span>
              </div>
            </div>
          </div>
        </div>
        <CardContent className="flex flex-1 flex-col gap-4 px-4 pt-4 pb-6 lg:justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-primary text-primary-foreground">
                {dict.home.governmentOfNepal}
              </Badge>
              <span className="text-sm text-muted-foreground">{dict.home.programmeOwner}</span>
            </div>
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
              <p className="shrink-0 py-2 text-sm text-muted-foreground">{dict.home.stackLabel}</p>
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
    </section>
  );
}
