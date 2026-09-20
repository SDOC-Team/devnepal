"use client";

import Link from "next/link";

import { ArrowLink, ErrorPanel, LoadingPanel } from "@/components/modules/common";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { IssueRow } from "@/components/ui/issue-row";
import { useLocale, useProject, useProjectIssues } from "@/hooks";
import { localePath } from "@/lib/i18n";

export default function ProjectPage() {
  const { locale, dict } = useLocale();
  const { project, isLoading: projectLoading, error } = useProject();
  const { issues: recentIssues } = useProjectIssues({ page: 1, perPage: 8 }, project !== null);

  if (projectLoading) {
    return <LoadingPanel label={dict.common.loading} />;
  }

  if (error !== undefined) {
    return (
      <ErrorPanel
        message={error.message}
        retryLabel={dict.common.retry}
        title={dict.common.errorTitle}
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (project === null) {
    return (
      <section className="py-12" aria-labelledby="project-heading">
        <div className="container">
          <div
            className="grid justify-items-start gap-2 rounded-md border border-dashed border-divider-strong bg-paper px-6 py-8"
            role="status"
          >
            <strong className="m-0 font-heading text-lg leading-tight font-semibold">
              {dict.project.noIssues}
            </strong>
            <p className="m-0 max-w-[62ch]">{dict.project.contributeBody}</p>
            <Button variant="outline" render={<Link href={localePath(locale, "/")} />}>
              {dict.home.seeProject}
            </Button>
          </div>
        </div>
      </section>
    );
  }

  const [owner, name] = project.fullName.split("/");
  const synced =
    project.lastSyncedAt !== null
      ? new Date(project.lastSyncedAt).toLocaleString(locale === "ne" ? "ne-NP" : "en-GB")
      : dict.project.never;

  return (
    <>
      <header className="border-b border-divider bg-paper pt-4">
        <div className="container">
          <nav
            className="flex flex-wrap gap-2 pt-2 pb-3 text-sm text-neutral-700"
            aria-label={dict.project.kicker}
          >
            <Link href={localePath(locale, "/")} className="text-accent-700 no-underline">
              {dict.brand}
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{project.title}</span>
          </nav>
        </div>
        <div className="container grid grid-cols-1 items-start gap-5 pt-2 pb-1 min-[801px]:grid-cols-[minmax(0,1fr)_minmax(240px,300px)] min-[801px]:gap-8">
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              <Chip tone="outline">{dict.project.publicLabel}</Chip>
              <Chip tone="success">{dict.project.openLabel}</Chip>
            </div>
            <div className="mb-4 flex flex-wrap items-baseline gap-2">
              <span className="font-heading text-repo-owner font-semibold text-neutral-600">
                {owner}
              </span>
              <span className="text-neutral-600" aria-hidden="true">
                /
              </span>
              <h1 className="m-0 text-repo leading-[0.98]">{name ?? project.fullName}</h1>
            </div>
            <p className="max-w-[68ch] text-md leading-[1.55] text-neutral-700">
              {project.description ?? dict.project.none}
            </p>
            <p className="mt-3 mb-0 max-w-[78ch] text-sm text-neutral-600">
              <strong>{dict.project.lastSync}</strong> {synced}
            </p>
          </div>
          <div className="grid content-start gap-3 rounded-md border border-divider bg-accent-100 p-5">
            <Button className="w-full" render={<Link href={localePath(locale, "/issues")} />}>
              {dict.project.chooseIssue}
            </Button>
            <Button
              variant="secondary"
              className="w-full"
              render={<a href={project.htmlUrl} target="_blank" rel="noopener noreferrer" />}
            >
              {dict.project.viewOnGitHub}
            </Button>
            <p className="m-0 text-sm text-neutral-700">{dict.project.githubSourceNote}</p>
          </div>
        </div>
      </header>

      <div className="container grid gap-8 pt-6 pb-16">
        <section aria-labelledby="about-heading">
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <p className="mb-2 block text-sm font-semibold text-accent-700">
                {dict.project.aboutKicker}
              </p>
              <h2 id="about-heading" className="m-0">
                {dict.project.aboutTitle}
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-6">
            <div>
              <h3 className="mt-0 mb-2 font-sans text-xs font-bold tracking-[0.08em] uppercase text-neutral-600">
                {dict.project.contributeKicker}
              </h3>
              <p className="m-0">{dict.project.contributeBody}</p>
            </div>
            <div>
              <h3 className="mt-0 mb-2 font-sans text-xs font-bold tracking-[0.08em] uppercase text-neutral-600">
                {dict.project.repository}
              </h3>
              <p className="m-0">
                <a href={project.htmlUrl} target="_blank" rel="noopener noreferrer">
                  {project.fullName}
                </a>
              </p>
            </div>
            <div>
              <h3 className="mt-0 mb-2 font-sans text-xs font-bold tracking-[0.08em] uppercase text-neutral-600">
                {dict.project.licence}
              </h3>
              <p className="m-0">{project.license ?? dict.project.notPublished}</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="github-issues-heading">
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <p className="mb-2 block text-sm font-semibold text-accent-700">
                {dict.project.issuesKicker}
              </p>
              <h2 id="github-issues-heading" className="m-0">
                {dict.project.issuesTitle}
              </h2>
            </div>
            <ArrowLink href={localePath(locale, "/issues")}>{dict.project.allIssues} →</ArrowLink>
          </div>
          {recentIssues.length === 0 ? (
            <div
              className="grid justify-items-start gap-2 rounded-md border border-dashed border-divider-strong bg-paper px-6 py-8"
              role="status"
            >
              <strong className="m-0 font-heading text-lg leading-tight font-semibold">
                {dict.project.noIssues}
              </strong>
            </div>
          ) : (
            <div className="overflow-hidden rounded-md border border-divider bg-paper">
              {recentIssues.map((issue) => (
                <IssueRow key={issue.number} issue={issue} locale={locale} />
              ))}
            </div>
          )}
        </section>

        <section
          className="relative overflow-hidden rounded-md border border-divider bg-paper"
          aria-labelledby="sheet-heading"
        >
          <div className="flex flex-wrap items-center border-b border-divider bg-neutral-100 text-xs leading-6 font-semibold tracking-[0.08em] uppercase text-text">
            <span id="sheet-heading" className="px-6 py-3">
              {dict.project.sheetTitle}
            </span>
            <span className="px-6 py-3">{project.license ?? dict.project.none}</span>
          </div>
          <div className="grid grid-cols-1 min-[801px]:grid-cols-[repeat(3,minmax(0,1fr))]">
            {[
              {
                label: dict.project.repository,
                value: (
                  <a href={project.htmlUrl} target="_blank" rel="noopener noreferrer">
                    {project.fullName}
                  </a>
                ),
              },
              { label: dict.project.openIssues, value: project.openIssueCount },
              { label: dict.project.members, value: project.memberCount },
            ].map((item) => (
              <div
                key={item.label}
                className="min-w-0 p-5 min-[801px]:[&+&]:border-l min-[801px]:[&+&]:border-divider"
              >
                <strong className="mb-2 block text-xs font-semibold tracking-[0.08em] uppercase text-neutral-600">
                  {item.label}
                </strong>
                <span className="block">{item.value}</span>
              </div>
            ))}
          </div>
          <p className="m-0 border-t border-divider px-6 py-3 text-sm leading-6 text-neutral-700">
            {dict.project.lastSync} · {synced}
          </p>
        </section>
      </div>
    </>
  );
}
