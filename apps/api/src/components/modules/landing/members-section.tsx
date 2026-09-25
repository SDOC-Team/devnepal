import type { PublicMemberDto } from "@gov-portal/shared";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { MemberCard } from "@/components/ui/member-card";
import { type Dictionary, type Locale, localePath } from "@/lib/i18n";

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
    <section
      id="members"
      data-slot="members"
      className="flex scroll-mt-4 flex-col gap-6 px-4 py-12 sm:px-8 lg:px-16 lg:py-16"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">{dict.home.membersTitle}</h2>
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          render={<Link href={localePath(locale, "/members")} />}
        >
          {dict.home.viewAllMembers}
        </Button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((member) => (
          <MemberCard key={member.githubId} dict={dict} locale={locale} member={member} />
        ))}
      </div>
    </section>
  );
}
