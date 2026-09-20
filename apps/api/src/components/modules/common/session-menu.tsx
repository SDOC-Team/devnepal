"use client";

import type { Profile } from "@gov-portal/api-client";
import { GithubLogoIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useActor } from "@/hooks";
import { signInWithGitHub, signOut } from "@/lib/auth-client";
import type { Locale } from "@/lib/i18n";

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

  return (
    <>
      <span className="inline-flex min-h-[var(--control-lg)] items-center whitespace-nowrap pr-1 text-sm text-text">
        {greetingLabel} {member.displayName}
      </span>
      <Badge variant="secondary">{statusLabels[member.status]}</Badge>
      <Button variant="outline" size="sm" render={<Link href={`/${locale}/profile`} />}>
        {profileLabel}
      </Button>
      {isAdmin ? (
        <Button variant="outline" size="sm" render={<Link href={`/${locale}/admin`} />}>
          {adminLabel}
        </Button>
      ) : null}
      <Button
        variant="outline"
        size="sm"
        disabled={busy}
        onClick={() => {
          setBusy(true);
          signOut().catch((error: unknown) => {
            console.error("Failed to sign out", error);
            setBusy(false);
          });
        }}
      >
        {signOutLabel}
      </Button>
    </>
  );
}
