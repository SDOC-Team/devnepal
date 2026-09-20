import type { ReactNode } from "react";

const TONE_CLASSES = {
  neutral: "border-l-border bg-muted/40",
  success: "border-l-primary bg-primary/5",
  attention: "border-l-chart-1 bg-chart-1/10",
  danger: "border-l-destructive bg-destructive/5",
} as const;

/**
 * Left-rule status banner — sign-in prompts, profile/member approval status,
 * and inline form errors all use this same shape with a different tone.
 */
export function StateBanner({
  tone = "neutral",
  role,
  className = "",
  children,
}: {
  tone?: keyof typeof TONE_CLASSES;
  role?: "status" | "alert";
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={`border-l-[3px] px-5 py-4 ${TONE_CLASSES[tone]} ${className}`} role={role}>
      {children}
    </div>
  );
}
