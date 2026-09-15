import type { PublicMemberDto } from "@gov-portal/shared";

import { ArrowLink, SectionHeading } from "@/components/modules/common";
import { MemberCard } from "@/components/ui/member-card";
import { type Dictionary, type Locale, localePath } from "@/lib/i18n";

/** Member directory preview. Hidden entirely when no members are approved. */
export function MembersSection({
  dict,
  locale,
  members,
}: {
  dict: Dictionary;
  locale: Locale;
  members: PublicMemberDto[];
}) {
  if (members.length === 0) {
    return null;
  }

  return (
    <section className="py-12" aria-labelledby="members-heading">
      <div className="container">
        <SectionHeading
          title={dict.home.contributorsTitle}
          titleId="members-heading"
          action={
            <ArrowLink href={localePath(locale, "/members")}>
              {dict.home.viewAllContributors}
            </ArrowLink>
          }
        />

        <div className="grid grid-cols-1 gap-6 min-[521px]:grid-cols-2 min-[1081px]:grid-cols-4">
          {members.map((member) => (
            <MemberCard key={member.githubId} dict={dict} locale={locale} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
