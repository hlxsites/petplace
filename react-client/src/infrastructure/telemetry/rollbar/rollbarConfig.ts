import { Configuration, Payload } from "rollbar";
import { readJwtClaim } from "~/util/authUtil";
import {
  APP_VERSION,
  IS_PROD_URL,
  IS_STG_URL,
  ROLLBAR_TOKEN,
} from "~/util/envUtil";

export const CREATE_ROLLBAR_CONFIG = (): Configuration => {
  const environment = (() => {
    if (IS_PROD_URL) return "production";
    if (IS_STG_URL) return "staging";
    return "development";
  })();

  const claim = readJwtClaim();
  const person: Payload["person"] = (() => {
    // Only identify the user if logged in with valid OID
    if (!claim?.oid) return undefined;
    const email = claim.emails?.[0];
    const name = `${claim.given_name ?? ""} ${claim.family_name ?? ""}`;

    return {
      id: claim.oid,
      email,
      adoptionId: claim.extension_AdoptionId,
      relationId: claim.extension_CustRelationId,
      name,
      postalCode: claim.postalCode,
    };
  })();

  return {
    accessToken: ROLLBAR_TOKEN,
    captureUncaught: true,
    captureUnhandledRejections: true,
    codeVersion: APP_VERSION,
    enabled: IS_PROD_URL || IS_STG_URL,
    environment,
    payload: {
      person,
    },
  };
};
