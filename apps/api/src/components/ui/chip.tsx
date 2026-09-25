import type { ReactNode } from "react";

const TONE_CLASSES = {
  neutral: "bg-muted text-foreground",
  accent: "bg-primary/10 text-primary",
  outline: "border-primary/30 bg-primary/5 text-primary",
  success: "bg-primary/10 text-primary",
  attention: "bg-chart-1/20 text-foreground",
  danger: "bg-destructive/10 text-destructive",
} as const;

/**
 * Small metadata pill — issue labels, project topics. Distinct from shadcn's
 * Badge, which is shorter and fully rounded; this matches the platform's
 * 24px-tall, 8px-cornered label.
 */
export function Chip({
  tone = "neutral",
  children,
}: {
  tone?: keyof typeof TONE_CLASSES;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex min-h-6 w-fit items-center gap-1 rounded-md border border-transparent px-2 text-xs leading-tight font-semibold tracking-[0.02em] whitespace-nowrap ${TONE_CLASSES[tone]}`}
    >
      {children}
    </span>
  );
}
