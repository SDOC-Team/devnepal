import type { PublicMemberDto } from "@gov-portal/shared";
import { ArrowRight } from "@phosphor-icons/react";
import { cn } from "cn";

import { MemberCard } from "./MemberCard";

export type MembersSectionProps = {
  /** Anchor id, so nav links can jump to the directory. */
  id?: string;
  title?: string;
  members: PublicMemberDto[];
  loading?: boolean;
  /** Shows a "View all" affordance beside the heading. */
  onViewAll?: () => void;
  /** Message rendered when the list is empty. */
  emptyMessage?: string;
  className?: string;
};

/** Skeleton placeholder matching the card's footprint. */
function CardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-(--color-border-default) bg-[#fcfcfc]">
      <div className="p-4 pb-0">
        <div className="aspect-[325/200] animate-pulse rounded-xl bg-[#f4f4f5]" />
      </div>
      <div className="flex flex-col gap-2 p-4">
        <div className="h-4 w-1/2 animate-pulse rounded bg-[#f4f4f5]" />
        <div className="h-3 w-2/3 animate-pulse rounded bg-[#f4f4f5]" />
        <div className="h-3 w-full animate-pulse rounded bg-[#f4f4f5]" />
      </div>
    </div>
  );
}

/**
 * Members section — Figma "Frame 1000004653" from the Members page.
 * Heading with a trailing action, then a four-column card grid.
 */
export function MembersSection({
  id,
  title = "Members",
  members,
  loading = false,
  onViewAll,
  emptyMessage = "No approved members yet.",
  className,
}: MembersSectionProps) {
  return (
    <section id={id} className={cn("flex w-full flex-col gap-8", className)}>
      <div className="flex items-center justify-between gap-2.5">
        <h2 className="m-0 font-bold text-[24px] text-(--color-text-primary) leading-8">{title}</h2>

        {onViewAll !== undefined ? (
          <button
            type="button"
            onClick={onViewAll}
            className={cn(
              "inline-flex h-8 items-center gap-1 rounded-lg px-3",
              "text-[13px] text-(--color-brand-primary)",
              "hover:bg-(--color-brand-primary-surface)",
              "focus-visible:outline-2 focus-visible:outline-(--color-brand-primary) focus-visible:outline-offset-2",
            )}
          >
            View all
            <ArrowRight aria-hidden size={14} />
          </button>
        ) : null}
      </div>

      {loading ? (
        <div className="grid grid-cols-4 gap-6 max-xl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {[0, 1, 2, 3].map((key) => (
            <CardSkeleton key={key} />
          ))}
        </div>
      ) : members.length === 0 ? (
        <p className="m-0 text-[13px] text-(--color-text-muted)">{emptyMessage}</p>
      ) : (
        <div className="grid grid-cols-4 gap-6 max-xl:grid-cols-3 max-lg:grid-cols-2 max-sm:grid-cols-1">
          {members.map((member) => (
            <MemberCard key={member.githubId} member={member} />
          ))}
        </div>
      )}
    </section>
  );
}
