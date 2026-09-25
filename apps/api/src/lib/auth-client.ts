export const API_BASE = "";

export async function fetchCsrfToken(): Promise<string> {
  const response = await fetch(`${API_BASE}/api/auth/csrf`, { credentials: "include" });
  if (!response.ok) {
    throw new Error(`Could not reach the authentication service (${response.status})`);
  }
  const payload = (await response.json()) as { csrfToken: string };
  return payload.csrfToken;
}

/**
 * Auth.js requires a CSRF token and its redirect chain must be followed as a
 * real navigation, so submit a hidden form rather than using fetch().
 */
function submitHiddenForm(action: string, fields: Record<string, string>): void {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = action;
  for (const [name, value] of Object.entries(fields)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.append(input);
  }
  document.body.append(form);
  form.submit();
}

export async function signInWithGitHub(callbackPath = "/"): Promise<void> {
  const csrfToken = await fetchCsrfToken();
  submitHiddenForm(`${API_BASE}/api/auth/signin/github`, {
    csrfToken,
    callbackUrl: new URL(callbackPath, window.location.origin).toString(),
  });
}

export async function signOut(): Promise<void> {
  const csrfToken = await fetchCsrfToken();
  submitHiddenForm(`${API_BASE}/api/auth/signout`, {
    csrfToken,
    callbackUrl: window.location.href,
  });
}
