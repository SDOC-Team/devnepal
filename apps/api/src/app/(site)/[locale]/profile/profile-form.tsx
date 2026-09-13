"use client";

import {
  type ProfileUpdate,
  profileUpdateSchema,
  type SelfMemberDto,
  SKILLS,
  type Skill,
} from "@gov-portal/shared";
import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import type { Dictionary } from "@/lib/i18n";

import { saveProfile } from "./actions";

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

export function ProfileForm({ member, dict }: { member: SelfMemberDto; dict: Dictionary }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(() => formFromMember(member));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

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
    setSaveError(null);
    setSaved(false);

    const parsed = profileUpdateSchema.safeParse(toPayload(form));
    if (!parsed.success) {
      const mapped: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        mapped[issue.path.map(String).join(".")] = issue.message;
      }
      setErrors(mapped);
      return;
    }
    setErrors({});
    setSaving(true);
    try {
      const result = await saveProfile(parsed.data);
      if (!result.ok) {
        setSaveError(result.message === "unauthorized" ? dict.profile.signInTitle : result.message);
        setErrors(result.errors);
        return;
      }
      setSaved(true);
      router.refresh();
    } catch {
      setSaveError(dict.profile.saveError);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="field-group dn-profile-form" onSubmit={onSubmit} noValidate>
      {saveError !== null ? (
        <div className="dn-state-banner is-danger error-summary" role="alert">
          {saveError}
        </div>
      ) : null}
      {saved ? (
        <div className="dn-state-banner is-success" role="status">
          {dict.profile.saved}
        </div>
      ) : null}

      <div className="field">
        <label htmlFor="displayName">{dict.profile.fields.displayName} *</label>
        <input
          id="displayName"
          className="form-control"
          type="text"
          value={form.displayName}
          maxLength={160}
          onChange={(event) => update("displayName", event.target.value)}
        />
        {errors.displayName !== undefined ? (
          <p className="field__error">{errors.displayName}</p>
        ) : (
          <p className="field__help">{dict.profile.fields.displayNameHelp}</p>
        )}
      </div>

      <div className="field-group">
        <div className="field">
          <label htmlFor="headline">{dict.profile.fields.headline}</label>
          <input
            id="headline"
            className="form-control"
            type="text"
            value={form.headline}
            maxLength={140}
            placeholder={dict.profile.fields.headlinePlaceholder}
            onChange={(event) => update("headline", event.target.value)}
          />
          {errors.headline !== undefined ? <p className="field__error">{errors.headline}</p> : null}
        </div>
        <div className="field">
          <label htmlFor="affiliation">{dict.profile.fields.affiliation}</label>
          <input
            id="affiliation"
            className="form-control"
            type="text"
            value={form.affiliation}
            maxLength={140}
            placeholder={dict.profile.fields.affiliationPlaceholder}
            onChange={(event) => update("affiliation", event.target.value)}
          />
          {errors.affiliation !== undefined ? (
            <p className="field__error">{errors.affiliation}</p>
          ) : null}
        </div>
      </div>

      <div className="field">
        <label htmlFor="location">{dict.profile.fields.location}</label>
        <input
          id="location"
          className="form-control"
          type="text"
          value={form.location}
          maxLength={100}
          placeholder={dict.profile.fields.locationPlaceholder}
          onChange={(event) => update("location", event.target.value)}
        />
        {errors.location !== undefined ? <p className="field__error">{errors.location}</p> : null}
      </div>

      <div className="field">
        <label htmlFor="bio">{dict.profile.fields.bio}</label>
        <textarea
          id="bio"
          className="form-control"
          rows={5}
          value={form.bio}
          maxLength={500}
          onChange={(event) => update("bio", event.target.value)}
        />
        <p className={errors.bio !== undefined ? "field__error" : "field__help"}>
          {errors.bio ?? dict.profile.fields.bioHelp}
        </p>
      </div>

      <fieldset className="field">
        <legend>{dict.profile.fields.links}</legend>
        {form.links.map((row, index) => (
          <div key={row.id} className="hero__actions" style={{ alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <input
                className="form-control"
                type="url"
                value={row.value}
                placeholder="https://…"
                aria-label={`${dict.profile.fields.links} ${index + 1}`}
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
                <p className="field__error">{errors[`links.${index}`]}</p>
              ) : null}
            </div>
            <button
              type="button"
              className="btn btn-sm"
              onClick={() =>
                update(
                  "links",
                  form.links.filter((entry) => entry.id !== row.id),
                )
              }
            >
              {dict.profile.fields.remove}
            </button>
          </div>
        ))}
        <div className="hero__actions">
          {form.links.length < MAX_LINKS ? (
            <button
              type="button"
              className="btn btn-sm"
              onClick={() => update("links", [...form.links, newLinkRow()])}
            >
              {dict.profile.fields.addLink}
            </button>
          ) : null}
          <p className={errors.links !== undefined ? "field__error" : "field__help"}>
            {errors.links ?? dict.profile.fields.linksHelp}
          </p>
        </div>
      </fieldset>

      <fieldset className="field">
        <legend>{dict.profile.fields.skills}</legend>
        <div className="dn-catalog-chips">
          {SKILLS.map((skill) => {
            const active = form.skills.includes(skill);
            return (
              <label key={skill}>
                <input type="checkbox" checked={active} onChange={() => toggleSkill(skill)} />
                <span>{skill}</span>
              </label>
            );
          })}
        </div>
        <p className="field__help">{dict.profile.fields.skillsHelp}</p>
      </fieldset>

      <div className="button-group dn-profile-form__actions">
        <button className="btn btn--primary" type="submit" disabled={saving}>
          {saving ? dict.profile.saving : dict.profile.save}
        </button>
      </div>
    </form>
  );
}
