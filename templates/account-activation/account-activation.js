import { getDefaultMsalInstance } from '../../scripts/lib/msal/msal-instance.js';

function parseJwt(token) {
  if (!token) return null;

  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(window.atob(base64).split('').map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`).join(''));

  return JSON.parse(jsonPayload);
}

export async function loadEager(document) {
  const main = document.querySelector('main');

  // cleanup body html
  document.body.innerHTML = '';
  document.body.appendChild(main);

  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get('token');

  const claim = parseJwt(token);
  if (claim) {
    const { email } = claim;

    const msalInstance = await getDefaultMsalInstance();
    const loginRequest = {
      extraQueryParameters: {
        id_token_hint: token,
        login_hint: email,
        source: 'petplace-account-activation',
      },
    };
    msalInstance.loginRedirect(loginRequest);
  }
}
