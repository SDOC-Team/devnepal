import type { ReactNode } from "react";

const TONE_CLASSES = {
  neutral: "bg-neutral-100 text-neutral-800",
  accent: "bg-accent-100 text-accent-800",
  outline: "border-accent-300 bg-accent-100 text-accent-800",
  success: "bg-success-subtle text-success",
  attention: "bg-attention-subtle text-attention",
  danger: "bg-error-subtle text-error",
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
      className={`inline-flex min-h-[var(--badge-h)] w-fit items-center gap-1 rounded-md border border-transparent px-2 text-xs leading-tight font-semibold tracking-[0.02em] whitespace-nowrap ${TONE_CLASSES[tone]}`}
    >
      {children}
    </span>
  );
}
