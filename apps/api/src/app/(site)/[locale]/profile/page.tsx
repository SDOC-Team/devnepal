import Link from "next/link";
import { notFound } from "next/navigation";

import { getDictionary, isLocale, type Locale, localePath } from "@/lib/i18n";
import { getActor } from "@/server/actor";
import { toSelfMemberDto } from "@/server/members/dto";

import { SignInPanel } from "../sign-in-panel";
import { ProfileForm } from "./profile-form";

export const dynamic = "force-dynamic";

export default async function ProfilePagePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  const activeLocale: Locale = locale;
  const dict = getDictionary(activeLocale);
  const actor = await getActor();

  if (actor === null) {
    return (
      <section className="section" aria-labelledby="profile-heading">
        <div className="container dn-container--narrow">
          <header className="dn-profile-edit__head">
            <p className="dn-section-kicker">{dict.profile.kicker}</p>
            <h1 id="profile-heading">{dict.profile.title}</h1>
            <p className="dn-lede">{dict.profile.signInBody}</p>
          </header>
          <SignInPanel label={dict.session.signIn} locale={activeLocale} />
        </div>
      </section>
    );
  }

  return (
    <section className="section dn-profile-edit" aria-labelledby="profile-heading">
      <div className="container">
        <div className="dn-profile-edit__layout">
          <div>
            <header className="dn-profile-edit__head">
              <p className="dn-section-kicker">{dict.profile.kicker}</p>
              <h1 id="profile-heading">{dict.profile.title}</h1>
              <p className="dn-lede">{dict.profile.lede}</p>
              <div
                className={`dn-state-banner ${actor.status === "approved" ? "is-success" : "is-attention"}`}
                role="status"
              >
                {dict.profile.status[actor.status]}
              </div>
            </header>
            <ProfileForm member={toSelfMemberDto(actor)} dict={dict} />
          </div>
          <aside className="dn-profile-aside">
            <div className="dn-sidebar-section">
              <strong>{dict.profile.asideTitle}</strong>
              <p className="dn-field-help" style={{ marginTop: "0.5rem" }}>
                {dict.profile.asideBody}
              </p>
            </div>
            <div className="dn-sidebar-section">
              <Link
                className="dn-arrow-link"
                href={localePath(activeLocale, `/members/${actor.githubUsername}`)}
              >
                {dict.profile.viewPublic} →
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
