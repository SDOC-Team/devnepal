import type { PublicMemberDto } from "@gov-portal/shared";

import { Button } from "@/components/ui/button";
import { MemberCard } from "@/components/ui/member-card";
import type { Dictionary, Locale } from "@/lib/i18n";

/** Directory results, or an empty state offering to clear the filters. */
export function MemberGrid({
  dict,
  locale,
  members,
  onClearFilters,
}: {
  dict: Dictionary;
  locale: Locale;
  members: PublicMemberDto[];
  onClearFilters?: () => void;
}) {
  if (members.length === 0) {
    return (
      <div
        className="grid justify-items-start gap-2 rounded-md border border-dashed border-border bg-card px-6 py-8"
        role="status"
      >
        <strong className="m-0 font-heading text-lg leading-tight font-semibold">
          {dict.members.emptyTitle}
        </strong>
        <p className="m-0 max-w-[62ch]">{dict.members.emptyBody}</p>
        {onClearFilters !== undefined ? (
          <Button variant="outline" onClick={onClearFilters}>
            {dict.members.clear}
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6">
      {members.map((member) => (
        <MemberCard key={member.githubId} dict={dict} locale={locale} member={member} />
      ))}
    </div>
  );
}
