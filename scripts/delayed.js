// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './lib-franklin.js';
import { isLoggedIn } from './lib/msal/msal-authentication.js';

function showLoginOrProfileButton() {
  isLoggedIn().then((status) => {
    const userBtn = document.querySelector('.nav .nav-login .user-btn');
    const loginBtn = document.querySelector('.nav .nav-login .login-btn');
    userBtn.classList.toggle('hidden', !status);
    loginBtn.classList.toggle('hidden', status);
  });
}

// Core Web Vitals RUM collection
sampleRUM('cwv');
showLoginOrProfileButton();
