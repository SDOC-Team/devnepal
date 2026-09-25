"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { ErrorPanel, LoadingPanel, PageHeader } from "@/components/modules/common";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useActor, useLocale } from "@/hooks";
import { localePath } from "@/lib/i18n";
import { cn } from "@/lib/utils";

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
    return <LoadingPanel label={dict.common.loading} layout="detail" />;
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
    return <LoadingPanel label={dict.common.loading} layout="detail" />;
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
        <PageHeader kicker={dict.welcome.kicker} title={copy.title} titleId="welcome-heading" />

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className={cn(
                  "size-2 rounded-full",
                  status === "pending" ? "bg-chart-1" : "bg-destructive",
                )}
              />
              {dict.profile.status[status]}
            </CardTitle>
            <CardDescription className="max-w-[58ch] leading-[1.55]">{copy.body}</CardDescription>
          </CardHeader>
          <CardFooter className="flex flex-wrap items-center gap-3">
            <Button render={<Link href={localePath(locale, "/profile")} />}>{copy.cta}</Button>
            <Button variant="outline" render={<Link href={localePath(locale, "/issues")} />}>
              {dict.welcome.browseIssues}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
