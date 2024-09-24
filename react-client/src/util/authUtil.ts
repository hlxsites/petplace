import { z } from "zod";
import { AUTH_TOKEN } from "./envUtil";
import { invariantResponse } from "./invariant";

export function refreshAuthToken() {
  // Try to find the invisible refresh button
  const refreshButton = document.getElementById("refresh-auth-token");

  const event = new MouseEvent("click", {
    bubbles: true,
    cancelable: true,
    view: window,
  });
  refreshButton?.dispatchEvent(event);
}

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
    const parsedValue = JSON.parse(jsonPayload) as Record<string, unknown>;

    return parsedValue;
  } catch (e) {
    console.error("Error parsing token", e);
  }
}

export function readJwtClaim() {
  const schema = z.object({
    extension_CustRelationId: z.string().nullish(),
    postalCode: z.string().nullish(),
  });

  const parsedJwt = parseJwt(requireAuthToken());
  if (!parsedJwt) return null;

  try {
    return schema.parse(parsedJwt);
  } catch (error) {
    console.error("Error parsing jwt claim", error);
    return null;
  }
}

export function checkIsExternalLogin() {
  const claim = readJwtClaim();
  return (
    !!claim?.extension_CustRelationId &&
    Number(claim.extension_CustRelationId) !== 0
  );
}
