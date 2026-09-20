"use client";

import { ErrorPanel, LoadingPanel, PageHeader } from "@/components/modules/common";
import { MemberFilterBar, MemberGrid } from "@/components/modules/members";
import { useLocale, useMemberFilters, useMembers } from "@/hooks";

export default function MembersPage() {
  const { locale, dict } = useLocale();
  const { members, isLoading, error } = useMembers();
  const { query, setQuery, skill, setSkill, filtered, clear } = useMemberFilters(members);

  return (
    <section className="py-12" aria-labelledby="members-heading">
      <div className="container">
        <PageHeader
          aside={
            isLoading ? null : (
              <span role="status">
                {filtered.length} {dict.members.count}
              </span>
            )
          }
          kicker={dict.members.kicker}
          lede={dict.members.lede}
          title={dict.members.title}
          titleId="members-heading"
        />

        {error !== undefined ? (
          <ErrorPanel
            message={error.message}
            retryLabel={dict.common.retry}
            title={dict.common.errorTitle}
            onRetry={() => window.location.reload()}
          />
        ) : isLoading ? (
          <LoadingPanel label={dict.common.loading} />
        ) : (
          <div className="flex flex-col gap-6">
            <MemberFilterBar
              dict={dict}
              onQueryChange={setQuery}
              onSkillChange={setSkill}
              query={query}
              skill={skill}
            />

            <MemberGrid dict={dict} locale={locale} members={filtered} onClearFilters={clear} />
          </div>
        )}
      </div>
    </section>
  );
}
