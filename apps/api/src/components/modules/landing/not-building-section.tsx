import { PlusCircleIcon } from "@phosphor-icons/react/ssr";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { type Locale, localePath } from "@/lib/i18n";

const NOT_BUILDING = [
  {
    title: "Ministry self-service",
    description:
      "Ministries are onboarded by hand in v0.1. There is no sign-up for an organisation.",
  },
  {
    title: "Charts, graphs and rankings",
    description:
      "GitHub Insights does this better, and a leaderboard changes why people contribute.",
  },
  {
    title: "Comments and discussion here",
    description: "Every conversation happens on GitHub, in the open, next to the code.",
  },
  {
    title: "Notifications and digests",
    description: "Nothing from this site will arrive in your inbox except about your own account.",
  },
  {
    title: "Search across issues",
    description:
      "Twenty issues is short enough to read. This returns when the list is long enough to need it.",
  },
  {
    title: "A WCAG 2.2 AA conformance claim",
    description:
      "The structural work is done in v0.1. No claim is made until it has been tested with a screen reader.",
  },
] as const;

export function NotBuildingSection({ locale }: { locale?: Locale }) {
  const roadmapHref = locale ? localePath(locale, "/about") : "#roadmap";

  return (
    <section
      id="about"
      data-slot="not-building-section"
      className="scroll-mt-4 bg-popover px-4 py-12 sm:px-8 lg:px-16 lg:py-16"
    >
      <div className="grid gap-5 lg:grid-cols-3 lg:gap-x-12">
        <div className="flex flex-col justify-center gap-3 p-3">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold text-card-foreground">
              What we are not building yet
            </h2>
            <p className="text-base text-muted-foreground">
              Listed so you know what is deliberately absent rather than wondering what is missing.
              Each one is deferred, not abandoned. Each has a written condition that must be true
              before it is taken up. Nothing returns because it was asked for loudly.
            </p>
          </div>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="lg"
              nativeButton={false}
              render={<Link href={roadmapHref} />}
            >
              Read what unblocks each one
              <PlusCircleIcon data-icon="inline-end" />
            </Button>
          </div>
        </div>
        <div className="grid gap-x-6 gap-y-5 px-2.5 py-3 sm:grid-cols-2 lg:col-span-2">
          {NOT_BUILDING.map((item) => (
            <div key={item.title} className="flex flex-col gap-1 rounded-xl bg-card px-4 py-3">
              <h3 className="text-base font-medium text-card-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
