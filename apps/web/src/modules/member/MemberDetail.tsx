import type { PublicMemberDto } from "@gov-portal/shared";
import {
  ArrowLeft,
  Buildings,
  GithubLogo,
  LinkSimple,
  MapPin,
  SealCheck,
} from "@phosphor-icons/react";
import { cn } from "cn";

import { API_BASE } from "../../api";

export type MemberDetailProps = {
  member: PublicMemberDto;
  /** Rendered as a back affordance above the profile. */
  onBack?: () => void;
  className?: string;
};

/** Full profile page for a single member. */
export function MemberDetail({ member, onBack, className }: MemberDetailProps) {
  const githubUrl = `https://github.com/${member.githubUsername}`;

  return (
    <article className={cn("flex w-full flex-col gap-8", className)}>
      {onBack !== undefined ? (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex w-fit items-center gap-1.5 text-[14px] text-(--color-brand-primary) hover:underline focus-visible:outline-2 focus-visible:outline-(--color-brand-primary) focus-visible:outline-offset-2"
        >
          <ArrowLeft aria-hidden size={15} />
          Back to directory
        </button>
      ) : null}

      <header className="flex items-start gap-6 max-sm:flex-col max-sm:gap-4">
        {member.avatarUrl !== null ? (
          <img
            src={`${API_BASE}${member.avatarUrl}`}
            alt=""
            className="size-24 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="grid size-24 shrink-0 place-items-center rounded-full bg-[#f4f4f5] font-bold text-[32px] text-(--color-text-muted)">
            {member.displayName.slice(0, 1).toUpperCase()}
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-center gap-2">
            <h1 className="m-0 font-bold text-[32px] text-(--color-text-primary) leading-10 max-sm:text-[24px]">
              {member.displayName}
            </h1>
            <SealCheck
              aria-label="Verified member"
              className="shrink-0 text-(--color-brand-primary)"
              size={24}
              weight="fill"
            />
          </div>

          {member.headline !== null ? (
            <p className="m-0 text-[16px] text-(--color-text-secondary) leading-6">
              {member.headline}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-4 text-[14px] text-(--color-text-muted) leading-5">
            {member.affiliation !== null ? (
              <span className="flex items-center gap-1.5">
                <Buildings aria-hidden size={15} />
                {member.affiliation}
              </span>
            ) : null}
            {member.location !== null ? (
              <span className="flex items-center gap-1.5">
                <MapPin aria-hidden size={15} />
                {member.location}
              </span>
            ) : null}
            <a
              href={githubUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-(--color-brand-primary) hover:underline"
            >
              <GithubLogo aria-hidden size={15} />@{member.githubUsername}
            </a>
          </div>
        </div>
      </header>

      {member.bio !== null ? (
        <section className="flex flex-col gap-2">
          <h2 className="m-0 font-bold text-[16px] text-(--color-text-primary) leading-6">About</h2>
          <p className="m-0 max-w-[760px] whitespace-pre-line text-[15px] text-(--color-text-secondary) leading-[24px]">
            {member.bio}
          </p>
        </section>
      ) : null}

      {member.skills.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h2 className="m-0 font-bold text-[16px] text-(--color-text-primary) leading-6">
            Skills
          </h2>
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {member.skills.map((skill) => (
              <li
                key={skill}
                className="rounded-lg bg-[#f4f4f5] px-3 py-1.5 text-[14px] text-(--color-text-secondary) leading-5"
              >
                {skill}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {member.links.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h2 className="m-0 font-bold text-[16px] text-(--color-text-primary) leading-6">Links</h2>
          <ul className="m-0 flex list-none flex-col gap-2 p-0">
            {member.links.map((link) => (
              <li key={link}>
                <a
                  href={link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-[14px] text-(--color-brand-primary) hover:underline"
                >
                  <LinkSimple aria-hidden size={15} />
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
