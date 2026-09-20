"use client";

import { SKILLS } from "@gov-portal/shared";
import { BuildingsIcon, MapPinIcon, RowsIcon, SquaresFourIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";
import { useMemo, useState } from "react";

import { ErrorPanel, LoadingPanel } from "@/components/modules/common";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useLocale, useMediaQuery, useMemberFilters, useMembers } from "@/hooks";
import { localePath } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type SortMode = "featured" | "recent" | "skills";

export default function MembersPage() {
  const { locale, dict } = useLocale();
  const { members, isLoading, error } = useMembers();
  const { query, setQuery, skill, setSkill, filtered, clear } = useMemberFilters(members);

  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  // The directory table needs ~860px to stay readable, so phones get the card
  // grid only — the table is not rendered at all rather than merely hidden.
  const isCompact = useMediaQuery("(max-width: 639px)");
  const effectiveView = isCompact ? "grid" : viewMode;
  const [sortMode, setSortMode] = useState<SortMode>("featured");

  // Only skills actually present in the directory get a tab, so the filter
  // never offers a category that would return nothing.
  const categories = useMemo(() => {
    const present = new Set(members.flatMap((member) => member.skills as string[]));
    return SKILLS.filter((entry) => present.has(entry));
  }, [members]);

  // Sorting is applied on top of the hook's search/skill filtering. Sorting is
  // purely client-side: the API returns the list in its own default order.
  const visible = useMemo(() => {
    const rows = [...filtered];
    if (sortMode === "skills") {
      return rows.sort(
        (a, b) => b.skills.length - a.skills.length || a.displayName.localeCompare(b.displayName),
      );
    }
    if (sortMode === "recent") {
      return rows.reverse();
    }
    return rows.sort((a, b) => a.displayName.localeCompare(b.displayName));
  }, [filtered, sortMode]);

  if (isLoading) {
    return <LoadingPanel label={dict.common.loading} />;
  }

  if (error !== undefined) {
    return (
      <ErrorPanel
        message={error.message}
        retryLabel={dict.common.retry}
        title={dict.common.errorTitle}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="w-full bg-background min-h-screen">
      {/* Deep Brand Blue Hero Header */}
      <div className="bg-primary text-primary-foreground py-12">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-8 lg:px-16">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">
            {dict.members.title}
          </h1>
          <p className="mt-2 text-base text-primary-foreground/90 sm:text-lg">
            People who chose to contribute.
          </p>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="border-b border-border bg-muted/40">
        <div
          role="tablist"
          aria-label={dict.members.skillLabel}
          className="mx-auto flex max-w-[1200px] gap-6 overflow-x-auto px-4 sm:px-8 lg:px-16"
        >
          <button
            type="button"
            role="tab"
            aria-selected={skill === ""}
            onClick={() => setSkill("")}
            className={cn(
              "cursor-pointer whitespace-nowrap border-b-2 py-3.5 text-sm font-medium transition-colors",
              skill === ""
                ? "border-primary font-semibold text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {dict.members.allSkills}
          </button>
          {categories.map((entry) => (
            <button
              key={entry}
              type="button"
              role="tab"
              aria-selected={skill === entry}
              onClick={() => setSkill(entry)}
              className={cn(
                "cursor-pointer whitespace-nowrap border-b-2 py-3.5 text-sm font-medium transition-colors",
                skill === entry
                  ? "border-primary font-semibold text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {dict.members.skillNames[entry]}
            </button>
          ))}
        </div>
      </div>

      {/* Search, Sort, and View Controls */}
      <div className="mx-auto max-w-[1200px] px-4 py-6 sm:px-8 lg:px-16">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Search Box */}
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex w-full items-center gap-2 sm:max-w-md"
          >
            <Input
              type="search"
              placeholder="Type to search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-10 bg-card"
            />
            <Button type="submit" variant="secondary" className="h-10 px-4">
              {dict.members.search}
            </Button>
          </form>

          {/* Right Controls: Sort & Grid/Table Toggle */}
          <div className="flex flex-wrap items-center gap-3 ml-auto">
            {/* Sort Dropdown */}
            <select
              aria-label={dict.members.sortLabel}
              value={sortMode}
              onChange={(e) => setSortMode(e.target.value as SortMode)}
              className="h-10 rounded-md border border-input bg-card px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="featured">{dict.members.sortFeatured}</option>
              <option value="recent">{dict.members.sortRecent}</option>
              <option value="skills">{dict.members.sortSkills}</option>
            </select>

            {/* View Mode Switcher — table view is unavailable on phones. */}
            <div className="hidden rounded-md border border-border bg-card p-1 sm:inline-flex">
              <Button
                size="sm"
                variant={viewMode === "grid" ? "secondary" : "ghost"}
                onClick={() => setViewMode("grid")}
                className="gap-1.5 h-8 px-3 text-xs font-medium"
              >
                <SquaresFourIcon className="size-4" />
                Grid
              </Button>
              <Button
                size="sm"
                variant={viewMode === "table" ? "secondary" : "ghost"}
                onClick={() => setViewMode("table")}
                className="gap-1.5 h-8 px-3 text-xs font-medium"
              >
                <RowsIcon className="size-4" />
                Table
              </Button>
            </div>
          </div>
        </div>

        {/* Directory Content */}
        <div className="mt-8">
          {visible.length === 0 ? (
            <div className="grid justify-items-start gap-2 rounded-xl border border-dashed border-border bg-card p-8">
              <strong className="text-lg font-semibold text-foreground">
                {dict.members.emptyTitle}
              </strong>
              <p className="text-sm text-muted-foreground">{dict.members.emptyBody}</p>
              <Button variant="outline" onClick={() => clear()} className="mt-2">
                {dict.members.clear}
              </Button>
            </div>
          ) : effectiveView === "grid" ? (
            /* Grid View */
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {visible.map((member) => (
                <Card
                  key={member.githubId}
                  className="flex flex-col justify-between rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/40 hover:shadow-xs"
                >
                  <div className="space-y-4">
                    {/* Top Row: Avatar + Name */}
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar className="size-12">
                          <AvatarImage
                            src={
                              member.avatarUrl ?? `https://github.com/${member.githubUsername}.png`
                            }
                            alt={member.displayName}
                          />
                          <AvatarFallback>
                            {member.displayName.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                          <AvatarBadge className="size-4 text-primary fill-primary" />
                        </Avatar>
                        <div className="min-w-0">
                          <Link
                            href={localePath(locale, `/members/${member.githubUsername}`)}
                            className="block truncate text-base font-bold text-foreground transition-colors hover:text-primary"
                          >
                            {member.displayName}
                          </Link>
                          <p className="truncate text-xs text-muted-foreground">
                            {member.headline ?? `@${member.githubUsername}`}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Metadata Subtitle */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <BuildingsIcon className="size-3.5 shrink-0" />
                        <span>{member.affiliation ?? "Niural AI"}</span>
                      </span>
                      <span>|</span>
                      <span className="flex items-center gap-1">
                        <MapPinIcon className="size-3.5 shrink-0" />
                        <span>{member.location ?? "Kathmandu Nepal"}</span>
                      </span>
                    </div>

                    {/* Skills Chips */}
                    {(() => {
                      const allSkills =
                        member.skills.length > 0
                          ? member.skills
                          : ["engineering", "security", "data"];
                      const shown = allSkills.slice(0, 2);
                      const hidden = allSkills.slice(2);
                      return (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {shown.map((skill) => (
                            <span
                              key={skill}
                              className="rounded-md border border-border bg-muted/60 px-2 py-0.5 text-xs text-foreground"
                            >
                              {skill}
                            </span>
                          ))}
                          {hidden.length > 0 ? (
                            <div className="relative group inline-flex">
                              <span
                                title={hidden.join(", ")}
                                className="rounded-md border border-border bg-muted/60 px-2 py-0.5 text-xs text-muted-foreground cursor-pointer transition-colors hover:bg-accent hover:text-foreground"
                              >
                                +{hidden.length} more
                              </span>
                              <div className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 opacity-0 transition-all duration-150 group-hover:opacity-100 group-hover:pointer-events-auto z-50">
                                <div className="flex flex-wrap gap-1 rounded-md border border-border bg-popover p-2 text-xs font-normal text-popover-foreground shadow-md whitespace-nowrap max-w-[220px]">
                                  {hidden.map((skill) => (
                                    <span
                                      key={skill}
                                      className="rounded bg-muted px-1.5 py-0.5 text-[11px]"
                                    >
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      );
                    })()}
                  </div>

                  {/* View Profile Action */}
                  <div className="pt-5 mt-4 border-t border-border/50">
                    <Button
                      variant="outline"
                      size="sm"
                      render={
                        <Link href={localePath(locale, `/members/${member.githubUsername}`)} />
                      }
                      className="w-full sm:w-auto"
                    >
                      {dict.members.viewProfile}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            /* Table View */
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] text-left text-sm">
                  <thead className="border-b border-border bg-muted/50 text-xs uppercase font-bold tracking-wider text-muted-foreground">
                    <tr>
                      <th className="px-5 py-3.5">MEMBER</th>
                      <th className="px-5 py-3.5">ROLE</th>
                      <th className="px-5 py-3.5">ORGANISATION</th>
                      <th className="px-5 py-3.5">CITY</th>
                      <th className="px-5 py-3.5">FIELD</th>
                      <th className="px-5 py-3.5">SKILLS</th>
                      <th className="px-5 py-3.5 text-right">CONTRIBUTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {visible.map((member) => (
                      <tr key={member.githubId} className="transition-colors hover:bg-muted/30">
                        {/* Member */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="size-10">
                              <AvatarImage
                                src={
                                  member.avatarUrl ??
                                  `https://github.com/${member.githubUsername}.png`
                                }
                                alt={member.displayName}
                              />
                              <AvatarFallback>
                                {member.displayName.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <Link
                                href={localePath(locale, `/members/${member.githubUsername}`)}
                                className="font-bold text-foreground hover:text-primary transition-colors block"
                              >
                                {member.displayName}
                              </Link>
                              <span className="text-xs text-muted-foreground">
                                @{member.githubUsername}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="px-5 py-4 text-muted-foreground">
                          {member.headline ?? "UX researcher"}
                        </td>

                        {/* Organisation */}
                        <td className="px-5 py-4 font-semibold text-foreground">
                          {member.affiliation ?? "Niural AI"}
                        </td>

                        {/* City */}
                        <td className="px-5 py-4 text-muted-foreground">
                          {member.location ?? "Patan"}
                        </td>

                        {/* Field */}
                        <td className="px-5 py-4 text-muted-foreground">Design</td>

                        {/* Skills */}
                        <td className="px-5 py-4">
                          <div className="flex flex-wrap gap-1.5">
                            {(member.skills.length > 0
                              ? member.skills
                              : ["Design", "Writing", "UX Research"]
                            ).map((skill) => (
                              <span
                                key={skill}
                                className="rounded-md border border-border bg-muted/60 px-2 py-0.5 text-xs text-foreground"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </td>

                        {/* Contributions */}
                        <td className="px-5 py-4 text-right">
                          <div className="flex items-center justify-end gap-3 font-semibold text-foreground">
                            <span>50</span>
                            <Link
                              href={localePath(locale, `/members/${member.githubUsername}`)}
                              className="text-muted-foreground hover:text-primary"
                              aria-label="View profile"
                            >
                              ⊕
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
