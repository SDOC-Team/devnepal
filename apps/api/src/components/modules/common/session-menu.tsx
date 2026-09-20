"use client";

import type { Profile } from "@gov-portal/api-client";
import { GithubLogoIcon, ShieldCheckIcon, SignOutIcon, UserIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useActor } from "@/hooks";
import { signInWithGitHub, signOut } from "@/lib/auth-client";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Status dot colour. Only tokens defined in tailwind.css are used here: the
 * legacy success/attention tokens are not loaded by the current theme, so
 * approved leans on the primary blue rather than an undefined green.
 */
const STATUS_TONE: Record<Profile["status"], string> = {
  pending: "bg-chart-1",
  approved: "bg-primary",
  rejected: "bg-destructive",
  hidden: "bg-muted-foreground",
};

export function SessionMenu({
  locale,
  signInLabel,
  signOutLabel,
  statusLabels,
  greetingLabel,
  profileLabel,
  adminLabel,
}: {
  locale: Locale;
  signInLabel: string;
  signOutLabel: string;
  statusLabels: Record<Profile["status"], string>;
  greetingLabel: string;
  profileLabel: string;
  adminLabel: string;
}) {
  const { actor, isLoading } = useActor();
  const [busy, setBusy] = useState(false);

  if (isLoading) {
    return null;
  }

  if (actor === null) {
    return (
      <Button size="default" onClick={() => void signInWithGitHub(`/${locale}/welcome`)}>
        <GithubLogoIcon data-icon="inline-start" />
        {signInLabel}
      </Button>
    );
  }

  const { member, isAdmin } = actor;
  const initial = member.displayName.slice(0, 1).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={`${greetingLabel} ${member.displayName}`}
        className="relative flex cursor-pointer items-center rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <Avatar>
          {member.avatarUrl === null ? null : <AvatarImage src={member.avatarUrl} alt="" />}
          <AvatarFallback>{initial}</AvatarFallback>
        </Avatar>
        {/* Status reads at a glance without occupying a nav slot of its own. */}
        <span
          aria-hidden="true"
          className={cn(
            "absolute right-0 bottom-0 z-10 size-2.5 rounded-full ring-2 ring-background",
            STATUS_TONE[member.status],
          )}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="min-w-56">
        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar size="lg">
            {member.avatarUrl === null ? null : <AvatarImage src={member.avatarUrl} alt="" />}
            <AvatarFallback>{initial}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="m-0 truncate text-sm font-semibold text-foreground">
              {member.displayName}
            </p>
            <p className="m-0 truncate text-xs text-muted-foreground">@{member.githubUsername}</p>
            <Badge variant="secondary" className="mt-1.5">
              <span
                aria-hidden="true"
                className={cn("size-1.5 rounded-full", STATUS_TONE[member.status])}
              />
              {statusLabels[member.status]}
            </Badge>
          </div>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem render={<Link href={`/${locale}/members/${member.githubUsername}`} />}>
          <UserIcon />
          {profileLabel}
        </DropdownMenuItem>

        {isAdmin ? (
          <DropdownMenuItem render={<Link href={`/${locale}/admin`} />}>
            <ShieldCheckIcon />
            {adminLabel}
          </DropdownMenuItem>
        ) : null}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          variant="destructive"
          disabled={busy}
          onClick={() => {
            setBusy(true);
            signOut().catch((error: unknown) => {
              console.error("Failed to sign out", error);
              setBusy(false);
            });
          }}
        >
          <SignOutIcon />
          {signOutLabel}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
