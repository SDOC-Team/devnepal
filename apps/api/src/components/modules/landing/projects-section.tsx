import type { ProjectDto } from "@gov-portal/shared";

import { ArrowLink, SectionHeading } from "@/components/modules/common";
import { ProjectCard } from "@/components/ui/project-card";
import { type Dictionary, type Locale, localePath } from "@/lib/i18n";

/**
 * Grid of published projects. The heading carries a trailing link to the
 * full project index.
 */
export function ProjectsSection({
  dict,
  locale,
  projects,
}: {
  dict: Dictionary;
  locale: Locale;
  projects: ProjectDto[];
}) {
  if (projects.length === 0) {
    return null;
  }

  return (
    <section className="py-12" aria-labelledby="projects-heading">
      <div className="container">
        <SectionHeading
          title={dict.home.contributeTitle}
          titleId="projects-heading"
          action={
            <ArrowLink href={localePath(locale, "/project")}>{dict.home.seeProject} →</ArrowLink>
          }
        />

        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.githubRepoId} dict={dict} locale={locale} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
