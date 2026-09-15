/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Keep type/scope in sync with this monorepo's structure.
    "type-enum": [
      2,
      "always",
      [
        "feat", // new feature
        "fix", // bug fix
        "docs", // documentation only
        "style", // formatting, whitespace — no code meaning change
        "refactor", // code change that neither fixes a bug nor adds a feature
        "perf", // performance improvement
        "test", // adding or correcting tests
        "build", // build system or external dependencies
        "ci", // CI configuration
        "chore", // maintenance that doesn't fit elsewhere
        "revert", // reverts a previous commit
      ],
    ],
    "scope-enum": [
      2,
      "always",
      [
        "api",
        "web",
        "shared",
        "db",
        "auth",
        "members",
        "admin",
        "landing",
        "common",
        "i18n",
        "ci",
        "deps",
        "repo",
      ],
    ],
    "scope-empty": [0], // scope is optional
    "subject-case": [2, "never", ["upper-case", "start-case", "pascal-case"]],
    "header-max-length": [2, "always", 100],
  },
};
