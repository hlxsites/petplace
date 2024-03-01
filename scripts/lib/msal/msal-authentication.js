import { createDefaultMsalInstance, createMsalInstance } from './msal-instance.js';
import { loginRequest, logoutRequest, tokenRequest, changePwdRequest, msalChangePwdConfig } from './default-msal-config.js';
import { isMobile } from '../../scripts.js';
import endPoints from '../../../variables/endpoints.js';   

const msalInstance = createDefaultMsalInstance();
const msalChangePwdInstance = createMsalInstance(msalChangePwdConfig);

// register a custom callback function (e.g. handleResponse()) once the user has successfully logged in and was redirected back to the site
msalInstance.initialize().then(() => {
    msalInstance.handleRedirectPromise().then(handleResponse).catch((error) => {
        console.log(error);
    });
});

msalChangePwdInstance.initialize().then(() => {
    msalChangePwdInstance.handleRedirectPromise().then(handleResponse).catch((error) => {
        console.log(error);
    });
});

/**
 * 
 * @param {*} callback individual features can pass their own custom callback function to be invoked after the user has successfully logged in, e.g. invoke the Favorite API for a pet.
 * @param {*} featureName name of the feature that is invoking the login function, e.g. "Favorite". Used for logging purposes when a user signs up an account for the first time.
 */
export function login(callback, featureName) {
    // use loginRedirect() for mobile devices, use loginPopup() for desktop.
    if (isMobile()) {
        msalInstance.loginRedirect(loginRequest)
        .then((response) => handleResponse(response, callback, featureName))
        .catch(error => {
            console.log(error);
        });
    } else {
        msalInstance.loginPopup(loginRequest)
        .then((response) => handleResponse(response, callback, featureName))
        .catch(error => {
            console.log(error);
        });
    }
}

export function logout() {
    /**
     * You can pass a custom request object below. This will override the initial configuration. For more information, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#request
     */

    if (isMobile()) {
        msalInstance.logoutRedirect(logoutRequest);
    } else {
        msalInstance.logoutPopup(logoutRequest);    
    }
}

export function acquireToken(customCallback) {
    const accounts = msalInstance.getAllAccounts();

    return new Promise((resolve, reject) => {
        if (accounts.length === 1) {
            msalInstance.acquireTokenSilent({ account: accounts[0], scopes: tokenRequest.scopes })
                .then(function (accessTokenResponse) {
                    // Acquire token silent success
                    let accessToken = accessTokenResponse.accessToken;
                    resolve(accessToken);
                })
                .catch(function (error) {
                    //Acquire token silent failure, and send an interactive request
                    if (error instanceof msal.InteractionRequiredAuthError) {
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
                        console.log(error);
                        reject(error);
                    }
                });
        } else {
            // prompt login if no token exists
            if (customCallback) {
                login(customCallback);
            } else {
                login((tokenResponse) => resolve(tokenResponse.accessToken));
            }
        }
    });
}

// function to check if user is logged in or not
export function isLoggedIn() {
    const accounts = msalInstance.getAllAccounts();
    return accounts.length > 0;
}
export function changePassword(callback, featureName) {
    // use loginRedirect() for mobile devices, use loginPopup() for desktop.
    if (isMobile()) {
        msalChangePwdInstance.loginRedirect(changePwdRequest)
        .then((response) => handleResponse(response, callback, featureName))
        .catch(error => {
            console.log(error);
        });
    } else {
        msalChangePwdInstance.loginPopup(changePwdRequest)
        .then((response) => handleResponse(response, callback, featureName))
        .catch(error => {
            console.log(error);
        });
    }
}

function selectAccount() {
    /**
     * See here for more info on account retrieval: 
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
     */

    const currentAccounts = msalInstance.getAllAccounts();

    if (currentAccounts.length < 1) {
        console.log('azure user not logged in');
        return;
    } else if (currentAccounts.length > 1) {

        /**
         * Due to the way MSAL caches account objects, the auth response from initiating a user-flow
         * is cached as a new account, which results in more than one account in the cache. Here we make
         * sure we are selecting the account with homeAccountId that contains the sign-up/sign-in user-flow, 
         * as this is the default flow the user initially signed-in with.
         */
        const accounts = currentAccounts.filter(account =>
            account.homeAccountId.toUpperCase().includes(b2cPolicies.names.signUpSignIn.toUpperCase())
            &&
            account.idTokenClaims.iss.toUpperCase().includes(b2cPolicies.authorityDomain.toUpperCase())
            &&
            account.idTokenClaims.aud === msalConfig.auth.clientId 
            );

        if (accounts.length > 1) {
            // localAccountId identifies the entity for which the token asserts information.
            if (accounts.every(account => account.localAccountId === accounts[0].localAccountId)) {
                // All accounts belong to the same user
                // setAccount(accounts[0]);
            } else {
                // Multiple users detected. Logout all to be safe.
                logout();
            };
        } else if (accounts.length === 1) {
            // setAccount(accounts[0]);
        }

    } else if (currentAccounts.length === 1) {
        // setAccount(currentAccounts[0]);
    }
}

function handleResponse(response, customCallback, featureName = 'PetPlace (Generic)') {
    /**
     * To see the full list of response object properties, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#response
     */

    if (response !== null) {
        // the 'newUser' flag is present for newly registered users that are logging in for the very first time.
        if (response.account.idTokenClaims.newUser) {
            // New user detected. Send POST request to create user in the database
            fetch(`${endPoints.apiUrl}/adopt/api/User`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + response.accessToken,
                },
                body: featureName ? "\"" + featureName + "\"" : null
            })
            .catch((error) => {
                console.error('/adopt/api/User Error:', error);
            });
        }

        // invoke custom callback if one was provided
        if (customCallback) {
          customCallback(response);
        }
    } else {
        selectAccount();
    }
}
