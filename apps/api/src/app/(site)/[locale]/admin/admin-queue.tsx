"use client";

import type { AdminMemberDto } from "@gov-portal/shared";
import { useCallback, useEffect, useState } from "react";

import { MemberAvatar } from "@/components/ui/member-avatar";
import type { Dictionary } from "@/lib/i18n";

const TABS = ["pending", "approved", "rejected", "hidden"] as const;
type Tab = (typeof TABS)[number];

function PriorityEditor({
  member,
  busy,
  labels,
  onSave,
}: {
  member: AdminMemberDto;
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
    <span className="hero__actions" style={{ alignItems: "center" }}>
      <input
        className="form-control"
        type="number"
        aria-label={labels.title}
        value={value}
        style={{ width: "5rem" }}
        onChange={(event) => setValue(event.target.value)}
      />
      <button
        type="button"
        className="btn btn-sm"
        disabled={busy || !valid || parsed === member.priority}
        onClick={() => onSave(parsed)}
      >
        {labels.set}
      </button>
    </span>
  );
}

export function AdminQueue({ dict }: { dict: Dictionary }) {
  const [tab, setTab] = useState<Tab>("pending");
  const [members, setMembers] = useState<AdminMemberDto[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(
    async (nextTab: Tab): Promise<void> => {
      setError(null);
      try {
        const response = await fetch(`/admin/members?status=${nextTab}`, {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`${dict.admin.actionError} (${response.status})`);
        }
        const payload = (await response.json()) as { members: AdminMemberDto[] };
        setMembers(payload.members);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : dict.admin.actionError);
      }
    },
    [dict.admin.actionError],
  );

  useEffect(() => {
    void load(tab);
  }, [tab, load]);

  async function apply(
    target: AdminMemberDto,
    payload: { status?: Tab; priority?: number },
  ): Promise<void> {
    setBusyId(target.id);
    setError(null);
    try {
      const response = await fetch(`/admin/members/${target.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        throw new Error(`${dict.admin.actionError} (${response.status})`);
      }
      await load(tab);
    } catch (applyError) {
      setError(applyError instanceof Error ? applyError.message : dict.admin.actionError);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <div className="dn-catalog-quick">
        <span>{dict.admin.title}</span>
        {TABS.map((entry) => (
          <a
            key={entry}
            href={`?status=${entry}`}
            aria-current={entry === tab ? "true" : undefined}
            onClick={(event) => {
              event.preventDefault();
              setTab(entry);
            }}
          >
            {dict.admin.tabs[entry]}
          </a>
        ))}
      </div>

      {error !== null ? (
        <div className="dn-state-banner is-danger error-summary" role="alert">
          {error}
        </div>
      ) : null}

      {members === null ? (
        <p className="dn-lede">{dict.common.loading}</p>
      ) : members.length === 0 ? (
        <div className="dn-empty" role="status">
          <strong>{dict.admin.noMembers}</strong>
        </div>
      ) : (
        <div className="card blueprint" style={{ padding: 0, overflowX: "auto" }}>
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Member</th>
                <th scope="col">Status</th>
                <th scope="col">{dict.admin.priority}</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((entry) => {
                const busy = busyId === entry.id;
                return (
                  <tr key={entry.id}>
                    <td>
                      <span className="hero__actions" style={{ alignItems: "center" }}>
                        <MemberAvatar member={entry} size={36} />
                        <span>
                          <strong>{entry.displayName}</strong>
                          <br />
                          <span className="dn-issue-meta">@{entry.githubUsername}</span>
                        </span>
                      </span>
                    </td>
                    <td>
                      <span className="Label">{dict.admin.tabs[entry.status]}</span>
                    </td>
                    <td>
                      <PriorityEditor
                        member={entry}
                        busy={busy}
                        labels={{ title: dict.admin.priority, set: dict.admin.setPriority }}
                        onSave={(priority) => void apply(entry, { priority })}
                      />
                    </td>
                    <td>
                      <span className="hero__actions">
                        {entry.status !== "approved" ? (
                          <button
                            type="button"
                            className="btn btn--primary btn-sm"
                            disabled={busy}
                            onClick={() => void apply(entry, { status: "approved" })}
                          >
                            {dict.admin.approve}
                          </button>
                        ) : null}
                        {entry.status !== "rejected" ? (
                          <button
                            type="button"
                            className="btn btn--danger btn-sm"
                            disabled={busy}
                            onClick={() => void apply(entry, { status: "rejected" })}
                          >
                            {dict.admin.reject}
                          </button>
                        ) : null}
                        {entry.status !== "hidden" ? (
                          <button
                            type="button"
                            className="btn btn-sm"
                            disabled={busy}
                            onClick={() => void apply(entry, { status: "hidden" })}
                          >
                            {dict.admin.hide}
                          </button>
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
