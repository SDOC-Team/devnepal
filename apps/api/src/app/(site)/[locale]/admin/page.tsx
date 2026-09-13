import { notFound } from "next/navigation";

import { isAdminGithubId } from "@/config";
import { getDictionary, isLocale } from "@/lib/i18n";
import { getActor } from "@/server/actor";

import { SignInPanel } from "../sign-in-panel";
import { AdminQueue } from "./admin-queue";

export const dynamic = "force-dynamic";

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  const dict = getDictionary(locale);
  const actor = await getActor();

  if (actor === null) {
    return (
      <section className="section" aria-labelledby="admin-heading">
        <div className="container dn-container--narrow">
          <header className="dn-profile-edit__head">
            <p className="dn-section-kicker">{dict.admin.kicker}</p>
            <h1 id="admin-heading">{dict.admin.title}</h1>
            <p className="dn-lede">{dict.admin.signInBody}</p>
          </header>
          <SignInPanel label={dict.session.signIn} locale={locale} />
        </div>
      </section>
    );
  }

  if (!isAdminGithubId(actor.githubId)) {
    return (
      <section className="section" aria-labelledby="admin-heading">
        <div className="container dn-container--narrow">
          <header className="dn-profile-edit__head">
            <p className="dn-section-kicker">{dict.admin.kicker}</p>
            <h1 id="admin-heading">{dict.admin.notAuthorizedTitle}</h1>
            <p className="dn-lede">{dict.admin.notAuthorizedBody}</p>
          </header>
        </div>
      </section>
    );
  }

  return (
    <section className="section" aria-labelledby="admin-heading">
      <div className="container">
        <header className="dn-catalog-heading">
          <div>
            <p className="dn-section-kicker">{dict.admin.kicker}</p>
            <h1 id="admin-heading">{dict.admin.title}</h1>
            <p>{dict.admin.lede}</p>
          </div>
        </header>
        <AdminQueue dict={dict} />
      </div>
    </section>
  );
}
