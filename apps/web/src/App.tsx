import type { PublicMemberDto, SelfMemberDto } from "@gov-portal/shared";
import { useEffect, useState } from "react";

import { API_BASE, fetchMembers, fetchOwnProfile } from "./api";
import { signInWithGitHub } from "./auth";

export function App() {
  const [members, setMembers] = useState<PublicMemberDto[]>([]);
  const [profile, setProfile] = useState<SelfMemberDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [directory, own] = await Promise.all([fetchMembers(), fetchOwnProfile()]);
        if (!cancelled) {
          setMembers(directory);
          setProfile(own);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Unknown error");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="page">
      <header className="header">
        <div>
          <p className="eyebrow">Gov Portal · placeholder frontend</p>
          <h1>Member directory</h1>
        </div>
        <div className="session">
          {profile === null ? (
            <button type="button" onClick={() => void signInWithGitHub("/")}>
              Sign in with GitHub
            </button>
          ) : (
            <p>
              Signed in as <strong>{profile.displayName}</strong>{" "}
              <span className={`status status-${profile.status}`}>{profile.status}</span>
            </p>
          )}
        </div>
      </header>

      {loading ? <p>Loading members…</p> : null}

      {error !== null ? (
        <section className="error">
          <p>
            Could not reach the API ({API_BASE}): {error}
          </p>
          <p>
            Start it with <code>bun run dev</code> and seed data with <code>bun run db:seed</code>.
          </p>
        </section>
      ) : null}

      {!loading && error === null ? (
        <section className="grid">
          {members.map((member) => (
            <article key={member.githubId} className="card">
              {member.avatarUrl !== null ? (
                <img src={`${API_BASE}${member.avatarUrl}`} alt="" className="avatar" />
              ) : (
                <div className="avatar avatar-fallback">{member.displayName.slice(0, 1)}</div>
              )}
              <div>
                <h2>{member.displayName}</h2>
                <p className="muted">@{member.githubUsername}</p>
                {member.headline !== null ? <p>{member.headline}</p> : null}
                {member.location !== null ? <p className="muted">{member.location}</p> : null}
                <ul className="skills">
                  {member.skills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
          {members.length === 0 ? <p>No approved members yet.</p> : null}
        </section>
      ) : null}

      <footer className="footer">
        Placeholder UI — the real interface replaces this app. Data comes from the REST API;
        contracts live in <code>packages/shared</code>.
      </footer>
    </main>
  );
}
