import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { isAdminGithubId } from "@/config";
import { getDictionary, isLocale, type Locale, localePath } from "@/lib/i18n";
import { getActor } from "@/server/actor";

export const dynamic = "force-dynamic";

export default async function WelcomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  const activeLocale: Locale = locale;
  const dict = getDictionary(activeLocale);

  const actor = await getActor();
  if (actor === null) {
    redirect(localePath(activeLocale));
  }

  // Admin privileges come from ADMIN_GITHUB_IDS, not from member status.
  if (isAdminGithubId(actor.githubId)) {
    redirect(localePath(activeLocale, "/admin"));
  }

  if (actor.status === "approved") {
    redirect(localePath(activeLocale));
  }

  const copy =
    actor.status === "rejected"
      ? {
          title: dict.welcome.rejectedTitle,
          body: dict.welcome.rejectedBody,
          cta: dict.welcome.openProfile,
        }
      : actor.status === "hidden"
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
    <section className="section" aria-labelledby="welcome-heading">
      <div className="container dn-container--narrow">
        <p className="dn-section-kicker">{dict.welcome.kicker}</p>
        <h1 id="welcome-heading">{copy.title}</h1>
        <div
          className={`dn-state-banner ${actor.status === "pending" ? "is-attention" : "is-danger"}`}
          role="status"
        >
          {dict.profile.status[actor.status]}
        </div>
        <p className="hero__lead" style={{ marginTop: "1rem" }}>
          {copy.body}
        </p>
        <div className="hero__actions">
          <Link className="btn btn--primary" href={localePath(activeLocale, "/profile")}>
            {copy.cta}
          </Link>
          <Link className="btn" href={localePath(activeLocale, "/issues")}>
            {dict.welcome.browseIssues}
          </Link>
        </div>
      </div>
    </section>
  );
}
