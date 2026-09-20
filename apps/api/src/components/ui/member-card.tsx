import type { PublicMemberDto } from "@gov-portal/shared";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { MemberAvatar } from "@/components/ui/member-avatar";
import { type Dictionary, type Locale, localePath } from "@/lib/i18n";

/**
 * Member summary card:
 * - Avatar + name/headline in left, verified badge top-right
 * - Meta row with building + location icons
 * - Bio text (clamped)
 * - Skill labels
 * - "View profile" + "Github" actions
 */
export function MemberCard({
  member,
  dict,
  locale,
  maxSkills = 2,
}: {
  member: PublicMemberDto;
  dict: Dictionary;
  locale: Locale;
  /** Skills shown before the rest collapse into a "+n more" label. */
  maxSkills?: number;
}) {
  const profileHref = localePath(locale, `/members/${member.githubUsername}`);
  const visibleSkills = member.skills.slice(0, maxSkills);
  const hiddenCount = member.skills.length - visibleSkills.length;

  return (
    <article
      className="relative flex flex-col gap-4 rounded-lg border border-divider bg-paper p-6"
      aria-labelledby={`member-${member.githubId}`}
    >
      {/* Head: avatar + identity left, verified badge right */}
      <div className="flex items-start gap-3">
        <span className="relative inline-flex flex-none">
          <MemberAvatar member={member} size={56} />
        </span>

        <div className="min-w-0 flex-1">
          <h3
            id={`member-${member.githubId}`}
            className="m-0 overflow-hidden text-md leading-[1.3] font-semibold text-ellipsis whitespace-nowrap"
          >
            <Link
              href={profileHref}
              className="text-text no-underline hover:text-accent-700 hover:underline"
            >
              {member.displayName}
            </Link>
          </h3>
          {member.headline !== null ? (
            <p className="mt-0.5 mb-0 overflow-hidden text-sm text-ellipsis whitespace-nowrap text-neutral-600">
              {member.headline}
            </p>
          ) : null}
        </div>

        {/* biome-ignore lint/performance/noImgElement: static badge asset */}
        <img
          className="absolute top-4 right-4 flex-none"
          src="/assets/devnepal/images/verified.svg"
          width={24}
          height={24}
          alt={dict.members.discoverable}
          decoding="async"
        />
      </div>

      {/* Meta: affiliation + location with icons */}
      {member.affiliation !== null || member.location !== null ? (
        <p className="m-0 flex flex-nowrap items-center gap-3 text-sm text-neutral-600">
          {member.affiliation !== null ? (
            <span className="inline-flex min-w-0 items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap">
              <svg
                viewBox="0 0 16 16"
                width={14}
                height={14}
                aria-hidden="true"
                focusable="false"
                className="flex-none text-neutral-500"
              >
                <path
                  fill="currentColor"
                  d="M2 14V2.5A1.5 1.5 0 0 1 3.5 1h5A1.5 1.5 0 0 1 10 2.5V6h2.5A1.5 1.5 0 0 1 14 7.5V14h-4v-2.5h-2V14H2Zm2-9h2V3.5H4V5Zm0 3h2V6.5H4V8Zm0 3h2V9.5H4V11Zm4-6h.5V3.5H8V5Zm0 3h.5V6.5H8V8Zm3.5 3H12V9.5h-.5V11Zm0-3H12V6.5h-.5V8Z"
                />
              </svg>
              {member.affiliation}
            </span>
          ) : null}

          {member.affiliation !== null && member.location !== null ? (
            <span className="h-4 w-px flex-none bg-divider-strong" aria-hidden="true" />
          ) : null}

          {member.location !== null ? (
            <span className="inline-flex min-w-0 items-center gap-1 overflow-hidden text-ellipsis whitespace-nowrap">
              <svg
                viewBox="0 0 16 16"
                width={14}
                height={14}
                aria-hidden="true"
                focusable="false"
                className="flex-none text-neutral-500"
              >
                <path
                  fill="currentColor"
                  d="M8 1a5 5 0 0 0-5 5c0 3.6 4.4 8.5 4.6 8.7a.5.5 0 0 0 .8 0C8.6 14.5 13 9.6 13 6a5 5 0 0 0-5-5Zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z"
                />
              </svg>
              {member.location}
            </span>
          ) : null}
        </p>
      ) : null}

      {member.bio !== null ? (
        <p className="m-0 line-clamp-4 text-sm leading-normal text-neutral-700">{member.bio}</p>
      ) : null}

      {member.skills.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {visibleSkills.map((skill) => (
            <span
              key={skill}
              className="rounded-pill bg-neutral-100 px-3 py-1 text-xs leading-[1.35] font-medium whitespace-nowrap text-neutral-800"
            >
              {skill}
            </span>
          ))}
          {hiddenCount > 0 ? (
            <span className="rounded-pill bg-neutral-100 px-3 py-1 text-xs leading-[1.35] font-medium whitespace-nowrap text-neutral-800">
              +{hiddenCount} more
            </span>
          ) : null}
        </div>
      ) : null}

      <div className="mt-auto flex gap-2">
        <Button variant="outline" render={<Link href={profileHref} />}>
          {dict.members.viewProfile}
        </Button>
        <Button
          variant="outline"
          render={
            <a
              href={`https://github.com/${member.githubUsername}`}
              rel="noreferrer"
              target="_blank"
            />
          }
        >
          Github
        </Button>
      </div>
    </article>
  );
}
