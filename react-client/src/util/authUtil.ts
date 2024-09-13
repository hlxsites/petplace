import { ParsedToken } from "./authTypes";
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

export function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );
    const parsedValue = JSON.parse(jsonPayload) as ParsedToken;

    return parsedValue;
  } catch (e) {
    console.error("Error parsing token", e);
  }
}

export function checkIsExternalLogin() {
  const parsedJwt = parseJwt(requireAuthToken());
  if (!parsedJwt) return undefined;

  return (
    parsedJwt.extension_CustRelationId &&
    Number(parsedJwt.extension_CustRelationId) !== 0
  );
}
