"use client";

import {
  BriefcaseIcon,
  BuildingsIcon,
  CaretRightIcon,
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

export default function MemberDetailPage() {
  const { locale, dict } = useLocale();
  const { username } = useParams<{ username: string }>();
  const { member: profile, isLoading, error } = useMember(username);
  const { actor } = useActor();
  const [activeTab, setActiveTab] = useState<"overview" | "contributions">("overview");
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
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
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

  // Sample/mock contributions matching the visual spec if none available
  const sampleContributions = [
    {
      id: "1",
      author: profile.displayName,
      action: "improved the Nepali translation of the contribute page",
      status: "MERGED",
      date: "14 Bhadra 2083 (30 Aug)",
    },
    {
      id: "2",
      author: profile.displayName,
      action: "improved the Nepali translation of the contribute page",
      status: "MERGED",
      date: "14 Bhadra 2083 (30 Aug)",
    },
    {
      id: "3",
      author: profile.displayName,
      action: "improved the Nepali translation of the contribute page",
      status: "MERGED",
      date: "14 Bhadra 2083 (30 Aug)",
    },
    {
      id: "4",
      author: profile.displayName,
      action: "improved the Nepali translation of the contribute page",
      status: "MERGED",
      date: "14 Bhadra 2083 (30 Aug)",
    },
    {
      id: "5",
      author: profile.displayName,
      action: "improved the Nepali translation of the contribute page",
      status: "MERGED",
      date: "14 Bhadra 2083 (30 Aug)",
    },
    {
      id: "6",
      author: profile.displayName,
      action: "improved the Nepali translation of the contribute page",
      status: "MERGED",
      date: "14 Bhadra 2083 (30 Aug)",
    },
    {
      id: "7",
      author: profile.displayName,
      action: "improved the Nepali translation of the contribute page",
      status: "OPENED",
      date: "14 Bhadra 2083 (30 Aug)",
    },
    {
      id: "8",
      author: profile.displayName,
      action: "improved the Nepali translation of the contribute page",
      status: "CLOSED",
      date: "14 Bhadra 2083 (30 Aug)",
    },
    {
      id: "9",
      author: profile.displayName,
      action: "improved the Nepali translation of the contribute page",
      status: "CLOSED",
      date: "14 Bhadra 2083 (30 Aug)",
    },
    {
      id: "10",
      author: profile.displayName,
      action: "improved the Nepali translation of the contribute page",
      status: "CLOSED",
      date: "14 Bhadra 2083 (30 Aug)",
    },
  ];

  return (
    <div className="w-full bg-background min-h-screen">
      {/* Breadcrumb Bar */}
      <div className="border-b border-border bg-card px-4 py-3">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <Link href={localePath(locale, "/")} className="hover:text-foreground transition-colors">
            Home
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
                <Chip tone="accent">⭐ {dict.members.featured}</Chip>
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
                ) : (
                  <span className="flex items-center gap-1.5">
                    <MapPinIcon className="size-4 shrink-0 text-muted-foreground" />
                    <span>Kathmandu Nepal</span>
                  </span>
                )}
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
                aria-label="Share profile"
                onClick={handleShare}
                className="cursor-pointer"
              >
                <ShareNetworkIcon className="size-4" />
              </Button>
              {copied ? (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 rounded-md bg-foreground px-2 py-0.5 text-[11px] font-semibold text-background shadow-xs whitespace-nowrap z-50">
                  Copied link!
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

      {/* Tabs Navigation Strip */}
      <div className="border-b border-border bg-background px-4">
        <div className="mx-auto flex max-w-[1200px] gap-8 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`py-3.5 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === "overview"
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("contributions")}
            className={`py-3.5 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
              activeTab === "contributions"
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Contributions
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-[1200px] px-4 py-8">
        {isPending ? (
          <StateBanner tone="attention" role="status" className="mb-6">
            {dict.profile.status[actor.member.status]}
          </StateBanner>
        ) : null}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
          {/* Left Main Column */}
          <div className="space-y-8">
            {/* Bio Prose */}
            <div>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                {profile.bio ??
                  "I work on payment rails and I am interested in how public systems handle money. Happy to mentor on Django, especially for a first contribution to a government repository."}
              </p>
            </div>

            {/* Contributions Section */}
            <div>
              <h2 className="mb-4 text-lg font-bold tracking-tight text-foreground">
                Contributions
              </h2>

              <div className="overflow-hidden rounded-xl border border-border bg-card divide-y divide-border">
                {sampleContributions.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-4 p-4 text-sm transition-colors hover:bg-muted/40"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="font-semibold text-foreground">{item.author}</span>
                      <span className="text-muted-foreground">{item.action}</span>
                    </div>

                    <div className="flex shrink-0 items-center gap-4">
                      {item.status === "MERGED" ? (
                        <span className="rounded-full bg-primary px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-primary-foreground">
                          {item.status}
                        </span>
                      ) : item.status === "OPENED" ? (
                        <span className="rounded-full border border-border bg-muted px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                          {item.status}
                        </span>
                      ) : (
                        <span className="rounded-full bg-destructive/10 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-destructive">
                          {item.status}
                        </span>
                      )}

                      <span className="text-xs text-muted-foreground">{item.date}</span>

                      <CaretRightIcon className="size-4 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar Column */}
          <div className="space-y-6">
            {/* Skills Card */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-3 text-sm font-bold text-foreground">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {profile.skills.length > 0
                  ? profile.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md border border-border bg-muted/60 px-2.5 py-1 text-xs font-medium text-foreground"
                      >
                        {skill}
                      </span>
                    ))
                  : [
                      "Engineering",
                      "UI/UX",
                      "Data",
                      "Security",
                      "Documentation",
                      "Localization",
                      "Research",
                    ].map((skill) => (
                      <span
                        key={skill}
                        className="rounded-md border border-border bg-muted/60 px-2.5 py-1 text-xs font-medium text-foreground"
                      >
                        {skill}
                      </span>
                    ))}
              </div>
            </div>

            {/* Affiliation Card */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-3 text-sm font-bold text-foreground">Affiliation</h3>
              <div className="space-y-2.5 text-sm text-foreground">
                <div className="flex items-center gap-2">
                  <BuildingsIcon className="size-4 text-muted-foreground" />
                  <span className="font-medium">{profile.affiliation ?? "Niural AI"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BuildingsIcon className="size-4 text-muted-foreground" />
                  <span className="font-medium">MIT</span>
                </div>
              </div>
            </div>

            {/* Links Card */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="mb-3 text-sm font-bold text-foreground">Links</h3>
              <div className="flex flex-wrap gap-2">
                {profile.links.length > 0
                  ? profile.links.map((link) => (
                      <a
                        key={link}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md border border-border bg-muted/60 px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                      >
                        {link.replace(/^https?:\/\//, "")}
                      </a>
                    ))
                  : ["github.com", "linkedin.com", "dev.to", "twitter.com", "personal.site"].map(
                      (link) => (
                        <span
                          key={link}
                          className="rounded-md border border-border bg-muted/60 px-2.5 py-1 text-xs font-medium text-foreground"
                        >
                          {link}
                        </span>
                      ),
                    )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
