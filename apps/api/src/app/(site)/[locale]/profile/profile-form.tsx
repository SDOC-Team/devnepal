"use client";

import {
  type ProfileUpdate,
  profileUpdateSchema,
  type SelfMemberDto,
  SKILLS,
  type Skill,
} from "@gov-portal/shared";
import { type FormEvent, useState } from "react";

import { StateBanner } from "@/components/modules/common";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSaveProfile } from "@/hooks";
import type { Dictionary } from "@/lib/i18n";

type LinkRow = { id: string; value: string };

type FormState = {
  displayName: string;
  headline: string;
  affiliation: string;
  location: string;
  bio: string;
  links: LinkRow[];
  skills: Skill[];
};

const MAX_LINKS = 5;

function newLinkRow(value = ""): LinkRow {
  return { id: crypto.randomUUID(), value };
}

function formFromMember(member: SelfMemberDto): FormState {
  return {
    displayName: member.displayName,
    headline: member.headline ?? "",
    affiliation: member.affiliation ?? "",
    location: member.location ?? "",
    bio: member.bio ?? "",
    links: member.links.length > 0 ? member.links.map((link) => newLinkRow(link)) : [newLinkRow()],
    skills: member.skills,
  };
}

function toPayload(form: FormState): ProfileUpdate {
  const nullable = (value: string): string | null => {
    const trimmed = value.trim();
    return trimmed.length === 0 ? null : trimmed;
  };
  return {
    displayName: form.displayName.trim(),
    headline: nullable(form.headline),
    affiliation: nullable(form.affiliation),
    location: nullable(form.location),
    bio: nullable(form.bio),
    links: form.links.map((row) => row.value.trim()).filter((link) => link.length > 0),
    skills: form.skills,
  };
}

export function ProfileForm({
  member,
  dict,
  onSaved,
}: {
  member: SelfMemberDto;
  dict: Dictionary;
  onSaved: (member: SelfMemberDto) => void;
}) {
  const [form, setForm] = useState<FormState>(() => formFromMember(member));
  const [saved, setSaved] = useState(false);
  const { save, state } = useSaveProfile((updated) => {
    setSaved(true);
    onSaved(updated);
  });

  const errors = state.status === "error" ? state.fieldErrors : {};
  const saving = state.status === "saving";

  function update<K extends keyof FormState>(key: K, value: FormState[K]): void {
    setForm((current) => ({ ...current, [key]: value }));
    setSaved(false);
  }

  function toggleSkill(skill: Skill): void {
    update(
      "skills",
      form.skills.includes(skill)
        ? form.skills.filter((entry) => entry !== skill)
        : [...form.skills, skill],
    );
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setSaved(false);

    const parsed = profileUpdateSchema.safeParse(toPayload(form));
    if (!parsed.success) {
      return;
    }
    await save(parsed.data);
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit} noValidate>
      {state.status === "error" ? (
        <StateBanner tone="danger" role="alert">
          <span className="text-error">{state.message}</span>
        </StateBanner>
      ) : null}
      {saved ? (
        <StateBanner tone="success" role="status">
          {dict.profile.saved}
        </StateBanner>
      ) : null}

      <Field>
        <FieldLabel htmlFor="displayName">{dict.profile.fields.displayName} *</FieldLabel>
        <Input
          id="displayName"
          type="text"
          value={form.displayName}
          maxLength={160}
          aria-invalid={errors.displayName !== undefined}
          onChange={(event) => update("displayName", event.target.value)}
        />
        {errors.displayName !== undefined ? (
          <FieldError>{errors.displayName}</FieldError>
        ) : (
          <FieldDescription>{dict.profile.fields.displayNameHelp}</FieldDescription>
        )}
      </Field>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="headline">{dict.profile.fields.headline}</FieldLabel>
          <Input
            id="headline"
            type="text"
            value={form.headline}
            maxLength={140}
            placeholder={dict.profile.fields.headlinePlaceholder}
            aria-invalid={errors.headline !== undefined}
            onChange={(event) => update("headline", event.target.value)}
          />
          {errors.headline !== undefined ? <FieldError>{errors.headline}</FieldError> : null}
        </Field>
        <Field>
          <FieldLabel htmlFor="affiliation">{dict.profile.fields.affiliation}</FieldLabel>
          <Input
            id="affiliation"
            type="text"
            value={form.affiliation}
            maxLength={140}
            placeholder={dict.profile.fields.affiliationPlaceholder}
            aria-invalid={errors.affiliation !== undefined}
            onChange={(event) => update("affiliation", event.target.value)}
          />
          {errors.affiliation !== undefined ? <FieldError>{errors.affiliation}</FieldError> : null}
        </Field>
      </div>

      <Field>
        <FieldLabel htmlFor="location">{dict.profile.fields.location}</FieldLabel>
        <Input
          id="location"
          type="text"
          value={form.location}
          maxLength={100}
          placeholder={dict.profile.fields.locationPlaceholder}
          aria-invalid={errors.location !== undefined}
          onChange={(event) => update("location", event.target.value)}
        />
        {errors.location !== undefined ? <FieldError>{errors.location}</FieldError> : null}
      </Field>

      <Field>
        <FieldLabel htmlFor="bio">{dict.profile.fields.bio}</FieldLabel>
        <Textarea
          id="bio"
          rows={5}
          value={form.bio}
          maxLength={500}
          aria-invalid={errors.bio !== undefined}
          onChange={(event) => update("bio", event.target.value)}
        />
        {errors.bio !== undefined ? (
          <FieldError>{errors.bio}</FieldError>
        ) : (
          <FieldDescription>{dict.profile.fields.bioHelp}</FieldDescription>
        )}
      </Field>

      <fieldset className="m-0 border-0 p-0">
        <legend className="mb-1 text-sm font-semibold text-neutral-800">
          {dict.profile.fields.links}
        </legend>
        <div className="flex flex-col gap-3">
          {form.links.map((row, index) => (
            <div key={row.id} className="flex flex-wrap items-start gap-3">
              <div className="flex-1">
                <Input
                  type="url"
                  value={row.value}
                  placeholder="https://…"
                  aria-label={`${dict.profile.fields.links} ${index + 1}`}
                  aria-invalid={errors[`links.${index}`] !== undefined}
                  onChange={(event) => {
                    update(
                      "links",
                      form.links.map((entry) =>
                        entry.id === row.id ? { ...entry, value: event.target.value } : entry,
                      ),
                    );
                  }}
                />
                {errors[`links.${index}`] !== undefined ? (
                  <p className="mt-1 text-sm text-error">{errors[`links.${index}`]}</p>
                ) : null}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  update(
                    "links",
                    form.links.filter((entry) => entry.id !== row.id),
                  )
                }
              >
                {dict.profile.fields.remove}
              </Button>
            </div>
          ))}
          <div className="flex flex-wrap items-center gap-3">
            {form.links.length < MAX_LINKS ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => update("links", [...form.links, newLinkRow()])}
              >
                {dict.profile.fields.addLink}
              </Button>
            ) : null}
            <p
              className={`m-0 text-sm ${errors.links !== undefined ? "text-error" : "text-neutral-700"}`}
            >
              {errors.links ?? dict.profile.fields.linksHelp}
            </p>
          </div>
        </div>
      </fieldset>

      <fieldset className="m-0 border-0 p-0">
        <legend className="mb-1 text-sm font-semibold text-neutral-800">
          {dict.profile.fields.skills}
        </legend>
        <div className="flex flex-wrap gap-2">
          {SKILLS.map((skill) => {
            const active = form.skills.includes(skill);
            return (
              <label key={skill} className="cursor-pointer">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => toggleSkill(skill)}
                  className="peer absolute size-px opacity-0"
                />
                <span className="inline-flex min-h-[var(--control-sm)] items-center rounded-pill border border-divider-strong px-3 text-xs font-semibold text-neutral-800 hover:border-accent-300 hover:bg-accent-100 hover:text-accent-800 peer-checked:border-accent-700 peer-checked:bg-accent-700 peer-checked:text-paper peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
                  {skill}
                </span>
              </label>
            );
          })}
        </div>
        <p className="mt-3 mb-0 text-sm text-neutral-700">{dict.profile.fields.skillsHelp}</p>
      </fieldset>

      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? dict.profile.saving : dict.profile.save}
        </Button>
      </div>
    </form>
  );
}
