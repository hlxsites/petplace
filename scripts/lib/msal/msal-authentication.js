/* eslint-disable */
import { getDefaultMsalInstance, getMsalInstance } from './msal-instance.js';
import { initRedirectHandlers } from './login-redirect-handlers.js';
import {
  loginRequest,
  logoutRequest,
  tokenRequest,
  changePwdRequest,
  msalConfig,
  msalChangePwdConfig,
  getB2CPolicies,
} from './default-msal-config.js';
import { isMobile } from '../../scripts.js';
import endPoints from '../../../variables/endpoints.js';
import { pushToDataLayer } from '../../utils/helpers.js';
import { captureError } from '../../scripts.js';

let cachedMsalInstance = null;
let cachedMsalChangePwdInstance = null;

async function initializeMsalInstances() {
  if (cachedMsalInstance || cachedMsalChangePwdInstance) {
    return { msalInstance: cachedMsalInstance, msalChangePwdInstance: cachedMsalChangePwdInstance };
  }

  let msalInstance;
  let msalChangePwdInstance;

  if (document.querySelector('.account')) {
    msalChangePwdInstance = await getMsalInstance(msalChangePwdConfig);
    msalInstance = await getDefaultMsalInstance();
    msalChangePwdInstance.initialize().then(() => {
      msalChangePwdInstance.handleRedirectPromise().then(handleResponse).catch((error) => {
        // eslint-disable-next-line no-console
        console.log(error);
      });
    });
  } else {
    msalInstance = await getDefaultMsalInstance();
    msalInstance.initialize().then(() => {
      msalInstance.handleRedirectPromise().then(response => {
        handleResponse(response, response => initRedirectHandlers(response), localStorage.getItem('featureName'));
        localStorage.removeItem('featureName');
      })
        .catch((error) => {
          console.log(error);
        });
    });
  }

  // in case of page refresh
  if (msalInstance) {
    selectAccount(msalInstance);
  } else {
    selectAccount(msalChangePwdInstance);
  }

  cachedMsalInstance = msalInstance;
  cachedMsalChangePwdInstance = msalChangePwdInstance;

  return { msalInstance: cachedMsalInstance, msalChangePwdInstance: cachedMsalChangePwdInstance };
}

function checkFragment() {
  const hash = window.location.hash;
  if (hash.startsWith('#state')) {
    // handle mobile redirect response
    initializeMsalInstances();
  }
}

// When using loginRedirect() flow for mobile, Azure redirects user to the root of the site (i.e. the home page).
// We must include msal.js in this scenario so that we can properly create the user's session and redirect them.
checkFragment();

/**
 *
 * @param {*} callback individual features can pass their own custom callback function to be invoked after the user has successfully logged in, e.g. invoke the Favorite API for a pet.
 * @param {*} featureName name of the feature that is invoking the login function, e.g. "Favorite". Used for logging purposes when a user signs up an account for the first time.
 */
export async function login(callback, featureName) {
  let msalInstance = await getDefaultMsalInstance();

  const successCallback = () => {
    document.querySelector('.nav-login .user-btn').classList.remove('hidden');
    document.querySelector('.nav-login .login-btn').classList.add('hidden');

    // For React-client specific pages, we need to reload the page after login to reload react block
    const isCheckoutPage = window.location.pathname.startsWith('/checkout');
    const isAccountPage = window.location.pathname.startsWith('/account');
    if (isCheckoutPage || isAccountPage) {
      window.location.reload();
    }
  }

  // use loginRedirect() for mobile devices, use loginPopup() for desktop.
  if (isMobile()) {
    msalInstance.loginRedirect(loginRequest)
      .then((response) => handleResponse(response, callback, featureName))
      .then(successCallback)
      .catch((error) => {
        console.log(error);
      });
  } else {
    msalInstance.loginPopup(loginRequest)
      .then((response) => handleResponse(response, callback, featureName))
      .then(successCallback)
      .catch((error) => {
        console.log(error);
      });
  }
}

export async function logout() {
  /**
     * You can pass a custom request object below. This will override the initial configuration. For more information, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#request
     */

  let msalInstance = await getDefaultMsalInstance();

  if (isMobile()) {
    msalInstance.logoutRedirect(logoutRequest);
  } else {
    msalInstance.logoutPopup(logoutRequest);
  }
}

/**
 *
 * @param {*} featureName name of the feature that is invoking the login function, e.g. "Favorite". Used for logging purposes when a user signs up an account for the first time.
 * @returns a Promise that resolves with the access token
 */
export function acquireToken(featureName) {
  if (featureName) {
    // save in localStorage for loginRedirect() scenarios
    localStorage.setItem('featureName', featureName);
  }

  return new Promise(async (resolve, reject) => {
    let { msalInstance } = await initializeMsalInstances();

    const accounts = msalInstance.getAllAccounts();

    if (accounts.length === 1) {
      msalInstance.acquireTokenSilent({ account: accounts[0], scopes: tokenRequest.scopes })
        .then(function (accessTokenResponse) {
          // Acquire token silent success
          let accessToken = accessTokenResponse.accessToken;
          resolve(accessToken);
        })
        .catch(function (error) {
          //Acquire token silent failure, and send an interactive request
          if (error instanceof msal.InteractionRequiredAuthError || error.name === 'InteractionRequiredAuthError') {
            if (isMobile()) {
              msalInstance
                .acquireTokenRedirect(tokenRequest)
                .then(function (accessTokenResponse) {
                  // Acquire token interactive success
                  let accessToken = accessTokenResponse.accessToken;
                  resolve(accessToken);
                })
                .catch(function (error) {
                  // Acquire token interactive failure
                  // eslint-disable-next-line no-console
                  console.error(error);
                  reject(error);
                });
            } else {
              msalInstance
                .acquireTokenPopup(tokenRequest)
                .then(function (accessTokenResponse) {
                  // Acquire token interactive success
                  let accessToken = accessTokenResponse.accessToken;
                  resolve(accessToken);
                })
                .catch(function (error) {
                  // Acquire token interactive failure
                  console.error(error);
                  reject(error);
                });
            }
          } else {
            // eslint-disable-next-line no-console
            console.log(error);
            reject(error);
          }
        });
    } else if (accounts.length === 0) {
      // prompt login if no token exists
      login((tokenResponse) => resolve(tokenResponse.accessToken), featureName);
    } else if (accounts.length > 1) {
      // Multiple users detected. Logout all to be safe.
      logout();
    }
  });
}

// function to check if user is logged in or not
export function isLoggedIn() {
  return new Promise(async (resolve, reject) => {
    let { msalInstance } = await initializeMsalInstances();

    const accounts = msalInstance.getAllAccounts();
    msalInstance.acquireTokenSilent({ account: accounts[0], scopes: tokenRequest.scopes })
      .then(function (accessTokenResponse) {
        // User is logged in with a valid session
        resolve(true);
      })
      .catch(function (error) {
        // Token has expired or user interaction is required
        resolve(false);
      });
  });
}

export async function changePassword(callback, featureName) {
  let msalChangePwdInstance = await getMsalInstance(msalChangePwdConfig);

  isLoggedIn().then(isLoggedIn => {
    if (isLoggedIn) {
      // use loginRedirect() for mobile devices, use loginPopup() for desktop.
      if (isMobile()) {
        msalChangePwdInstance.loginRedirect(changePwdRequest)
          .then((response) => handleResponse(response, callback, featureName))
          .catch(error => {
            // eslint-disable-next-line no-console
            console.log(error);
          });
      } else {
        msalChangePwdInstance.loginPopup(changePwdRequest)
          .then((response) => handleResponse(response, callback, featureName))
          .catch(error => {
            // eslint-disable-next-line no-console
            console.log(error);
          });
      }
    } else {
      logout();
    }
  });
}

async function selectAccount(msalInstance) {
  /**
     * See here for more info on account retrieval:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
     */

  if (msalInstance === undefined) {
    return;
  }

  const currentAccounts = msalInstance.getAllAccounts();

  if (currentAccounts.length < 1) {
    // azure user not logged in
    return;
  } else if (currentAccounts.length > 1) {
    let b2cPolicies = getB2CPolicies();
    /**
         * Due to the way MSAL caches account objects, the auth response from initiating a user-flow
         * is cached as a new account, which results in more than one account in the cache. Here we make
         * sure we are selecting the account with homeAccountId that contains the sign-up/sign-in user-flow,
         * as this is the default flow the user initially signed-in with.
         */
    const accounts = currentAccounts.filter(account =>
      account.homeAccountId.toUpperCase().includes(b2cPolicies.names.signUpSignIn.toUpperCase())
            && account.idTokenClaims.iss.toUpperCase().includes(b2cPolicies.authorityDomain.toUpperCase())
            && account.idTokenClaims.aud === msalConfig.auth.clientId);
    if (accounts.length > 1) {
      // localAccountId identifies the entity for which the token asserts information.
      if (accounts.every(account => account.localAccountId === accounts[0].localAccountId)) {
        // All accounts belong to the same user
        // setAccount(accounts[0]);
      } else {
        // Multiple users detected. Logout all to be safe.
        logout();
      }
    } else if (accounts.length === 1) {
      // setAccount(accounts[0]);
    }

  } else if (currentAccounts.length === 1) {
    // setAccount(currentAccounts[0]);
  }
}

function handleResponse(response, customCallback, featureName = 'PetPlace (Generic)') {
  if (featureName === null) {
    featureName = 'PetPlace (Generic)';
  }

  /**
     * To see the full list of response object properties, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#response
     */

  if (response !== null) {
    const contentGroup = document.querySelector('meta[name="template"]');
    // the 'newUser' flag is present for newly registered users that are logging in for the very first time.
    if (response.account.idTokenClaims.newUser) {
      // New user detected. Send POST request to create user in the database
      fetch(`${endPoints.apiUrl}/adopt/api/user/source`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${response.accessToken}`,
        },
        // eslint-disable-next-line no-useless-escape
        body: featureName ? '\"' + featureName + '\"' : null,
      })
        .then(() => {
          pushToDataLayer({
            event: 'sign_up',
            user_id: response.account.localAccountId,
            user_type: 'member',
            content_group: contentGroup
              ? contentGroup.content
              : 'N/A - Content Group Not Set',
          });

          // invoke custom callback if one was provided
          if (customCallback) {
            customCallback(response);
          }
        })
        .catch((error) => {
          captureError('account creation', error);
          // eslint-disable-next-line no-console
          console.error('/adopt/api/User Error:', error);
          // trying a second time in case of a network error
          setTimeout(() => {
            fetch(`${endPoints.apiUrl}/adopt/api/User`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${response.accessToken}`,
              },
              // eslint-disable-next-line no-useless-escape
              body: featureName ? '\"' + featureName + '\"' : null,
            })
              .then(() => {
                pushToDataLayer({
                  event: 'sign_up',
                  user_id: response.account.localAccountId,
                  user_type: 'member',
                  content_group: contentGroup
                    ? contentGroup.content
                    : 'N/A - Content Group Not Set',
                });

                // invoke custom callback if one was provided
                if (customCallback) {
                  customCallback(response);
                }
              })
              .catch((error) => {
                captureError('account creation', error);
                // eslint-disable-next-line no-console
                console.error('/adopt/api/User Error:', error);
              });
          }, 1000);
        });
    } else {
      pushToDataLayer({
        event: 'login',
        user_id: response.account.localAccountId,
        user_type: 'member',
        content_group: contentGroup
          ? contentGroup.content
          : 'N/A - Content Group Not Set',
      });

      // invoke custom callback if one was provided
      if (customCallback) {
        customCallback(response);
      }
    }
  } else {
    selectAccount();
  }
}
/* eslint-enable */
