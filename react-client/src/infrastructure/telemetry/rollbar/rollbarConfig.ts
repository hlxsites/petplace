import { Configuration } from "rollbar";
import { APP_VERSION, IS_PROD_URL, ROLLBAR_TOKEN } from "~/util/envUtil";

export const ROLLBAR_CONFIG: Configuration = {
  accessToken: ROLLBAR_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
  codeVersion: APP_VERSION,
  enabled: IS_PROD_URL,
  environment: IS_PROD_URL ? "production" : "development",
};
