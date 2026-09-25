"use client";

import Link from "next/link";

import { ArrowLink, ErrorPanel, LoadingPanel } from "@/components/modules/common";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";
import { IssueRow } from "@/components/ui/issue-row";
import { useLocale, useProject, useProjectIssues } from "@/hooks";
import { formatDateTime } from "@/lib/format";
import { localePath } from "@/lib/i18n";

export default function ProjectPage() {
  const { locale, dict } = useLocale();
  const { project, isLoading: projectLoading, error } = useProject();
  const { issues: recentIssues } = useProjectIssues({ page: 1, perPage: 8 }, project !== null);

  if (projectLoading) {
    return <LoadingPanel label={dict.common.loading} layout="detail" />;
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
            className="grid justify-items-start gap-2 rounded-xl border border-dashed border-border bg-card px-6 py-8"
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
      ? formatDateTime(project.lastSyncedAt, locale)
      : dict.project.never;

  return (
    <section className="py-12" aria-labelledby="project-heading">
      <div className="container">
        <nav
          className="mb-6 flex flex-wrap gap-2 text-sm text-muted-foreground"
          aria-label={dict.project.kicker}
        >
          <Link href={localePath(locale, "/")} className="text-primary no-underline">
            {dict.brand}
          </Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{project.title}</span>
        </nav>

        {/* Repo identity, stats, status and actions read as one object, so they
            share a single card rather than floating as separate blocks. */}
        <Card className="mb-10 gap-0 px-8">
          <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
            <div className="min-w-0">
              <p className="m-0 text-sm font-semibold text-primary">{owner} /</p>
              <h1
                id="project-heading"
                className="m-0 mt-1 text-3xl leading-[1.08] tracking-[-0.01em]"
              >
                {name ?? project.fullName}
              </h1>
              <p className="mt-3 mb-0 max-w-[68ch] text-base leading-[1.55] text-muted-foreground">
                {project.description ?? dict.project.none}
              </p>
            </div>

            <dl
              className="m-0 flex flex-none gap-6 whitespace-nowrap"
              aria-label={dict.project.aboutTitle}
            >
              <div className="flex flex-col-reverse">
                <dt className="text-sm text-muted-foreground">{dict.project.openIssues}</dt>
                <dd className="m-0 font-heading text-2xl font-semibold">
                  {project.openIssueCount}
                </dd>
              </div>
              <div className="flex flex-col-reverse">
                <dt className="text-sm text-muted-foreground">{dict.project.members}</dt>
                <dd className="m-0 font-heading text-2xl font-semibold">{project.memberCount}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-5">
            <Chip tone="outline">{dict.project.publicLabel}</Chip>
            <Chip tone="success">{dict.project.openLabel}</Chip>
            <span className="text-sm text-muted-foreground">
              <strong className="font-semibold text-foreground">{dict.project.lastSync}</strong>{" "}
              {synced}
            </span>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Button render={<Link href={localePath(locale, "/issues")} />}>
              {dict.project.chooseIssue}
            </Button>
            <Button
              variant="outline"
              render={<a href={project.htmlUrl} target="_blank" rel="noopener noreferrer" />}
            >
              {dict.project.viewOnGitHub}
            </Button>
            <p className="m-0 text-sm text-muted-foreground">{dict.project.githubSourceNote}</p>
          </div>
        </Card>

        <div className="grid gap-8">
          <section aria-labelledby="about-heading">
            <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <p className="mb-2 block text-sm font-semibold text-primary">
                  {dict.project.aboutKicker}
                </p>
                <h2 id="about-heading" className="m-0">
                  {dict.project.aboutTitle}
                </h2>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="px-6">
                <h3 className="mt-0 mb-2 font-sans text-xs font-bold tracking-[0.08em] uppercase text-muted-foreground">
                  {dict.project.contributeKicker}
                </h3>
                <p className="m-0 text-sm leading-[1.6]">{dict.project.contributeBody}</p>
              </Card>
              <Card className="px-6">
                <h3 className="mt-0 mb-2 font-sans text-xs font-bold tracking-[0.08em] uppercase text-muted-foreground">
                  {dict.project.repository}
                </h3>
                <p className="m-0 text-sm leading-[1.6]">
                  <a href={project.htmlUrl} target="_blank" rel="noopener noreferrer">
                    {project.fullName}
                  </a>
                </p>
              </Card>
              <Card className="px-6">
                <h3 className="mt-0 mb-2 font-sans text-xs font-bold tracking-[0.08em] uppercase text-muted-foreground">
                  {dict.project.licence}
                </h3>
                <p className="m-0 text-sm leading-[1.6]">
                  {project.license ?? dict.project.notPublished}
                </p>
              </Card>
            </div>
          </section>

          <section aria-labelledby="github-issues-heading">
            <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
              <div>
                <p className="mb-2 block text-sm font-semibold text-primary">
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
                className="grid justify-items-start gap-2 rounded-xl border border-dashed border-border bg-card px-6 py-8"
                role="status"
              >
                <strong className="m-0 font-heading text-lg leading-tight font-semibold">
                  {dict.project.noIssues}
                </strong>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-border bg-card">
                {recentIssues.map((issue) => (
                  <IssueRow key={issue.number} issue={issue} locale={locale} />
                ))}
              </div>
            )}
          </section>

          <section
            className="relative overflow-hidden rounded-xl border border-border bg-card"
            aria-labelledby="sheet-heading"
          >
            <div className="flex flex-wrap items-center border-b border-border bg-muted text-xs leading-6 font-semibold tracking-[0.08em] uppercase text-foreground">
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
                  className="min-w-0 p-5 min-[801px]:[&+&]:border-l min-[801px]:[&+&]:border-border"
                >
                  <strong className="mb-2 block text-xs font-semibold tracking-[0.08em] uppercase text-muted-foreground">
                    {item.label}
                  </strong>
                  <span className="block">{item.value}</span>
                </div>
              ))}
            </div>
            <p className="m-0 border-t border-border px-6 py-3 text-sm leading-6 text-muted-foreground">
              {dict.project.lastSync} · {synced}
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
