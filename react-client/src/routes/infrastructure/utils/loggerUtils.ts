import Rollbar from "rollbar";

const rollbar = new Rollbar({
  accessToken: process.env.VITE_ROLLBAR_ACCESS_TOKEN,
  environment: process.env.NODE_ENV,
});

export const logError = (message: string, error?: unknown) => {
  const newError = errorHandler(error);
  rollbar.error(message, newError);
};

export const logWarning = (message: string, error?: unknown) => {
  const newError = errorHandler(error);
  rollbar.warning(message, newError);
};

function errorHandler(error: unknown) {
  if (error instanceof Error) {
    return error;
  }
  return new Error(String(error));
}
