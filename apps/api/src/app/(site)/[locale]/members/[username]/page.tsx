import Link from "next/link";
import { notFound } from "next/navigation";

import { MemberAvatar } from "@/components/ui/member-avatar";
import type { Member } from "@/db/schema";
import { getDictionary, isLocale, type Locale, localePath } from "@/lib/i18n";
import { getActor } from "@/server/actor";
import { NotFoundError } from "@/server/errors";
import { toPublicMemberDto } from "@/server/members/dto";
import { getVisibleMemberByUsername } from "@/server/members/service";

export const dynamic = "force-dynamic";

export default async function MemberDetailPage({
  params,
}: {
  params: Promise<{ locale: string; username: string }>;
}) {
  const { locale, username } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  const activeLocale: Locale = locale;
  const dict = getDictionary(activeLocale);

  const viewer = await getActor();
  let member: Member;
  try {
    member = await getVisibleMemberByUsername(username, viewer);
  } catch (error) {
    if (error instanceof NotFoundError) {
      notFound();
    }
    throw error;
  }

  const profile = toPublicMemberDto(member);
  const isOwner = viewer !== null && viewer.id === member.id;
  const isPublic = member.status === "approved";

  return (
    <section className="dn-container dn-github-profile" aria-labelledby="profile-heading">
      {!isPublic && isOwner ? (
        <div className="dn-state-banner is-attention" role="status">
          {dict.profile.status[member.status]}
        </div>
      ) : null}

      <article className="dn-github-profile__card">
        <header className="dn-github-profile__identity">
          <MemberAvatar member={profile} size={112} />
          <div>
            <p className="dn-section-kicker">{dict.member.kicker}</p>
            <h1 id="profile-heading">{profile.displayName}</h1>
            <p className="dn-github-profile__login">@{profile.githubUsername}</p>
            {profile.headline !== null ? <p className="dn-lede">{profile.headline}</p> : null}
            {profile.bio !== null ? (
              <p className="dn-lede" style={{ whiteSpace: "pre-line" }}>
                {profile.bio}
              </p>
            ) : null}
          </div>
        </header>

        <dl className="dn-github-profile__facts">
          {profile.affiliation !== null ? (
            <div>
              <dt>{dict.member.affiliationLabel}</dt>
              <dd>{profile.affiliation}</dd>
            </div>
          ) : null}
          {profile.location !== null ? (
            <div>
              <dt>{dict.member.locationLabel}</dt>
              <dd>{profile.location}</dd>
            </div>
          ) : null}
          {profile.skills.length > 0 ? (
            <div>
              <dt>{dict.member.skills}</dt>
              <dd>{profile.skills.join(", ")}</dd>
            </div>
          ) : null}
        </dl>

        {profile.links.length > 0 ? (
          <section className="public-discovery__link-list" aria-labelledby="links-heading">
            <h2 id="links-heading" style={{ fontSize: "1rem" }}>
              {dict.member.links}
            </h2>
            <ul>
              {profile.links.map((link) => (
                <li key={link}>
                  <a href={link} target="_blank" rel="noopener noreferrer">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <div className="dn-github-profile__actions">
          <a
            className="btn btn--primary"
            href={`https://github.com/${profile.githubUsername}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {dict.member.viewOnGithub}
          </a>
          <p>{dict.member.sharedNote}</p>
        </div>
      </article>

      <p className="dn-github-profile__report">
        <Link href={localePath(activeLocale, "/members")}>← {dict.member.back}</Link>
      </p>
    </section>
  );
}
