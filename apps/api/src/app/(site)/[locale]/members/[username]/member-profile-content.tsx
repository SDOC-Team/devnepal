import type { Member } from "@gov-portal/api-client";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { type Dictionary, type Locale, localePath } from "@/lib/i18n";

export function MemberProfileContent({
  profile,
  dict,
  locale,
  isOwner,
}: {
  profile: Member;
  dict: Dictionary;
  locale: Locale;
  isOwner: boolean;
}) {
  const bio = profile.bio?.trim() ?? "";
  const hasSkills = profile.skills.length > 0;
  const hasAffiliation = profile.affiliation !== null;
  const hasLinks = profile.links.length > 0;
  const hasDetails = bio !== "" || hasSkills || hasAffiliation || hasLinks;

  return (
    <section
      aria-labelledby="member-about-heading"
      className="mx-auto w-full max-w-[960px] overflow-hidden rounded-xl border border-border bg-card"
    >
      <div className="border-b border-border px-5 py-4 sm:px-7">
        <h2 id="member-about-heading" className="m-0 text-base font-semibold text-foreground">
          {dict.member.about}
        </h2>
      </div>

      {hasDetails ? (
        <div className="px-5 py-5 sm:px-7 sm:py-6">
          {bio !== "" ? (
            <p className="m-0 max-w-[72ch] whitespace-pre-wrap text-sm leading-7 text-foreground sm:text-base">
              {bio}
            </p>
          ) : null}

          {hasSkills || hasAffiliation || hasLinks ? (
            <dl
              className={`m-0 divide-y divide-border ${bio !== "" ? "mt-6 border-t border-border" : ""}`}
            >
              {hasSkills ? (
                <div className="grid gap-2 py-4 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-5">
                  <dt className="text-sm font-semibold text-foreground">{dict.member.skills}</dt>
                  <dd className="m-0 flex flex-wrap gap-2">
                    {profile.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md border border-border bg-muted/60 px-2.5 py-1 text-xs font-medium text-foreground"
                      >
                        {dict.members.skillNames[skill]}
                      </span>
                    ))}
                  </dd>
                </div>
              ) : null}

              {hasAffiliation ? (
                <div className="grid gap-2 py-4 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-5">
                  <dt className="text-sm font-semibold text-foreground">
                    {dict.member.affiliationLabel}
                  </dt>
                  <dd className="m-0 text-sm leading-6 text-foreground">{profile.affiliation}</dd>
                </div>
              ) : null}

              {hasLinks ? (
                <div className="grid gap-2 py-4 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-5">
                  <dt className="text-sm font-semibold text-foreground">{dict.member.links}</dt>
                  <dd className="m-0 flex min-w-0 flex-wrap gap-2">
                    {profile.links.map((link) => (
                      <a
                        key={link}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="max-w-full break-all rounded-md border border-border bg-muted/60 px-2.5 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      >
                        {link.replace(/^https?:\/\//, "")}
                      </a>
                    ))}
                  </dd>
                </div>
              ) : null}
            </dl>
          ) : null}
        </div>
      ) : (
        <div className="flex min-h-48 flex-col items-start justify-center px-5 py-8 sm:min-h-56 sm:px-7">
          <h3 className="m-0 text-lg font-semibold text-foreground">{dict.member.emptyTitle}</h3>
          <p className="mt-2 mb-0 max-w-[48ch] text-sm leading-6 text-muted-foreground">
            {dict.member.emptyBody}
          </p>
          {isOwner ? (
            <Button
              className="mt-5"
              size="sm"
              variant="outline"
              nativeButton={false}
              render={<Link href={localePath(locale, "/profile")} />}
            >
              {dict.member.addDetails}
            </Button>
          ) : null}
        </div>
      )}
    </section>
  );
}
