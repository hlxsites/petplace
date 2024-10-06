import { redeemTokenRequest } from '../../scripts/lib/msal/default-msal-config.js';
import { getDefaultMsalInstance } from '../../scripts/lib/msal/msal-instance.js';
import { parseJwt } from '../../scripts/parse-jwt.js';

export async function loadEager(document) {
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get('token');
  const claim = parseJwt(token);

  if (!token || !claim) {
    const main = document.querySelector('main');
    main.innerHTML = `
        <div>
            <h1>Invalid token</h1>
            <p>This link is invalid or has already expired.</p>
            <a href="/" class="button cta">Back to Homepage</a>
        </div>
    `;

    // Stop execution if token is invalid
    return;
  }

  const { email } = claim;

  const msalInstance = await getDefaultMsalInstance();
  const loginRequest = {
    ...redeemTokenRequest,
    extraQueryParameters: {
      id_token_hint: token,
      login_hint: email,
    },
    redirectUri: window.location.origin,
  };
  msalInstance.loginRedirect(loginRequest);
}
