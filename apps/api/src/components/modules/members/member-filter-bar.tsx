"use client";

import { SKILLS } from "@gov-portal/shared";
import type { ChangeEvent } from "react";

import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import type { Dictionary } from "@/lib/i18n";

/** Search and skill filter for the member directory. Filters client-side —
 * no navigation, since the full directory is already in the SWR cache. */
export function MemberFilterBar({
  dict,
  query,
  skill,
  onQueryChange,
  onSkillChange,
}: {
  dict: Dictionary;
  query: string;
  skill: string;
  onQueryChange: (value: string) => void;
  onSkillChange: (value: string) => void;
}) {
  return (
    <search>
      <form
        className="grid grid-cols-1 gap-4 rounded-md border border-border bg-card p-4 sm:grid-cols-2"
        onSubmit={(event) => event.preventDefault()}
      >
        <Field>
          <FieldLabel htmlFor="member-search">{dict.members.searchLabel}</FieldLabel>
          <Input
            id="member-search"
            type="search"
            value={query}
            placeholder={dict.members.searchPlaceholder}
            onChange={(event: ChangeEvent<HTMLInputElement>) => onQueryChange(event.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="member-skill">{dict.members.skillLabel}</FieldLabel>
          {/* Native select: the directory filter benefits from the platform
              control's keyboard and mobile behaviour more than from a custom
              listbox. */}
          <select
            id="member-skill"
            value={skill}
            onChange={(event: ChangeEvent<HTMLSelectElement>) => onSkillChange(event.target.value)}
            className="h-9 w-full min-w-0 rounded-md border border-input bg-card px-2.5 py-1 text-sm text-foreground shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="">{dict.members.allSkills}</option>
            {SKILLS.map((entry) => (
              <option key={entry} value={entry}>
                {entry}
              </option>
            ))}
          </select>
        </Field>
      </form>
    </search>
  );
}
