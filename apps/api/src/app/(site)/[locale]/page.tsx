"use client";

import { ErrorPanel, LoadingPanel } from "@/components/modules/common";
import {
  HeroSection,
  JourneySection,
  MembersSection,
  ProjectSpotlightSection,
  RecentIssuesSection,
} from "@/components/modules/landing";
import { useLocale, useMembers, useProject, useProjectIssues } from "@/hooks";

/** Members shown on the landing preview before linking out to the directory. */
const MEMBER_PREVIEW_COUNT = 8;

export default function HomePage() {
  const { locale, dict } = useLocale();
  const { project, isLoading: projectLoading, error: projectError } = useProject();
  const {
    issues,
    isLoading: issuesLoading,
    error: issuesError,
  } = useProjectIssues({ page: 1, perPage: 5 }, project !== null);
  const { members, isLoading: membersLoading, error: membersError } = useMembers();

  if (projectLoading || membersLoading || (project !== null && issuesLoading)) {
    return <LoadingPanel label={dict.common.loading} />;
  }

  const error = projectError ?? issuesError ?? membersError;
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

  return (
    <>
      <HeroSection dict={dict} locale={locale} />

      <JourneySection dict={dict} />

      <ProjectSpotlightSection dict={dict} locale={locale} project={project} />

      {issues.length > 0 ? (
        <RecentIssuesSection dict={dict} locale={locale} issues={issues} />
      ) : null}

      <MembersSection
        dict={dict}
        locale={locale}
        members={members.slice(0, MEMBER_PREVIEW_COUNT)}
      />
    </>
  );
}
