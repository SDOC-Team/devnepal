"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";

import { ErrorPanel, LoadingPanel, StateBanner } from "@/components/modules/common";
import { Button } from "@/components/ui/button";
import { MemberAvatar } from "@/components/ui/member-avatar";
import { useActor, useLocale, useMember } from "@/hooks";
import { ApiError } from "@/lib/api-error";
import { localePath } from "@/lib/i18n";

export default function MemberDetailPage() {
  const { locale, dict } = useLocale();
  const { username } = useParams<{ username: string }>();
  const { member: profile, isLoading, error } = useMember(username);
  const { actor } = useActor();

  if (error instanceof ApiError && error.status === 404) {
    notFound();
  }

  if (isLoading) {
    return <LoadingPanel label={dict.common.loading} />;
  }

  if (error !== undefined || profile === undefined) {
    return (
      <ErrorPanel
        message={error?.message ?? dict.common.errorTitle}
        retryLabel={dict.common.retry}
        title={dict.common.errorTitle}
        onRetry={() => window.location.reload()}
      />
    );
  }

  const isOwner = actor !== null && actor.member.githubId === profile.githubId;
  const isPending = actor !== null && isOwner && actor.member.status !== "approved";

  const facts = [
    profile.affiliation !== null
      ? { label: dict.member.affiliationLabel, value: profile.affiliation }
      : null,
    profile.location !== null
      ? { label: dict.member.locationLabel, value: profile.location }
      : null,
    profile.skills.length > 0
      ? { label: dict.member.skills, value: profile.skills.join(", ") }
      : null,
  ].filter((fact) => fact !== null);

  return (
    <section
      className="mx-auto w-[calc(100%-var(--page-gutter)*2)] max-w-[780px] pt-16 pb-24"
      aria-labelledby="profile-heading"
    >
      {isPending ? (
        <StateBanner tone="attention" role="status" className="mb-6">
          {dict.profile.status[actor.member.status]}
        </StateBanner>
      ) : null}

      <article className="overflow-hidden rounded-md border border-divider bg-paper">
        <header className="grid grid-cols-1 gap-6 border-b border-divider p-8 min-[641px]:grid-cols-[112px_minmax(0,1fr)]">
          <MemberAvatar member={profile} size={112} />
          <div>
            <p className="mb-2 block text-sm font-semibold text-accent-700">{dict.member.kicker}</p>
            <h1 id="profile-heading" className="m-0">
              {profile.displayName}
            </h1>
            <p className="mt-[3px] mb-4 text-neutral-700">@{profile.githubUsername}</p>
            {profile.headline !== null ? (
              <p className="max-w-[68ch] text-md leading-[1.55] text-neutral-700">
                {profile.headline}
              </p>
            ) : null}
            {profile.bio !== null ? (
              <p className="max-w-[68ch] text-md leading-[1.55] whitespace-pre-line text-neutral-700">
                {profile.bio}
              </p>
            ) : null}
          </div>
        </header>

        {facts.length > 0 ? (
          <dl className="m-0 grid grid-cols-[repeat(2,minmax(0,1fr))]">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="border-b border-divider px-8 py-5 even:border-l even:border-l-divider"
              >
                <dt className="text-xs uppercase text-neutral-700">{fact.label}</dt>
                <dd className="mt-2 mr-0 mb-0 ml-0 font-heading text-md font-semibold">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        {profile.links.length > 0 ? (
          <section className="px-8 py-5" aria-labelledby="links-heading">
            <h2 id="links-heading" className="text-base">
              {dict.member.links}
            </h2>
            <ul className="m-0 grid list-none gap-3 p-0">
              {profile.links.map((link) => (
                <li key={link} className="border-b border-divider py-3">
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="px-8 py-6">
          <Button
            render={
              <a
                href={`https://github.com/${profile.githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            {dict.member.viewOnGithub}
          </Button>
          <p className="mt-3 mb-0 text-sm text-neutral-700">{dict.member.sharedNote}</p>
        </div>
      </article>

      <p className="mt-6 text-sm text-neutral-700">
        <Link href={localePath(locale, "/members")}>← {dict.member.back}</Link>
      </p>
    </section>
  );
}
