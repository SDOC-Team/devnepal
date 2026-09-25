"use client";

import {
  BriefcaseIcon,
  CheckCircleIcon,
  GithubLogoIcon,
  MapPinIcon,
  PencilIcon,
  ShareNetworkIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";

import { ErrorPanel, LoadingPanel, StateBanner } from "@/components/modules/common";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { MemberAvatar } from "@/components/ui/member-avatar";
import { useActor, useLocale, useMember } from "@/hooks";
import { ApiError } from "@/lib/api-error";
import { localePath } from "@/lib/i18n";

import { MemberProfileContent } from "./member-profile-content";

export default function MemberDetailPage() {
  const { locale, dict } = useLocale();
  const { username } = useParams<{ username: string }>();
  const { member: profile, isLoading, error } = useMember(username);
  const { actor } = useActor();
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: profile?.displayName ?? "Member Profile",
          url,
        });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        console.error("Native profile sharing failed; falling back to clipboard", error);
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Copying the profile URL failed", error);
    }
  };

  if (error instanceof ApiError && error.status === 404) {
    notFound();
  }

  if (isLoading) {
    return <LoadingPanel label={dict.common.loading} layout="detail" />;
  }

  if (error !== undefined || profile === undefined) {
    return (
      <ErrorPanel
        message={error?.message ?? dict.common.errorTitle}
        retryLabel={dict.common.retry}
        title={dict.common.errorTitle}
        onRetry={() => window.location.reload()}
      />
    );
  }

  const isOwner = actor !== null && actor.member.githubId === profile.githubId;
  const isPending = actor !== null && isOwner && actor.member.status !== "approved";
  return (
    <div className="w-full bg-background">
      {/* Breadcrumb Bar */}
      <div className="border-b border-border bg-card px-4 py-3">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link href={localePath(locale, "/")} className="hover:text-foreground transition-colors">
            {dict.member.home}
          </Link>
          <span>/</span>
          <Link
            href={localePath(locale, "/members")}
            className="hover:text-foreground transition-colors"
          >
            {dict.nav.members}
          </Link>
          <span>/</span>
          <span aria-current="page" className="font-medium text-foreground">
            {profile.displayName}
          </span>
        </div>
      </div>

      {/* Member Profile Hero Header */}
      <div className="border-b border-border bg-muted/30 px-4 py-8 dark:bg-card">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-6">
          <div className="flex min-w-0 flex-wrap items-center gap-5">
            <div className="relative">
              <div className="overflow-hidden rounded-full border border-border shadow-xs">
                <MemberAvatar member={profile} size={72} />
              </div>
              <CheckCircleIcon className="absolute -bottom-1 -right-1 size-5 rounded-full bg-primary text-primary-foreground fill-primary" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  {profile.displayName}
                </h1>
                {/* The public member DTO carries no status or priority, so the
                    only status we can state here is the viewer's own. Everyone
                    listed in the directory is by definition approved. */}
                {isOwner ? (
                  <Chip tone={actor.member.status === "approved" ? "success" : "attention"}>
                    {dict.profile.statusShort[actor.member.status]}
                  </Chip>
                ) : null}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-muted-foreground">
                {profile.headline !== null || profile.affiliation !== null ? (
                  <span className="flex items-center gap-1.5">
                    <BriefcaseIcon className="size-4 shrink-0 text-muted-foreground" />
                    <span>{profile.headline ?? profile.affiliation}</span>
                  </span>
                ) : null}

                {profile.location !== null ? (
                  <span className="flex items-center gap-1.5">
                    <MapPinIcon className="size-4 shrink-0 text-muted-foreground" />
                    <span>{profile.location}</span>
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isOwner ? (
              <Button
                variant="outline"
                size="sm"
                nativeButton={false}
                render={<Link href={localePath(locale, "/profile")} />}
                className="gap-2 cursor-pointer"
              >
                <PencilIcon className="size-4" />
                <span>{dict.profile.title}</span>
              </Button>
            ) : null}
            <div className="relative">
              <Button
                variant="outline"
                size="icon-sm"
                aria-label={dict.member.shareProfile}
                onClick={handleShare}
                className="cursor-pointer"
              >
                <ShareNetworkIcon className="size-4" />
              </Button>
              {copied ? (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-md bg-foreground px-2 py-0.5 text-[11px] font-semibold text-background shadow-xs whitespace-nowrap z-50">
                  {dict.member.copiedLink}
                </span>
              ) : null}
            </div>
            <Button
              variant="default"
              size="sm"
              render={
                <a
                  href={`https://github.com/${profile.githubUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
              className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <GithubLogoIcon className="size-4" />
              <span>@{profile.githubUsername}</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-[1200px] px-4 py-6 sm:py-8">
        {isPending ? (
          <StateBanner tone="attention" role="status" className="mb-6">
            {dict.profile.status[actor.member.status]}
          </StateBanner>
        ) : null}

        <MemberProfileContent profile={profile} dict={dict} locale={locale} isOwner={isOwner} />
      </div>
    </div>
  );
}
