import { z } from "zod";

/**
 * Fixed skills taxonomy. Stored as slugs — labels live in the frontend.
 * Extend only by adding entries here; unknown values are rejected by validation.
 */
export const SKILLS = [
  "engineering",
  "ui-ux",
  "qa",
  "security",
  "data",
  "documentation",
  "localization",
  "research",
  "community",
] as const;

export type Skill = (typeof SKILLS)[number];

export const skillSchema = z.enum(SKILLS);
