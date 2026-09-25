import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

import { getEnv } from "./config";
import { findByGithubId } from "./server/members/repository";
import { ensureMemberFromGithubLogin } from "./server/members/service";
import { resolveRedirectTarget } from "./server/redirect";

type GithubIdentity = {
  id: number;
  login: string;
  name: string | null;
  avatarUrl: string | null;
};

function readGithubProfile(profile: unknown): GithubIdentity | null {
  if (typeof profile !== "object" || profile === null) {
    return null;
  }
  const raw = profile as Record<string, unknown>;
  const id =
    typeof raw.id === "number" ? raw.id : typeof raw.id === "string" ? Number(raw.id) : Number.NaN;
  const login = typeof raw.login === "string" ? raw.login : "";
  if (!Number.isSafeInteger(id) || id <= 0 || login.length === 0) {
    return null;
  }
  return {
    id,
    login,
    name: typeof raw.name === "string" ? raw.name : null,
    avatarUrl: typeof raw.avatar_url === "string" ? raw.avatar_url : null,
  };
}

export const { handlers, auth } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      // read:user only — the platform never requests or stores email addresses.
      authorization: { params: { scope: "read:user" } },
    }),
  ],
  callbacks: {
    redirect({ url, baseUrl }) {
      return resolveRedirectTarget({ url, baseUrl, webOrigin: getEnv().WEB_ORIGIN });
    },
    async signIn({ account, profile }) {
      if (account?.provider !== "github") {
        return false;
      }
      const identity = readGithubProfile(profile);
      if (identity === null) {
        return false;
      }
      await ensureMemberFromGithubLogin({
        githubId: identity.id,
        githubUsername: identity.login,
        displayName: identity.name,
        avatarUrl: identity.avatarUrl,
      });
      return true;
    },
    async jwt({ token, account, profile }) {
      if (account !== null && profile !== undefined) {
        const identity = readGithubProfile(profile);
        if (identity !== null) {
          const member = await findByGithubId(identity.id);
          if (member !== null) {
            token.memberId = member.id;
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (typeof token.memberId === "string") {
        session.user.id = token.memberId;
      }
      return session;
    },
  },
});
