import { SKILLS } from "@gov-portal/shared";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MemberAvatar } from "@/components/ui/member-avatar";
import { getDictionary, isLocale, type Locale, localePath } from "@/lib/i18n";
import { toPublicMemberDto } from "@/server/members/dto";
import { listDirectoryMembers } from "@/server/members/service";

export const dynamic = "force-dynamic";

type MembersSearchParams = {
  q?: string;
  skill?: string;
};

export default async function MembersPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<MembersSearchParams>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  const activeLocale: Locale = locale;
  const dict = getDictionary(activeLocale);
  const query = await searchParams;

  const q = typeof query.q === "string" ? query.q.trim().toLowerCase() : "";
  const skill =
    typeof query.skill === "string" && (SKILLS as readonly string[]).includes(query.skill)
      ? query.skill
      : undefined;

  const members = (await listDirectoryMembers()).map(toPublicMemberDto);
  const filtered = members.filter((member) => {
    if (skill !== undefined && !(member.skills as string[]).includes(skill)) {
      return false;
    }
    if (q.length === 0) {
      return true;
    }
    return (
      member.displayName.toLowerCase().includes(q) ||
      member.githubUsername.toLowerCase().includes(q) ||
      (member.headline ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <section
      className="section public-discovery public-discovery--members"
      aria-labelledby="members-heading"
    >
      <div className="container">
        <header className="public-discovery__header">
          <div>
            <p className="dn-section-kicker">{dict.members.kicker}</p>
            <h1 id="members-heading">{dict.members.title}</h1>
            <p className="hero__lead">{dict.members.lede}</p>
          </div>
          <p className="public-discovery__count" role="status">
            {filtered.length} {dict.members.count}
          </p>
        </header>

        <p className="public-discovery__notice">{dict.members.notice}</p>

        <form
          className="filterbar catalog-filter"
          method="get"
          action={localePath(activeLocale, "/members")}
        >
          <div className="filterbar__query">
            <label htmlFor="member-search">{dict.members.searchLabel}</label>
            <input
              id="member-search"
              name="q"
              type="search"
              defaultValue={query.q ?? ""}
              placeholder={dict.members.searchPlaceholder}
            />
          </div>
          <div className="filterbar__query">
            <label htmlFor="member-skill">{dict.members.skillLabel}</label>
            <select id="member-skill" name="skill" defaultValue={skill ?? ""}>
              <option value="">{dict.members.allSkills}</option>
              {SKILLS.map((entry) => (
                <option key={entry} value={entry}>
                  {entry}
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn--primary filterbar__submit" type="submit">
            {dict.members.search}
          </button>
        </form>

        <div className="public-discovery__directory-count" role="status">
          {filtered.length} {dict.members.countMatches}
        </div>

        {filtered.length === 0 ? (
          <div className="dn-empty" role="status">
            <strong>{dict.members.emptyTitle}</strong>
            <p>{dict.members.emptyBody}</p>
            <Link className="btn" href={localePath(activeLocale, "/members")}>
              {dict.members.clear}
            </Link>
          </div>
        ) : (
          <div className="public-discovery__member-grid">
            {filtered.map((member) => (
              <article
                key={member.githubId}
                className="card public-discovery__member-card"
                aria-labelledby={`member-${member.githubId}`}
              >
                <div className="public-discovery__member-title">
                  <MemberAvatar member={member} size={44} />
                  <div>
                    <h2 id={`member-${member.githubId}`}>
                      <Link href={localePath(activeLocale, `/members/${member.githubUsername}`)}>
                        @{member.githubUsername}
                      </Link>
                    </h2>
                    {member.headline !== null ? <p>{member.headline}</p> : null}
                  </div>
                </div>
                {member.location !== null ? (
                  <p className="public-discovery__meta">{member.location}</p>
                ) : null}
                {member.skills.length > 0 ? (
                  <div className="dn-labels">
                    {member.skills.map((entry) => (
                      <span key={entry} className="Label">
                        {entry}
                      </span>
                    ))}
                  </div>
                ) : null}
                <div className="public-discovery__member-footer">
                  <span>{dict.members.discoverable}</span>
                  <Link href={localePath(activeLocale, `/members/${member.githubUsername}`)}>
                    {dict.members.viewProfile}
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
