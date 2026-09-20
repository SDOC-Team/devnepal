"use client";

import type { PublicMemberDto } from "@gov-portal/shared";
import { BuildingsIcon, MapPinIcon, SealCheckIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { type Dictionary, type Locale, localePath } from "@/lib/i18n";
import { cn } from "@/lib/utils";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const useIsomorphicLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

function SkillsRow({ skills }: { skills: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(skills.length);
  const overflow = skills.length - visible;

  useIsomorphicLayoutEffect(() => {
    const el = containerRef.current;
    const counter = counterRef.current;
    if (!el || !counter) return;

    const compute = () => {
      const badges = Array.from(el.querySelectorAll<HTMLElement>("[data-skill]"));
      if (badges.length === 0) return;
      const width = el.clientWidth;
      const gap = Number.parseFloat(getComputedStyle(el).columnGap) || 0;
      const counterWidth = counter.offsetWidth + gap;
      let used = 0;
      let fit = 0;
      for (let i = 0; i < badges.length; i++) {
        const badgeWidth = badges[i].offsetWidth + (fit > 0 ? gap : 0);
        const reserve = i < badges.length - 1 ? counterWidth : 0;
        if (used + badgeWidth + reserve > width) break;
        used += badgeWidth;
        fit++;
      }
      setVisible(fit);
    };

    compute();
    const observer = new ResizeObserver(compute);
    observer.observe(el);
    return () => observer.disconnect();
  }, [skills]);

  return (
    <div
      ref={containerRef}
      className="mt-2.5 flex max-h-5 flex-wrap items-center gap-2 overflow-hidden px-4"
    >
      {skills.map((skill, i) => (
        <Badge
          key={skill}
          data-skill
          variant="secondary"
          className={cn(i < visible ? "" : "invisible absolute")}
        >
          {skill}
        </Badge>
      ))}
      <Badge
        ref={counterRef}
        variant="secondary"
        className={cn(overflow > 0 ? "" : "invisible absolute")}
      >
        +{overflow > 0 ? overflow : skills.length} more
      </Badge>
    </div>
  );
}

export function MemberCard({
  member,
  dict,
  locale,
  className,
}: {
  member: PublicMemberDto;
  dict: Dictionary;
  locale: Locale;
  className?: string;
}) {
  const profileHref = localePath(locale, `/members/${member.githubUsername}`);
  const avatarSrc = member.avatarUrl ?? `https://github.com/${member.githubUsername}.png`;

  return (
    <Card
      data-slot="profile-card"
      className={cn(
        "w-full gap-0 py-0 transition-colors duration-200 hover:bg-muted hover:ring-foreground/20",
        className,
      )}
    >
      <div className="flex items-center gap-3 px-4 pt-4">
        <Avatar className="size-12">
          <AvatarImage src={avatarSrc} alt={member.displayName} />
          <AvatarFallback>{initials(member.displayName)}</AvatarFallback>
          <AvatarBadge className="size-5 [&>svg]:size-3.5">
            <SealCheckIcon weight="fill" aria-hidden />
          </AvatarBadge>
        </Avatar>
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="truncate text-lg font-semibold text-card-foreground">
            <Link href={profileHref} className="no-underline hover:text-primary">
              {member.displayName}
            </Link>
          </p>
          <p className="truncate text-sm font-medium text-muted-foreground">
            {member.headline ?? `@${member.githubUsername}`}
          </p>
        </div>
      </div>

      {member.affiliation || member.location ? (
        <div className="mt-3 flex items-center gap-3 px-4">
          {member.affiliation ? (
            <span className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
              <BuildingsIcon className="size-4" aria-hidden />
              {member.affiliation}
            </span>
          ) : null}
          {member.affiliation && member.location ? (
            <span aria-hidden className="h-2 w-px bg-border" />
          ) : null}
          {member.location ? (
            <span className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
              <MapPinIcon className="size-4" aria-hidden />
              {member.location}
            </span>
          ) : null}
        </div>
      ) : null}

      {member.skills.length > 0 ? <SkillsRow skills={member.skills as string[]} /> : null}

      <div className="p-4">
        <Button
          variant="outline"
          size="sm"
          nativeButton={false}
          render={<Link href={profileHref} />}
        >
          {dict.members.viewProfile}
        </Button>
      </div>
    </Card>
  );
}
