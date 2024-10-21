import { z } from "zod";
import { logError } from "~/infrastructure/telemetry/logUtils";
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

function getAuthToken() {
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

function parseJwt(token: string | null) {
  if (!token) return null;

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
  } catch (error) {
    logError("Error parsing token", error);
  }
  return null;
}

/**
 * Reads and validates JWT claims using a predefined schema.
 *
 * @returns The parsed JWT claims if valid, otherwise null.
 */
export function readJwtClaim() {
  const schema = z.object({
    emails: z.array(z.string()),
    extension_AdoptionId: z.string().nullish(),
    extension_CustRelationId: z.string().nullish(),
    family_name: z.string().nullish(),
    given_name: z.string().optional().nullish(),
    // User's unique identifier
    // https://learn.microsoft.com/en-us/entra/identity-platform/id-token-claims-reference
    oid: z.string().nullish(),
    postalCode: z.string().nullish(),
  });

  const token = getAuthToken();
  const parsedJwt = parseJwt(token);
  if (!parsedJwt) return null;

  try {
    return schema.parse(parsedJwt);
  } catch (error) {
    logError("Error parsing jwt claim", error);
    return null;
  }
}

/**
 * Checks if Single Sign-On (SSO) is enabled for login.
 *
 * This function reads the JWT claim and verifies if the `extension_CustRelationId`
 * exists and is not zero, indicating that SSO is enabled.
 *
 * @returns `true` if SSO is enabled, `false` otherwise.
 */
export function checkIsSsoEnabledLogin(): boolean {
  const claim = readJwtClaim();
  if (!claim) return false;

  const relationId = claim.extension_CustRelationId || null;
  return relationId !== "0";
}
