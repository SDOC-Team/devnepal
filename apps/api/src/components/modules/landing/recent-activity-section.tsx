import { CaretRightIcon } from "@phosphor-icons/react/ssr";
import { Badge } from "@/components/ui/badge";

const STATUS_VARIANTS = {
  merged: "default",
  opened: "outline",
  closed: "destructive",
} as const;

type ActivityStatus = keyof typeof STATUS_VARIANTS;

type ActivityItem = {
  status: ActivityStatus;
  actor: string;
  action: string;
  date: string;
  href: string;
};

const STATUSES: ActivityStatus[] = [
  "merged",
  "merged",
  "merged",
  "merged",
  "merged",
  "merged",
  "opened",
  "closed",
  "closed",
  "closed",
];

const ACTIVITIES: ActivityItem[] = STATUSES.map((status) => ({
  status,
  actor: "Sunita Rai",
  action: "improved the Nepali translation of the contribute page",
  date: "14 Bhadra 2083 (30 Aug)",
  href: "https://github.com",
}));

function ActivityRow({ actor, action, status, date, href }: ActivityItem) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      data-slot="activity-row"
      className="group flex items-center gap-3 border-t border-border py-4 pr-4 pl-5 outline-none transition-colors duration-200 first:border-t-0 hover:bg-muted focus-visible:bg-muted sm:gap-4"
    >
      {/* On narrow screens the badge and date sit under the text instead of
          competing with it for width, so the sentence keeps a readable measure. */}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4">
        <p className="m-0 min-w-0 flex-1 text-base text-foreground">
          <span className="font-semibold">{actor}</span> {action}
        </p>
        <div className="flex shrink-0 items-center gap-3">
          <Badge variant={STATUS_VARIANTS[status]} className="uppercase sm:w-24 sm:justify-center">
            {status}
          </Badge>
          <span className="text-xs text-muted-foreground sm:hidden">{date}</span>
        </div>
      </div>
      <span className="hidden w-44 shrink-0 text-right text-xs text-muted-foreground lg:block">
        {date}
      </span>
      <CaretRightIcon
        className="size-4 shrink-0 text-muted-foreground transition-colors duration-200 group-hover:text-foreground"
        aria-hidden
      />
    </a>
  );
}

export function RecentActivitySection() {
  return (
    <section
      data-slot="recent-activity"
      className="flex flex-col gap-6 px-4 py-12 sm:px-8 lg:px-16 lg:py-16"
    >
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold text-foreground">Recent activity</h2>
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <span aria-hidden className="relative flex size-2.5">
            <span className="absolute size-full animate-ping rounded-full bg-green-500 opacity-60 [animation-duration:1.75s] motion-reduce:animate-none" />
            <span className="relative size-2.5 rounded-full bg-green-500 ring-1 ring-background" />
          </span>
          Live from GitHub
        </p>
      </div>
      <div className="overflow-clip rounded-xl border border-border bg-card">
        {ACTIVITIES.map((activity, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: static feed demo
          <ActivityRow key={`${activity.actor}-${index}`} {...activity} />
        ))}
      </div>
    </section>
  );
}
