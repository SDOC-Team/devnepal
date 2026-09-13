import { API_BASE } from "./api";

/**
 * Auth.js requires a CSRF token for sign-in. Fetch it, then submit a real
 * browser form so the 302 chain to GitHub is followed as a navigation
 * (a fetch() could not read the cross-origin redirect).
 */
export async function signInWithGitHub(callbackPath = "/"): Promise<void> {
  const csrfResponse = await fetch(`${API_BASE}/api/auth/csrf`, { credentials: "include" });
  if (!csrfResponse.ok) {
    throw new Error("Could not start GitHub sign-in");
  }
  const { csrfToken } = (await csrfResponse.json()) as { csrfToken: string };

  const form = document.createElement("form");
  form.method = "POST";
  form.action = `${API_BASE}/api/auth/signin/github`;

  const csrfInput = document.createElement("input");
  csrfInput.type = "hidden";
  csrfInput.name = "csrfToken";
  csrfInput.value = csrfToken;
  form.append(csrfInput);

  const callbackInput = document.createElement("input");
  callbackInput.type = "hidden";
  callbackInput.name = "callbackUrl";
  callbackInput.value = new URL(callbackPath, window.location.origin).toString();
  form.append(callbackInput);

  document.body.append(form);
  form.submit();
}
