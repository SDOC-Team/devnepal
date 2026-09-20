"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { ErrorPanel, LoadingPanel, StateBanner } from "@/components/modules/common";
import { Button } from "@/components/ui/button";
import { useActor, useLocale } from "@/hooks";
import { localePath } from "@/lib/i18n";

export default function WelcomePage() {
  const { locale, dict } = useLocale();
  const router = useRouter();
  const { actor, isLoading, isSignedOut, error } = useActor();

  const status = actor?.member.status;
  const isAdmin = actor?.isAdmin ?? false;

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (isSignedOut) {
      router.replace(localePath(locale));
      return;
    }
    // Admin privileges come from ADMIN_GITHUB_IDS, not from member status.
    if (isAdmin) {
      router.replace(localePath(locale, "/admin"));
      return;
    }
    if (status === "approved") {
      router.replace(localePath(locale));
    }
  }, [isLoading, isSignedOut, isAdmin, status, locale, router]);

  if (isLoading || isSignedOut || isAdmin || status === "approved") {
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

  if (actor === null || status === undefined) {
    return <LoadingPanel label={dict.common.loading} />;
  }

  const copy =
    status === "rejected"
      ? {
          title: dict.welcome.rejectedTitle,
          body: dict.welcome.rejectedBody,
          cta: dict.welcome.openProfile,
        }
      : status === "hidden"
        ? {
            title: dict.welcome.hiddenTitle,
            body: dict.welcome.hiddenBody,
            cta: dict.welcome.openProfile,
          }
        : {
            title: dict.welcome.pendingTitle,
            body: dict.welcome.pendingBody,
            cta: dict.welcome.completeProfile,
          };

  return (
    <section className="py-12" aria-labelledby="welcome-heading">
      <div className="container-narrow">
        <p className="mb-2 block text-sm font-semibold text-accent-700">{dict.welcome.kicker}</p>
        <h1 id="welcome-heading">{copy.title}</h1>
        <StateBanner tone={status === "pending" ? "attention" : "danger"} role="status">
          {dict.profile.status[status]}
        </StateBanner>
        <p className="mt-4 max-w-[58ch] text-md leading-[1.55] text-neutral-800">{copy.body}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button render={<Link href={localePath(locale, "/profile")} />}>{copy.cta}</Button>
          <Button variant="outline" render={<Link href={localePath(locale, "/issues")} />}>
            {dict.welcome.browseIssues}
          </Button>
        </div>
      </div>
    </section>
  );
}
