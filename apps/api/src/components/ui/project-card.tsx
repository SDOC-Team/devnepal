import type { ProjectDto } from "@gov-portal/shared";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { type Dictionary, type Locale, localePath } from "@/lib/i18n";

/**
 * Project summary card: title, owning body, description, topic labels and the
 * two actions. Used by the landing grid and the project index.
 */
export function ProjectCard({
  project,
  dict,
  locale,
  owner,
  topics = [],
}: {
  project: ProjectDto;
  dict: Dictionary;
  locale: Locale;
  /** Owning ministry or office, shown under the title. */
  owner?: string;
  /** Short topic labels (language, framework). */
  topics?: string[];
}) {
  return (
    <article className="flex flex-col justify-between gap-4 rounded-md border border-border bg-card p-5">
      <div className="flex flex-col gap-3">
        <h3 className="m-0 text-md">
          <Link
            href={localePath(locale, "/project")}
            className="text-foreground no-underline hover:text-primary hover:underline"
          >
            {project.title}
          </Link>
        </h3>
        {owner !== undefined ? <p className="m-0 text-sm text-muted-foreground">{owner}</p> : null}
        <p className="m-0 text-sm leading-normal text-muted-foreground">
          {project.description ?? dict.project.none}
        </p>

        {topics.length > 0 ? (
          <div className="mt-2 flex flex-wrap gap-1">
            {topics.map((topic) => (
              <Chip key={topic}>{topic}</Chip>
            ))}
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" render={<Link href={localePath(locale, "/issues")} />}>
          {dict.project.chooseIssue}
        </Button>
        <Button render={<a href={project.htmlUrl} rel="noreferrer" target="_blank" />}>
          {dict.project.viewOnGitHub}
        </Button>
      </div>
    </article>
  );
}
