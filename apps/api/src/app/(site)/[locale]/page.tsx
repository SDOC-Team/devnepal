"use client";

import { LoadingPanel } from "@/components/modules/common";
import {
  HeroSection,
  JourneySection,
  MembersSection,
  NotBuildingSection,
  ProjectSpotlightSection,
  RecentActivitySection,
} from "@/components/modules/landing";
import { useLocale, useMembers, useProject, useProjectIssues } from "@/hooks";

/** Members shown on the landing preview before linking out to the directory. */
const MEMBER_PREVIEW_COUNT = 8;

export default function HomePage() {
  const { locale, dict } = useLocale();
  const { project, isLoading: projectLoading } = useProject();
  const { issues } = useProjectIssues({ page: 1, perPage: 5 }, project !== null);
  const { members, isLoading: membersLoading } = useMembers();

  if (projectLoading || membersLoading) {
    return <LoadingPanel label={dict.common.loading} />;
  }

  return (
    <>
      <HeroSection dict={dict} locale={locale} />

      <JourneySection dict={dict} />

      <ProjectSpotlightSection dict={dict} locale={locale} project={project} issues={issues} />

      <MembersSection
        dict={dict}
        locale={locale}
        members={members.slice(0, MEMBER_PREVIEW_COUNT)}
      />

      <RecentActivitySection />

      <NotBuildingSection locale={locale} />
    </>
  );
}
