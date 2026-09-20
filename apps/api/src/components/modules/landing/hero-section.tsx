import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { Dictionary, Locale } from "@/lib/i18n";
import { localePath } from "@/lib/i18n";
import { HeroDataViz } from "./hero-data-viz";
import { HeroSignIn } from "./hero-sign-in";

export function HeroSection({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  return (
    <section
      data-slot="home-hero"
      className="flex flex-col gap-12 px-4 py-16 sm:px-8 lg:flex-row lg:items-stretch lg:justify-between lg:px-16"
    >
      <div className="flex max-w-xl flex-col justify-center gap-6">
        <div className="flex flex-col gap-5">
          <h1 className="text-5xl font-bold tracking-[-0.02em] text-foreground lg:text-6xl">
            <span className="block">{dict.home.titleLine1}</span>
            <span className="block">{dict.home.titleLine2}</span>
          </h1>
          <p className="text-base text-pretty text-secondary-foreground">{dict.home.lead}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <HeroSignIn label={dict.session.signIn} locale={locale} />
          <Button
            size="lg"
            variant="outline"
            nativeButton={false}
            render={<Link href={localePath(locale, "/issues")} />}
          >
            {dict.home.browseIssues}
          </Button>
        </div>
      </div>
      <HeroDataViz className="w-full lg:max-w-3xl" />
    </section>
  );
}
