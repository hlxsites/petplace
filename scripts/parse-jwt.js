import { acquireToken, isLoggedIn } from './lib/msal/msal-authentication.js';
import { captureError } from './scripts.js';

export async function getAuthToken() {
  try {
    // We need to call isLoggedIn() first to prevent acquireToken() from breaking franklin flow
    const loggedIn = await isLoggedIn();
    if (!loggedIn) return null;

    return await acquireToken() || null;
  } catch (e) {
    captureError('account activation getAuthToken', e);
    return null;
  }
}

export function parseJwt(token) {
  if (!token) return null;

  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    captureError('account activation parseJwt', e);
    return null;
  }
}
