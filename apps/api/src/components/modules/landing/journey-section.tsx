"use client";

import {
  GitPullRequestIcon,
  IdentificationCardIcon,
  MagnifyingGlassIcon,
} from "@phosphor-icons/react";
import type { Dictionary } from "@/lib/i18n";

export function JourneySection({ dict }: { dict: Dictionary }) {
  const steps = [
    {
      icon: MagnifyingGlassIcon,
      title: dict.home.howStep1Title,
      description: dict.home.howStep1Body,
    },
    {
      icon: GitPullRequestIcon,
      title: dict.home.howStep2Title,
      description: dict.home.howStep2Body,
    },
    {
      icon: IdentificationCardIcon,
      title: dict.home.howStep3Title,
      description: dict.home.howStep3Body,
    },
  ];

  return (
    <section
      id="contribute"
      data-slot="how-it-works"
      className="flex scroll-mt-4 flex-col gap-5 bg-popover px-4 py-7 sm:px-8 lg:px-16"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">{dict.home.howItWorksTitle}</h2>
      </div>
      <div className="grid gap-x-6 gap-y-5 md:grid-cols-3">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.title}
              className="group flex flex-col gap-3 rounded-xl bg-background px-5 py-4 transition-colors duration-200 hover:bg-card hover:ring-1 hover:ring-foreground/10"
            >
              <div className="flex size-9 items-center justify-center rounded-3xl bg-card ring-1 ring-foreground/10">
                <Icon
                  className="size-6 text-foreground transition-colors duration-200 group-hover:text-primary"
                  weight="duotone"
                  aria-hidden
                />
              </div>
              <div className="flex flex-col">
                <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="text-base text-muted-foreground">{step.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
