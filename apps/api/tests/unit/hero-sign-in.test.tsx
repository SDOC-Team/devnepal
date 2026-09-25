import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/hooks", () => ({ useActor: vi.fn() }));

import { HeroSignIn } from "@/components/modules/landing/hero-sign-in";
import { useActor } from "@/hooks";

const mockedUseActor = vi.mocked(useActor);
const props = {
  label: "Sign in with GitHub",
  profileLabel: "My profile",
  retryLabel: "Retry account",
  locale: "en" as const,
};

describe("homepage authentication action", () => {
  beforeEach(() => {
    mockedUseActor.mockReset();
  });

  it("offers sign-in only after a confirmed signed-out response", () => {
    mockedUseActor.mockReturnValue({
      actor: null,
      isLoading: false,
      isSignedOut: true,
      error: undefined,
      refresh: vi.fn(),
    });

    const html = renderToStaticMarkup(<HeroSignIn {...props} />);
    expect(html).toContain("Sign in with GitHub");
    expect(html).not.toContain("My profile");
  });

  it("links a signed-in member to their profile instead of offering sign-in", () => {
    mockedUseActor.mockReturnValue({
      actor: { member: { displayName: "Member" }, isAdmin: false } as ReturnType<
        typeof useActor
      >["actor"],
      isLoading: false,
      isSignedOut: false,
      error: undefined,
      refresh: vi.fn(),
    });

    const html = renderToStaticMarkup(<HeroSignIn {...props} />);
    expect(html).toContain("My profile");
    expect(html).toContain('href="/en/profile"');
    expect(html).not.toContain("Sign in with GitHub");
  });

  it("does not mislabel a profile-fetch failure as signed out", () => {
    mockedUseActor.mockReturnValue({
      actor: null,
      isLoading: false,
      isSignedOut: false,
      error: new Error("Profile unavailable"),
      refresh: vi.fn(),
    });

    const html = renderToStaticMarkup(<HeroSignIn {...props} />);
    expect(html).toContain("Retry account");
    expect(html).not.toContain("Sign in with GitHub");
  });

  it("does not offer sign-in when account state is unresolved", () => {
    mockedUseActor.mockReturnValue({
      actor: null,
      isLoading: false,
      isSignedOut: false,
      error: undefined,
      refresh: vi.fn(),
    });

    const html = renderToStaticMarkup(<HeroSignIn {...props} />);
    expect(html).toContain("Retry account");
    expect(html).not.toContain("Sign in with GitHub");
  });
});
