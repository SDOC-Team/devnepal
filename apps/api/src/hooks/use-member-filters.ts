import type { PublicMemberDto } from "@gov-portal/shared";
import { SKILLS } from "@gov-portal/shared";
import { useMemo, useState } from "react";

/** Client-side search + skill filtering over an already-fetched member list. */
export function useMemberFilters(members: PublicMemberDto[]) {
  const [query, setQuery] = useState("");
  const [skill, setSkill] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const activeSkill = (SKILLS as readonly string[]).includes(skill) ? skill : undefined;
    return members.filter((member) => {
      if (activeSkill !== undefined && !(member.skills as string[]).includes(activeSkill)) {
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
  }, [members, query, skill]);

  function clear(): void {
    setQuery("");
    setSkill("");
  }

  return { query, setQuery, skill, setSkill, filtered, clear };
}
