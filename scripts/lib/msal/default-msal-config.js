/**
 * Configuration object to be passed to MSAL instance on creation. 
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 * For more details on using MSAL.js with Azure AD B2C, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/working-with-b2c.md 
 */

import { b2cPolicies } from "./policies.js";

const clientId = "2cfbc498-eb1d-4802-a14c-983e5b72bd0d";
const scopes = ["https://petplaceb2c.onmicrosoft.com/api/adopt.all", "openid"];

export const msalConfig = {
    auth: {
      clientId: clientId, // This is the ONLY mandatory field; everything else is optional.
      authority: b2cPolicies.authorities.signUpSignIn.authority, // Choose sign-up/sign-in user-flow as your default.
      knownAuthorities: [b2cPolicies.authorityDomain], // You must identify your tenant's domain as a known authority.
      redirectUri: window.location.origin
    },
    cache: {
      cacheLocation: "localStorage", // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
      storeAuthStateInCookie: false, // If you wish to store cache items in cookies as well as browser cache, set this to "true".
    },
    system: {
      loggerOptions: {
        loggerCallback: (level, message, containsPii) => {
          if (containsPii) {
            return;
          }
          switch (level) {
            case msal.LogLevel.Error:
              console.error(message);
              return;
            case msal.LogLevel.Info:
              console.info(message);
              return;
            case msal.LogLevel.Verbose:
              console.debug(message);
              return;
            case msal.LogLevel.Warning:
              console.warn(message);
              return;
          }
        }
      }
    }
};

export const msalChangePwdConfig = {
  auth: {
      clientId: clientId,
      authority: b2cPolicies.authorities.changePassword.authority,
      knownAuthorities: [b2cPolicies.authorityDomain],
      redirectUri: window.location.origin
  },
};
  
/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit: 
 * https://docs.microsoft.com/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
  scopes: scopes,
};

export const logoutRequest = {
  postLogoutRedirectUri: window.location.href,
  mainWindowRedirectUri: window.location.href
};

/**
 * Scopes you add here will be used to request a token from Azure AD B2C to be used for accessing a protected resource.
 * To learn more about how to work with scopes and resources, see: 
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
export const tokenRequest = {
  scopes: scopes, 
  forceRefresh: false // Set this to "true" to skip a cached token and go to the server to get a new token
};
export const changePwdRequest = {
  scopes: scopes,
  mainWindowRedirectUri: window.location.href
};
