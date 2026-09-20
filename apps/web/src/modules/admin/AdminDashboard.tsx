import type { AdminMemberDto } from "@gov-portal/shared";
import { Check, EyeSlash, X } from "@phosphor-icons/react";
import { cn } from "cn";
import { useCallback, useEffect, useState } from "react";

import { API_BASE, fetchAdminMembers, type MemberStatus, updateAdminMember } from "../../api";

const FILTERS: { id: MemberStatus | "all"; label: string }[] = [
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
  { id: "hidden", label: "Hidden" },
  { id: "all", label: "All" },
];

const STATUS_STYLES: Record<MemberStatus, string> = {
  pending: "border-[#9a6700] text-[#9a6700]",
  approved: "border-[#1a7f37] text-[#1a7f37]",
  rejected: "border-[#cf222e] text-[#cf222e]",
  hidden: "border-(--color-border-default) text-(--color-text-muted)",
};

export type AdminDashboardProps = {
  className?: string;
};

/**
 * Moderation queue. Lists members by status and applies approve / reject /
 * hide decisions through PATCH /admin/members/{id}.
 */
export function AdminDashboard({ className }: AdminDashboardProps) {
  const [filter, setFilter] = useState<MemberStatus | "all">("pending");
  const [members, setMembers] = useState<AdminMemberDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async (next: MemberStatus | "all") => {
    setLoading(true);
    setError(null);
    try {
      setMembers(await fetchAdminMembers(next === "all" ? undefined : next));
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load(filter);
  }, [filter, load]);

  async function decide(member: AdminMemberDto, status: MemberStatus) {
    setBusyId(member.id);
    setError(null);
    try {
      await updateAdminMember(member.id, { status });
      await load(filter);
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Update failed");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className={cn("flex w-full flex-col gap-6", className)}>
      <div className="flex flex-col gap-1">
        <h1 className="m-0 font-bold text-[28px] text-(--color-text-primary) leading-9">
          Moderation queue
        </h1>
        <p className="m-0 text-[14px] text-(--color-text-muted) leading-5">
          Approve members to publish them in the public directory.
        </p>
      </div>

      {/* Status filters */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setFilter(option.id)}
            aria-pressed={filter === option.id}
            className={cn(
              "h-9 rounded-lg border px-3 text-[14px] transition-colors",
              "focus-visible:outline-2 focus-visible:outline-(--color-brand-primary) focus-visible:outline-offset-2",
              filter === option.id
                ? "border-(--color-brand-primary) bg-(--color-brand-primary) text-white"
                : "border-(--color-border-default) text-(--color-text-primary) hover:bg-(--color-brand-primary-surface)",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {error !== null ? (
        <p className="m-0 rounded-lg border border-[#cf222e] bg-[#ffebe9] p-3 text-[14px]">
          {error}
        </p>
      ) : null}

      {loading ? (
        <p className="m-0 text-[14px] text-(--color-text-muted)">Loading…</p>
      ) : members.length === 0 ? (
        <p className="m-0 text-[14px] text-(--color-text-muted)">Nothing in this queue.</p>
      ) : (
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {members.map((member) => (
            <li
              key={member.id}
              className="flex items-center gap-4 rounded-xl border border-(--color-border-default) p-4 max-sm:flex-col max-sm:items-start"
            >
              {member.avatarUrl !== null ? (
                <img
                  src={`${API_BASE}${member.avatarUrl}`}
                  alt=""
                  className="size-12 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="grid size-12 shrink-0 place-items-center rounded-full bg-[#f4f4f5] font-bold text-(--color-text-muted)">
                  {member.displayName.slice(0, 1).toUpperCase()}
                </div>
              )}

              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate font-bold text-[15px] text-(--color-text-primary)">
                  {member.displayName}
                </span>
                <span className="truncate text-[13px] text-(--color-text-muted)">
                  @{member.githubUsername}
                  {member.headline !== null ? ` · ${member.headline}` : ""}
                </span>
              </div>

              <span
                className={cn(
                  "shrink-0 rounded-full border px-2 py-0.5 text-[12px]",
                  STATUS_STYLES[member.status],
                )}
              >
                {member.status}
              </span>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  disabled={busyId === member.id || member.status === "approved"}
                  onClick={() => void decide(member, "approved")}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#1a7f37] px-3 text-[14px] text-white disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-(--color-brand-primary) focus-visible:outline-offset-2"
                >
                  <Check aria-hidden size={15} />
                  Approve
                </button>

                <button
                  type="button"
                  disabled={busyId === member.id || member.status === "rejected"}
                  onClick={() => void decide(member, "rejected")}
                  className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-(--color-border-default) px-3 text-[14px] text-(--color-text-primary) disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-(--color-brand-primary) focus-visible:outline-offset-2"
                >
                  <X aria-hidden size={15} />
                  Reject
                </button>

                <button
                  type="button"
                  disabled={busyId === member.id || member.status === "hidden"}
                  onClick={() => void decide(member, "hidden")}
                  aria-label={`Hide ${member.displayName}`}
                  className="inline-flex size-9 items-center justify-center rounded-lg border border-(--color-border-default) text-(--color-text-muted) disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-(--color-brand-primary) focus-visible:outline-offset-2"
                >
                  <EyeSlash aria-hidden size={15} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
