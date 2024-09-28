import { acquireToken, changePassword, isLoggedIn, login } from '../../scripts/lib/msal/msal-authentication.js';

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
    const buttonId = 'react-login-button';

    block.innerHTML = `
      <div id="login-required-message">
          <img src="${window.location.origin}/images/react/login-friendly-dog-and-cat.png" alt="Friendly dog and a cat together">
          <h1>This is page requires to be logged in.</h1>
          <p>Please login to get access to your pets' documents, insurance, membership information and much more.</p>
          <button id="${buttonId}" type="button">Log In</button>
      </div>
  `;

  block.querySelector(`#${buttonId}`).addEventListener('click', async () => {
    login(() => {
      // Reload the page after successful login to get the token and render the React app
      window.location.reload();
    });
  });

    // Stop execution if token is invalid
    return;
  }

  window.reactChangePassword = async function () {
    await changePassword();
  };

  window.refreshAuthToken = async function () {
    const newToken = await getAuthToken();
    window.document.getElementById('auth-token').value = newToken;
  };

  // Set React entry point
  // Insert the token into the DOM as a hidden input element so React can access it
  block.innerHTML = `
    <div id="react-root"></div>
    <input id="auth-token" type="hidden" value="${token}" />
    <button aria-hidden="true" id="react-password-change" class="hidden" onclick="reactChangePassword()">Change Password</button>
    <button aria-hidden="true" id="refresh-auth-token" class="hidden" onclick="refreshAuthToken()">refresh token</button>
  `;

  import('./react-index.min.js');
}
