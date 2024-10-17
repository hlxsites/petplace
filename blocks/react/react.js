import { changePassword, login } from '../../scripts/lib/msal/msal-authentication.js';
import { getAuthToken } from '../../scripts/parse-jwt.js';

/**
 * Attempts to retrieve an authentication token with a specified number of retries.
 *
 * Sometimes the token may not be available immediately,
 * so this function will try to get the token multiple times before displaying the require login UI.
 *
 * @returns {Promise<string|null>} A promise that resolves to the authentication token if successful, or `null` if all attempts fail.
 */
function getAuthTokenWithRetries() {
  const totalRetries = 2;

  return new Promise(async (resolve) => {
    let token = await getAuthToken();
    let attempts = 0;

    while (!token && attempts < totalRetries) {
      attempts++;

      // Wait for 1 second before trying again
      await new Promise((r) => setTimeout(r, 1000));

      // Try to get the token again
      token = await getAuthToken();
    }

    resolve(token || null);
  });
}

export default async function decorate(block) {
  // Show loading spinner while waiting for the token
  block.innerHTML = `
    <div id="react-block-loading">
      <svg
        class="animate-spin"
        xmlns="http://www.w3.org/2000/svg"
        width="32px"
        height="32px"
        view-box="0 0 32 32"
        fill="none"
        name="loadingIcon"
      >
        <path
          d="M30 16C30 17.8385 29.6379 19.659 28.9343 21.3576C28.2308 23.0561 27.1995 24.5995 25.8995 25.8995C24.5995 27.1995 23.0561 28.2307 21.3576 28.9343C19.659 29.6379 17.8385 30 16 30C14.1615 30 12.341 29.6379 10.6424 28.9343C8.94387 28.2307 7.40052 27.1995 6.1005 25.8995C4.80048 24.5995 3.76925 23.0561 3.06569 21.3576C2.36212 19.659 2 17.8385 2 16C2 14.1615 2.36212 12.341 3.06569 10.6424C3.76926 8.94387 4.80049 7.40052 6.10051 6.1005C7.40053 4.80048 8.94388 3.76925 10.6424 3.06568C12.341 2.36212 14.1615 2 16 2C17.8385 2 19.659 2.36212 21.3576 3.06569C23.0561 3.76926 24.5995 4.80049 25.8995 6.10051C27.1995 7.40053 28.2308 8.94388 28.9343 10.6424C29.6379 12.341 30 14.1615 30 16L30 16Z"
          stroke="#D0D0D6"
          stroke-width="4"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M16 2C18.5819 2 21.1135 2.71399 23.315 4.06304C25.5164 5.41208 27.3019 7.34363 28.4741 9.64413C29.6463 11.9446 30.1594 14.5245 29.9568 17.0984C29.7543 19.6724 28.8439 22.1402 27.3262 24.229C25.8086 26.3178 23.7429 27.9463 21.3576 28.9343C18.9722 29.9224 16.36 30.2315 13.8099 29.8276C11.2598 29.4237 8.87103 28.3225 6.90773 26.6457C4.94443 24.9689 3.48306 22.7818 2.68521 20.3262"
          stroke="#7369AB"
          stroke-width="4"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  `

  // Attention: don't use 'await' here since it blocks the execution of the rest of the code
  // and the loading spinner won't be displayed
  getAuthTokenWithRetries().then((token) => {
    // Display the login required message if the token doesn't exist
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

      // Guard to stop the execution
      return;
    }

    // Expose a function into the global scope to change the password
    // so React app can access them
    window.reactChangePassword = async function () {
      await changePassword();
    };

    // Expose a function into the global scope to refresh the auth token
    // so React app can access it
    window.reactRefreshAuthToken = async function () {
      const newToken = await getAuthToken();
      // Update the token in the DOM
      window.document.getElementById('auth-token').value = newToken;
    };

    // Set React entry point
    // Insert the token into the DOM as a hidden input element so React can access it
    block.innerHTML = `
      <div id="react-root"></div>
      <input id="auth-token" type="hidden" value="${token}" />
      <button aria-hidden="true" id="react-password-change" class="hidden" onclick="reactChangePassword()">Change Password</button>
      <button aria-hidden="true" id="refresh-auth-token" class="hidden" onclick="reactRefreshAuthToken()">refresh token</button>
    `;

    import('./react-index.min.js');
  });
}
