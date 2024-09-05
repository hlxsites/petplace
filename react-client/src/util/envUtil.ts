export const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN;
export const IS_PROD_ENV = import.meta.env.PROD;
export const IS_DEV_ENV = import.meta.env.DEV;

const SERVER_STG_URL = import.meta.env.VITE_PETPLACE_SERVER_STG_URL;
const SERVER_POD_URL = import.meta.env.VITE_PETPLACE_SERVER_PROD_URL;

export const IS_PROD_URL =
  window.location.origin.includes("petplace.com") ||
  window.location.origin.includes("petplace--hlxsites.hlx.live");

export const PETPLACE_SERVER_BASE_URL = IS_PROD_URL
  ? SERVER_POD_URL
  : SERVER_STG_URL;
