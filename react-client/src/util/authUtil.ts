import { AUTH_TOKEN } from "./envUtil";
import { invariantResponse } from "./invariant";

export function getAuthToken() {
  const authToken = document
    .getElementById("auth-token")
    ?.getAttribute("value");

  return authToken || AUTH_TOKEN || null;
}

export function requireAuthToken() {
  const authToken = getAuthToken();

  invariantResponse(authToken, "Unauthorized", {
    status: 401,
  });

  return authToken;
}
