import type { Member } from "@gov-portal/api-client";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { MemberProfileContent } from "@/app/(site)/[locale]/members/[username]/member-profile-content";
import { getDictionary } from "@/lib/i18n";

const emptyProfile: Member = {
  githubId: 123,
  githubUsername: "member",
  displayName: "Member",
  headline: null,
  affiliation: null,
  location: null,
  bio: null,
  links: [],
  skills: [],
  avatarUrl: null,
};

describe("public member profile content", () => {
  it("shows a meaningful empty card for visitors", () => {
    const html = renderToStaticMarkup(
      <MemberProfileContent
        profile={emptyProfile}
        dict={getDictionary("en")}
        locale="en"
        isOwner={false}
      />,
    );

    expect(html).toContain('aria-labelledby="member-about-heading"');
    expect(html).toContain("No additional details yet");
    expect(html).not.toContain("Add profile details");
  });

  it("offers the owner a route to complete an empty profile", () => {
    const html = renderToStaticMarkup(
      <MemberProfileContent
        profile={emptyProfile}
        dict={getDictionary("ne")}
        locale="ne"
        isOwner
      />,
    );

    expect(html).toContain("थप विवरण अझै छैन");
    expect(html).toContain('href="/ne/profile"');
  });

  it("keeps sparse details in the same content card", () => {
    const html = renderToStaticMarkup(
      <MemberProfileContent
        profile={{ ...emptyProfile, affiliation: "Public Office", skills: ["engineering"] }}
        dict={getDictionary("en")}
        locale="en"
        isOwner={false}
      />,
    );

    expect(html).toContain("Public Office");
    expect(html).toContain("Engineering");
    expect(html).not.toContain("No additional details yet");
    expect(html.match(/<section/g)).toHaveLength(1);
  });

  it("renders a bio and links without an empty message", () => {
    const html = renderToStaticMarkup(
      <MemberProfileContent
        profile={{ ...emptyProfile, bio: "Building public tools.", links: ["https://example.org"] }}
        dict={getDictionary("en")}
        locale="en"
        isOwner={false}
      />,
    );

    expect(html).toContain("Building public tools.");
    expect(html).toContain('href="https://example.org"');
    expect(html).not.toContain("No additional details yet");
  });
});
