interface EnvVariables {
  VITE_APP_VERSION?: string;
  VITE_AUTH_TOKEN?: string;
  PROD?: boolean;
  DEV?: boolean;
  VITE_PETPLACE_SERVER_STG_URL?: string;
  VITE_PETPLACE_SERVER_PROD_URL?: string;
  VITE_ENABLE_MOCK?: string;
  VITE_R_A_T?: string;
  VITE_R_A_T2?: string;
  VITE_R_A_T3?: string;
}

// Determine which environment object to use
const env: EnvVariables =
  typeof process !== "undefined" && process.env
    ? (process.env as EnvVariables)
    : typeof import.meta !== "undefined" && import.meta.env
      ? import.meta.env
      : {};

// Safely access environment variables
const getEnvVariable = <T>(key: keyof EnvVariables, defaultValue?: T) => {
  return (env[key] as unknown as T) || defaultValue || "";
};

// Export variables with default values
export const APP_VERSION = getEnvVariable("VITE_APP_VERSION", "");
export const AUTH_TOKEN = getEnvVariable("VITE_AUTH_TOKEN", "");
export const IS_PROD_ENV = getEnvVariable("PROD", false);
export const IS_DEV_ENV = getEnvVariable("DEV", false);

export const ENABLE_MOCK = (() => {
  const envValue = getEnvVariable<string>("VITE_ENABLE_MOCK");
  return envValue && ["true", "1"].includes(envValue.toLocaleLowerCase());
})();

const SERVER_STG_URL = getEnvVariable("VITE_PETPLACE_SERVER_STG_URL", "");
const SERVER_POD_URL = getEnvVariable("VITE_PETPLACE_SERVER_PROD_URL", "");

export const IS_PROD_URL =
  typeof window !== "undefined" &&
  (window.location.origin.includes("petplace.com") ||
    window.location.origin.includes("petplace--hlxsites.hlx.live"));

export const PETPLACE_SERVER_BASE_URL = IS_PROD_URL
  ? SERVER_POD_URL
  : SERVER_STG_URL;

// Hacky way to get the Rollbar access token and preventing it to be a single string saved on the repository
export const ROLLBAR_TOKEN = (() => {
  const part1 = getEnvVariable<string>("VITE_R_A_T");
  const part2 = getEnvVariable<string>("VITE_R_A_T2");
  const part3 = getEnvVariable<string>("VITE_R_A_T3");

  return `${part1}${part2}${part3}`;
})();
