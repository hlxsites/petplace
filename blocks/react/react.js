import { acquireToken, isLoggedIn } from '../../scripts/lib/msal/msal-authentication.js';

async function getAuthToken() {
  try {
    // We need to call isLoggedIn() first to prevent acquireToken() from breaking franklin flow
    const loggedIn = await isLoggedIn()
    if (!loggedIn) return null;

    return await acquireToken() || null;
  } catch (_) {
    return null;
  }
}


export default async function decorate(block) {
  const token = await getAuthToken();
  if (!token) {
    block.innerHTML = `
      <div id="login-required-message">
          <h1>Login required</h1>
          <p>Enter with your account to access this page.</p>
      </div>
  `;

    // Stop execution if token is invalid
    return;
  }

  // Set React entry point
  block.id = 'react-root';
  // Insert the token into the DOM as a hidden input element so React can access it
  block.innerHTML = `<input id="auth-token" type="hidden" value="${token}" />`;

  import('./react-index.js');
}
