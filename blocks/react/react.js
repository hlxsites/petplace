import { acquireToken, isLoggedIn, login } from '../../scripts/lib/msal/msal-authentication.js';

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
          <img src="${window.location.origin}/blocks/react/react-onboarding-friendly-dog-and-cat.png" alt="Friendly dog and a cat together">
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

  // Set React entry point
  block.id = 'react-root';
  // Insert the token into the DOM as a hidden input element so React can access it
  block.innerHTML = `<input id="auth-token" type="hidden" value="${token}" />`;

  import('./react-index.js');
}
