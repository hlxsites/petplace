import Rollbar from "rollbar";
import { IS_DEV_ENV } from "~/util/envUtil";
import { CREATE_ROLLBAR_CONFIG } from "./rollbar/rollbarConfig";

export const logError = (message: string, error?: unknown) => {
  const newError = errorHandler(error);
  if (IS_DEV_ENV) {
    console.log(message, newError);
  }

  const rollbar = new Rollbar(CREATE_ROLLBAR_CONFIG());
  rollbar?.error(message, newError);
};

export const logWarning = (message: string, error?: unknown) => {
  const newError = errorHandler(error);
  if (IS_DEV_ENV) {
    console.log(message, newError);
  }

  const rollbar = new Rollbar(CREATE_ROLLBAR_CONFIG());
  rollbar?.warning(message, newError);
};

function errorHandler(error: unknown) {
  if (error instanceof Error) {
    return error;
  }
  if (typeof error === "object") {
    return new Error(JSON.stringify(error));
  }

  return new Error(String(error));
}
