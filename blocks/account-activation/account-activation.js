import { getDefaultMsalInstance } from '../../scripts/lib/msal/msal-instance.js';

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(window.atob(base64).split('').map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`).join(''));

  return JSON.parse(jsonPayload);
}

export default async function decorate(block) {
  block.innerHTML = 'Please wait...';

  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get('token');

  const claim = parseJwt(token);
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
