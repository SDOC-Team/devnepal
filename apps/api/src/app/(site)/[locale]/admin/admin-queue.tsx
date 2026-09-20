"use client";

import type { AdminMember } from "@gov-portal/api-client";
import { useEffect, useState } from "react";

import { ErrorPanel, LoadingPanel, StateBanner } from "@/components/modules/common";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Input } from "@/components/ui/input";
import { MemberAvatar } from "@/components/ui/member-avatar";
import { ADMIN_TABS, type AdminTab, useAdminMembers } from "@/hooks";
import type { Dictionary } from "@/lib/i18n";

const CELL = "border-b border-divider px-4 py-3 align-middle";
const HEAD_CELL =
  "border-b border-divider px-4 py-3 text-left text-xs font-semibold tracking-[0.08em] uppercase text-neutral-600";

function PriorityEditor({
  member,
  busy,
  labels,
  onSave,
}: {
  member: AdminMember;
  busy: boolean;
  labels: { title: string; set: string };
  onSave: (priority: number) => void;
}) {
  const [value, setValue] = useState(String(member.priority));

  useEffect(() => {
    setValue(String(member.priority));
  }, [member.priority]);

  const parsed = Number(value);
  const valid = value.trim() !== "" && Number.isInteger(parsed);

  return (
    <span className="flex flex-wrap items-center gap-3">
      <Input
        type="number"
        aria-label={labels.title}
        value={value}
        className="w-20"
        onChange={(event) => setValue(event.target.value)}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={busy || !valid || parsed === member.priority}
        onClick={() => onSave(parsed)}
      >
        {labels.set}
      </Button>
    </span>
  );
}

export function AdminQueue({ dict }: { dict: Dictionary }) {
  const [tab, setTab] = useState<AdminTab>("pending");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const { members, isLoading, error, update } = useAdminMembers(tab);

  async function apply(
    target: AdminMember,
    patch: { status?: AdminTab; priority?: number },
  ): Promise<void> {
    setBusyId(target.id);
    setActionError(null);
    try {
      await update(target.id, patch);
    } catch (applyError) {
      setActionError(applyError instanceof Error ? applyError.message : dict.admin.actionError);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-1 text-sm font-semibold text-neutral-600">{dict.admin.title}</span>
        {ADMIN_TABS.map((entry) => (
          <a
            key={entry}
            href={`?status=${entry}`}
            aria-current={entry === tab ? "true" : undefined}
            onClick={(event) => {
              event.preventDefault();
              setTab(entry);
            }}
            className="inline-flex min-h-[var(--control-sm)] items-center rounded-pill border border-divider-strong px-3 text-sm text-text no-underline hover:bg-neutral-100 aria-[current=true]:border-accent-700 aria-[current=true]:bg-accent-100 aria-[current=true]:text-accent-800"
          >
            {dict.admin.tabs[entry]}
          </a>
        ))}
      </div>

      {actionError !== null ? (
        <StateBanner tone="danger" role="alert">
          <span className="text-error">{actionError}</span>
        </StateBanner>
      ) : null}

      {error !== undefined ? (
        <ErrorPanel
          message={error.message}
          retryLabel={dict.common.retry}
          title={dict.common.errorTitle}
          onRetry={() => window.location.reload()}
        />
      ) : isLoading ? (
        <LoadingPanel label={dict.common.loading} />
      ) : members.length === 0 ? (
        <div
          className="grid justify-items-start gap-2 rounded-md border border-dashed border-divider-strong bg-paper px-6 py-8"
          role="status"
        >
          <strong className="m-0 font-heading text-lg leading-tight font-semibold">
            {dict.admin.noMembers}
          </strong>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border border-divider bg-paper">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr>
                <th scope="col" className={HEAD_CELL}>
                  Member
                </th>
                <th scope="col" className={HEAD_CELL}>
                  Status
                </th>
                <th scope="col" className={HEAD_CELL}>
                  {dict.admin.priority}
                </th>
                <th scope="col" className={HEAD_CELL}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {members.map((entry) => {
                const busy = busyId === entry.id;
                return (
                  <tr key={entry.id} className="hover:bg-neutral-100 last:[&>td]:border-b-0">
                    <td className={CELL}>
                      <span className="flex flex-wrap items-center gap-3">
                        <MemberAvatar member={entry} size={36} />
                        <span>
                          <strong>{entry.displayName}</strong>
                          <br />
                          <span className="text-sm text-neutral-700">@{entry.githubUsername}</span>
                        </span>
                      </span>
                    </td>
                    <td className={CELL}>
                      <Chip>{dict.admin.tabs[entry.status]}</Chip>
                    </td>
                    <td className={CELL}>
                      <PriorityEditor
                        member={entry}
                        busy={busy}
                        labels={{ title: dict.admin.priority, set: dict.admin.setPriority }}
                        onSave={(priority) => void apply(entry, { priority })}
                      />
                    </td>
                    <td className={CELL}>
                      <span className="flex flex-wrap gap-3">
                        {entry.status !== "approved" ? (
                          <Button
                            type="button"
                            size="sm"
                            disabled={busy}
                            onClick={() => void apply(entry, { status: "approved" })}
                          >
                            {dict.admin.approve}
                          </Button>
                        ) : null}
                        {entry.status !== "rejected" ? (
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            disabled={busy}
                            onClick={() => void apply(entry, { status: "rejected" })}
                          >
                            {dict.admin.reject}
                          </Button>
                        ) : null}
                        {entry.status !== "hidden" ? (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={busy}
                            onClick={() => void apply(entry, { status: "hidden" })}
                          >
                            {dict.admin.hide}
                          </Button>
                        ) : null}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
