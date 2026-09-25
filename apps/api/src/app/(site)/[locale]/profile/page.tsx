"use client";

import {
  ArrowLink,
  ErrorPanel,
  LoadingPanel,
  SignInPanel,
  StateBanner,
} from "@/components/modules/common";
import { useActor, useLocale } from "@/hooks";
import { localePath } from "@/lib/i18n";

import { ProfileForm } from "./profile-form";

export default function ProfilePage() {
  const { locale, dict } = useLocale();
  const { actor, isLoading, isSignedOut, error, refresh } = useActor();

  if (isLoading) {
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

  if (isSignedOut || actor === null) {
    return (
      <section className="py-12" aria-labelledby="profile-heading">
        <div className="container-narrow">
          <header className="mb-8 max-w-[70ch]">
            <p className="mb-2 block text-sm font-semibold text-primary">{dict.profile.kicker}</p>
            <h1 id="profile-heading" className="mt-0 mb-3 leading-[1.08] tracking-[-0.01em]">
              {dict.profile.title}
            </h1>
            <p className="m-0 max-w-[68ch] text-md leading-[1.55] text-muted-foreground">
              {dict.profile.signInBody}
            </p>
          </header>
          <SignInPanel label={dict.session.signIn} locale={locale} />
        </div>
      </section>
    );
  }

  const { member } = actor;

  return (
    <section className="py-12" aria-labelledby="profile-heading">
      <div className="container">
        <div className="grid grid-cols-1 items-start gap-10 min-[901px]:grid-cols-[minmax(0,1fr)_340px]">
          <div>
            <header className="mb-8 max-w-[70ch]">
              <p className="mb-2 block text-sm font-semibold text-primary">{dict.profile.kicker}</p>
              <h1 id="profile-heading" className="mt-0 mb-3 leading-[1.08] tracking-[-0.01em]">
                {dict.profile.title}
              </h1>
              <p className="m-0 max-w-[68ch] text-md leading-[1.55] text-muted-foreground">
                {dict.profile.lede}
              </p>
              <StateBanner
                tone={member.status === "approved" ? "success" : "attention"}
                role="status"
                className="mt-4"
              >
                {dict.profile.status[member.status]}
              </StateBanner>
            </header>
            <ProfileForm member={member} dict={dict} onSaved={() => void refresh()} />
          </div>
          <aside className="sticky top-24 grid gap-4">
            <div className="rounded-md border border-border bg-card p-5">
              <strong>{dict.profile.asideTitle}</strong>
              <p className="mt-2 mb-0 text-sm text-muted-foreground">{dict.profile.asideBody}</p>
            </div>
            <div className="rounded-md border border-border bg-card p-5">
              <ArrowLink href={localePath(locale, `/members/${member.githubUsername}`)}>
                {dict.profile.viewPublic} →
              </ArrowLink>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
