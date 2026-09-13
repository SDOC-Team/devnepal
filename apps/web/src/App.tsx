import type { PublicMemberDto, SelfMemberDto } from "@gov-portal/shared";
import { useEffect, useState } from "react";

import { API_BASE, fetchMember, fetchMembers, fetchOwnProfile } from "./api";
import { signInWithGitHub } from "./auth";
import { AdminDashboard } from "./modules/admin";
import { Footer } from "./modules/common/footer";
import { Header } from "./modules/common/header";
import { Hero } from "./modules/landing";
import { MemberDetail, MembersSection } from "./modules/member";

/** Minimal path-based routing; no router dependency yet. */
type Route = { name: "home" } | { name: "member"; username: string } | { name: "admin" };

function parseRoute(pathname: string): Route {
  if (pathname === "/admin") {
    return { name: "admin" };
  }
  const match = /^\/members\/([^/]+)$/.exec(pathname);
  if (match?.[1] !== undefined) {
    return { name: "member", username: decodeURIComponent(match[1]) };
  }
  return { name: "home" };
}

export function App() {
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.pathname));
  const [members, setMembers] = useState<PublicMemberDto[]>([]);
  const [member, setMember] = useState<PublicMemberDto | null>(null);
  const [profile, setProfile] = useState<SelfMemberDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Keep the view in step with browser back/forward.
  useEffect(() => {
    function onPopState() {
      setRoute(parseRoute(window.location.pathname));
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const own = await fetchOwnProfile();
        if (!cancelled) {
          setProfile(own);
        }

        if (route.name === "member") {
          const detail = await fetchMember(route.username);
          if (!cancelled) {
            setMember(detail);
          }
        } else if (route.name === "home") {
          const directory = await fetchMembers();
          if (!cancelled) {
            setMembers(directory);
          }
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
  }, [route]);

  function navigate(path: string) {
    window.history.pushState({}, "", path);
    setRoute(parseRoute(path));
  }

  const sessionSlot =
    profile === null ? undefined : (
      <span className="text-[14px] text-(--color-text-secondary)">
        {profile.displayName}
        <span className="ml-2 rounded-full border border-(--color-border-accent) px-2 py-0.5 text-[12px]">
          {profile.status}
        </span>
      </span>
    );

  return (
    <div className="flex min-h-screen flex-col bg-(--color-surface-default)">
      <Header onSignIn={() => void signInWithGitHub("/")} sessionSlot={sessionSlot} />

      {route.name === "home" ? (
        <Hero
          actionLabel={profile === null ? "Sign in with Github" : undefined}
          onAction={() => void signInWithGitHub("/")}
        />
      ) : null}

      <main className="mx-auto flex w-full max-w-[1448px] flex-1 flex-col gap-12 px-8 py-12 max-sm:px-4">
        {error !== null ? (
          <section className="rounded-lg border border-[#cf222e] bg-[#ffebe9] p-4 text-[14px]">
            <p className="m-0">
              Could not reach the API ({API_BASE}): {error}
            </p>
          </section>
        ) : null}

        {route.name === "home" && error === null ? (
          <>
            <MembersSection id="members" members={members} loading={loading} />
            {/* Required: the state must not present these claims as verified. */}
            <p className="m-0 text-[13px] text-(--color-text-muted) leading-5">
              Affiliations are self-declared.
            </p>
          </>
        ) : null}

        {route.name === "member" && error === null && member !== null ? (
          <MemberDetail member={member} onBack={() => navigate("/")} />
        ) : null}

        {route.name === "admin" ? <AdminDashboard /> : null}
      </main>

      <Footer />
    </div>
  );
}
