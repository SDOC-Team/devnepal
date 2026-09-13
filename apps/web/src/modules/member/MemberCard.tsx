import type { PublicMemberDto } from "@gov-portal/shared";
import { ArrowSquareOut, Buildings, GithubLogo, MapPin, SealCheck } from "@phosphor-icons/react";
import { cn } from "cn";

import { API_BASE, type MemberStatus } from "../../api";

export type MemberCardProps = {
  member: PublicMemberDto;
  /** Skills shown before collapsing into a "+n more" badge. */
  maxSkills?: number;
  /**
   * Moderation status. Approved members get the verified seal.
   * Public listings only ever return approved members, so this defaults
   * to "approved"; the admin dashboard passes the real status.
   */
  status?: MemberStatus;
  className?: string;
};

/**
 * Member card — circular avatar beside the name, meta row, a bio clamped to
 * three lines, skill pills, then profile actions.
 */
export function MemberCard({
  member,
  maxSkills = 2,
  status = "approved",
  className,
}: MemberCardProps) {
  const visibleSkills = member.skills.slice(0, maxSkills);
  const hiddenCount = member.skills.length - visibleSkills.length;
  const profileUrl = `https://github.com/${member.githubUsername}`;
  const isApproved = status === "approved";
  const hasMeta = member.affiliation !== null || member.location !== null;

  return (
    <article
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-(--color-border-default) bg-(--color-surface-default) p-5",
        "transition-shadow hover:shadow-md",
        className,
      )}
    >
      {/* Identity */}
      <div className="flex items-start gap-4">
        {member.avatarUrl !== null ? (
          <img
            src={`${API_BASE}${member.avatarUrl}`}
            alt=""
            loading="lazy"
            className="size-14 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="grid size-14 shrink-0 place-items-center rounded-full bg-[#f4f4f5] font-bold text-[20px] text-(--color-text-muted)">
            {member.displayName.slice(0, 1).toUpperCase()}
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <h3 className="m-0 truncate font-bold text-[18px] text-(--color-text-primary) leading-6">
            {member.displayName}
          </h3>
          {member.headline !== null ? (
            <p className="m-0 truncate text-[14px] text-(--color-text-secondary) leading-5">
              {member.headline}
            </p>
          ) : null}
        </div>

        {isApproved ? (
          <SealCheck
            aria-label="Verified member"
            className="shrink-0 text-(--color-brand-primary)"
            size={20}
            weight="fill"
          />
        ) : null}
      </div>

      {/* Affiliation / location */}
      {hasMeta ? (
        <div className="flex items-center gap-2 text-[13px] text-(--color-text-muted) leading-5">
          {member.affiliation !== null ? (
            <span className="flex min-w-0 items-center gap-1.5">
              <Buildings aria-hidden className="shrink-0" size={14} />
              <span className="truncate">{member.affiliation}</span>
            </span>
          ) : null}

          {member.affiliation !== null && member.location !== null ? (
            <span aria-hidden className="h-4 w-px shrink-0 bg-(--color-border-default)" />
          ) : null}

          {member.location !== null ? (
            <span className="flex min-w-0 items-center gap-1.5">
              <MapPin aria-hidden className="shrink-0" size={14} />
              <span className="truncate">{member.location}</span>
            </span>
          ) : null}
        </div>
      ) : null}

      {/* Bio — clamped to three lines */}
      {member.bio !== null ? (
        <p className="m-0 line-clamp-3 text-[14px] text-(--color-text-secondary) leading-[22px]">
          {member.bio}
        </p>
      ) : null}

      {/* Skills */}
      {member.skills.length > 0 ? (
        <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
          {visibleSkills.map((skill) => (
            <li
              key={skill}
              className="rounded-lg bg-[#f4f4f5] px-3 py-1.5 text-[13px] text-(--color-text-secondary) leading-5"
            >
              {skill}
            </li>
          ))}
          {hiddenCount > 0 ? (
            <li className="rounded-lg bg-[#f4f4f5] px-3 py-1.5 text-[13px] text-(--color-text-muted) leading-5">
              +{hiddenCount} more
            </li>
          ) : null}
        </ul>
      ) : null}

      {/* Actions */}
      <div className="mt-auto flex items-center gap-3 pt-1">
        <a
          href={`/members/${member.githubUsername}`}
          className={cn(
            "inline-flex h-9 items-center gap-1.5 rounded-lg border border-(--color-border-default) px-3",
            "text-[14px] text-(--color-text-primary)",
            "hover:bg-(--color-brand-primary-surface)",
            "focus-visible:outline-2 focus-visible:outline-(--color-brand-primary) focus-visible:outline-offset-2",
          )}
        >
          <ArrowSquareOut aria-hidden size={15} />
          View profile
        </a>

        <a
          href={profileUrl}
          target="_blank"
          rel="noreferrer"
          aria-label={`${member.displayName} on GitHub`}
          className={cn(
            "inline-flex h-9 items-center gap-1.5 rounded-lg border border-(--color-border-default) px-3",
            "text-[14px] text-(--color-text-primary)",
            "hover:bg-(--color-brand-primary-surface)",
            "focus-visible:outline-2 focus-visible:outline-(--color-brand-primary) focus-visible:outline-offset-2",
          )}
        >
          <GithubLogo aria-hidden size={15} />
          Github
        </a>
      </div>
    </article>
  );
}
