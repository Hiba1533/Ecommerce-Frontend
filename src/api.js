export const BASE_URL = "http://localhost:8080";

// Central fetch wrapper — every request goes through here, so
// credentials: "include" (send the HttpOnly cookie) never gets missed.
export async function apiFetch(path, options = {}) {
  return fetch(BASE_URL + path, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {})
    }
  });
}

// Returns { id, username, email, role } if logged in, or null if not.
export async function fetchCurrentUser() {
  try {
    const response = await apiFetch("/auth/me");
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export async function logoutRequest() {
  await apiFetch("/auth/logout", { method: "POST" });
}

export function formatPrice(value) {
  return Number(value).toLocaleString("en-IN");
}