"use client";

import type { SelfMemberDto } from "@gov-portal/shared";
import Link from "next/link";
import { useEffect, useState } from "react";

import { signInWithGitHub, signOut } from "@/lib/auth-client";
import type { Locale } from "@/lib/i18n";

type ProfilePayload = {
  member: SelfMemberDto;
  isAdmin: boolean;
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
  statusLabels: Record<SelfMemberDto["status"], string>;
  greetingLabel: string;
  profileLabel: string;
  adminLabel: string;
}) {
  const [member, setMember] = useState<SelfMemberDto | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/profile", { credentials: "include" })
      .then(async (response) => {
        if (!response.ok) {
          return null;
        }
        return (await response.json()) as ProfilePayload;
      })
      .then((payload) => {
        if (!cancelled) {
          setMember(payload?.member ?? null);
          setIsAdmin(payload?.isAdmin ?? false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMember(null);
          setIsAdmin(false);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoaded(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!loaded) {
    return null;
  }

  if (member === null) {
    return (
      <button
        className="btn btn-sm dn-signin"
        type="button"
        onClick={() => void signInWithGitHub(`/${locale}/welcome`)}
      >
        {signInLabel}
      </button>
    );
  }

  return (
    <>
      <span className="dn-greeting">
        {greetingLabel} {member.displayName}
      </span>
      <span className="Label Label--secondary">{statusLabels[member.status]}</span>
      <Link className="btn btn-sm" href={`/${locale}/profile`}>
        {profileLabel}
      </Link>
      {isAdmin ? (
        <Link className="btn btn-sm" href={`/${locale}/admin`}>
          {adminLabel}
        </Link>
      ) : null}
      <button
        className="btn btn-sm"
        type="button"
        disabled={busy}
        onClick={() => {
          setBusy(true);
          signOut().catch(() => setBusy(false));
        }}
      >
        {signOutLabel}
      </button>
    </>
  );
}
