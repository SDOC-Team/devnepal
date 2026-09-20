"use client";

import { ErrorPanel, LoadingPanel, SignInPanel } from "@/components/modules/common";
import { useActor, useLocale } from "@/hooks";

import { AdminQueue } from "./admin-queue";

export default function AdminPage() {
  const { locale, dict } = useLocale();
  const { actor, isLoading, isSignedOut, error } = useActor();

  if (isLoading) {
    return <LoadingPanel label={dict.common.loading} layout="rows" />;
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
      <section className="py-12" aria-labelledby="admin-heading">
        <div className="container-narrow">
          <header className="mb-8 max-w-[70ch]">
            <p className="mb-2 block text-sm font-semibold text-primary">{dict.admin.kicker}</p>
            <h1 id="admin-heading" className="mt-0 mb-3 leading-[1.08] tracking-[-0.01em]">
              {dict.admin.title}
            </h1>
            <p className="m-0 max-w-[68ch] text-md leading-[1.55] text-muted-foreground">
              {dict.admin.signInBody}
            </p>
          </header>
          <SignInPanel label={dict.session.signIn} locale={locale} />
        </div>
      </section>
    );
  }

  if (!actor.isAdmin) {
    return (
      <section className="py-12" aria-labelledby="admin-heading">
        <div className="container-narrow">
          <header className="mb-8 max-w-[70ch]">
            <p className="mb-2 block text-sm font-semibold text-primary">{dict.admin.kicker}</p>
            <h1 id="admin-heading" className="mt-0 mb-3 leading-[1.08] tracking-[-0.01em]">
              {dict.admin.notAuthorizedTitle}
            </h1>
            <p className="m-0 max-w-[68ch] text-md leading-[1.55] text-muted-foreground">
              {dict.admin.notAuthorizedBody}
            </p>
          </header>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12" aria-labelledby="admin-heading">
      <div className="container">
        <header className="mb-6 flex items-end justify-between gap-6">
          <div className="max-w-[72ch]">
            <p className="mb-2 block text-sm font-semibold text-primary">{dict.admin.kicker}</p>
            <h1 id="admin-heading" className="mb-2 text-3xl">
              {dict.admin.title}
            </h1>
            <p className="max-w-[72ch]">{dict.admin.lede}</p>
          </div>
        </header>
        <AdminQueue dict={dict} />
      </div>
    </section>
  );
}
