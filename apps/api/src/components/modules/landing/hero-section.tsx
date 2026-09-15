import type { Dictionary, Locale } from "@/lib/i18n";
import { HeroSignIn } from "./hero-sign-in";

/** Landing hero: two-line title, lead paragraph and the GitHub sign-in action. */
export function HeroSection({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <section className="hero-photo m-0 border-0" aria-labelledby="hero-heading">
      <div className="container relative z-[1]">
        <div className="grid grid-cols-[minmax(0,1fr)] items-center gap-12 pt-12 pb-16">
          <div className="flex min-h-[360px] flex-col justify-center sm:min-h-[480px]">
            <h1
              id="hero-heading"
              className="max-w-[11em] text-hero leading-[0.94] tracking-[-0.015em] text-paper"
            >
              <span className="block">{dict.home.titleLine1}</span>
              <span className="block">{dict.home.titleLine2}</span>
            </h1>
            <p className="mt-6 max-w-[52ch] text-md leading-[1.55] text-paper">{dict.home.lead}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <HeroSignIn label={dict.session.signIn} locale={locale} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
