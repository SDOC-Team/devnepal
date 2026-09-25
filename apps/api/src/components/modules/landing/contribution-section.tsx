import Link from "next/link";

import { type Dictionary, type Locale, localePath } from "@/lib/i18n";

/** How-to-contribute block: kicker, ways list and the three blueprint cards. */
export function ContributionSection({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <div className="grid grid-cols-1 items-start gap-5 min-[801px]:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] min-[801px]:gap-16">
      <header className="m-0 block border-0 p-0">
        <span className="block text-sm font-semibold text-primary">
          {dict.home.contributeKicker}
        </span>
        <h2 id="path-heading" className="mt-5">
          {dict.home.contributeTitle}
        </h2>
        <p>{dict.home.contributeBody}</p>
        <ul
          className="mt-5 mb-0 flex max-w-[48ch] list-none flex-wrap gap-x-0 gap-y-1 p-0 text-sm leading-[1.7] text-muted-foreground"
          aria-label={dict.home.contributeTitle}
        >
          {dict.home.ways.map((way) => (
            <li
              key={way}
              className="after:mx-[0.55em] after:text-muted-foreground after:content-['·'] last:after:content-none"
            >
              {way}
            </li>
          ))}
        </ul>
        <Link
          href={localePath(locale, "/about")}
          className="mt-6 inline-block text-sm font-medium whitespace-nowrap text-primary hover:text-primary"
        >
          {dict.home.howToContribute} →
        </Link>
      </header>

      <div className="grid grid-cols-1 gap-5 min-[801px]:grid-cols-[repeat(2,minmax(0,1fr))]">
        {[
          {
            href: localePath(locale, "/issues"),
            title: dict.home.journey.step2Title,
            body: dict.home.journey.step2Body,
          },
          {
            href: localePath(locale, "/about"),
            title: dict.home.journey.step3Title,
            body: dict.home.journey.step3Body,
          },
          {
            href: localePath(locale, "/members"),
            title: dict.home.journey.step4Title,
            body: dict.home.journey.step4Body,
          },
        ].map((card) => (
          <article
            key={card.title}
            className="relative flex flex-col gap-3 rounded-md border border-border bg-card p-6"
          >
            <h3 className="m-0 text-lg leading-[1.1] tracking-[0.02em] uppercase">
              <Link href={card.href} className="text-foreground no-underline hover:text-primary">
                {card.title}
              </Link>
            </h3>
            <p className="m-0 text-base leading-[1.55] text-foreground">{card.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
