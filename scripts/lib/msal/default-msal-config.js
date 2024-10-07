/* eslint-disable default-case */

/**
 * Configuration object to be passed to MSAL instance on creation.
 * For a full list of MSAL.js configuration parameters, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md
 * For more details on using MSAL.js with Azure AD B2C, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/working-with-b2c.md
 */

const stageConfigs = {
  clientId: '680fcf6c-4c38-4d11-8963-d65de9aec0d9',
  scopes: ['https://petplacepoc.onmicrosoft.com/api/adopt.all', 'openid'],
  authorities: {
    signUpSignIn: {
      authority: 'https://petplacepoc.b2clogin.com/petplacepoc.onmicrosoft.com/B2C_1A_SIGNUP_SIGNIN',
    },
    changePassword: {
      authority: 'https://petplacepoc.b2clogin.com/petplacepoc.onmicrosoft.com/B2C_1A_PASSWORDCHANGE',
    },
    accountActivation: {
      authority: 'https://petplacepoc.b2clogin.com/petplacepoc.onmicrosoft.com/B2C_1A_REDEEMTOKEN',
    },
  },
  authorityDomain: 'petplacepoc.b2clogin.com',
};

const stageAltConfigs = {
  clientId: '294a2117-b48b-41b4-ac9c-33a62737d47f',
  scopes: ['https://petplaceb2cftr.onmicrosoft.com/3b511f9c-7c30-4206-a8cd-803b55f0d779/adopt.all', 'openid'],
  authorities: {
    signUpSignIn: {
      authority: 'https://petplaceb2cftr.b2clogin.com/petplaceb2cftr.onmicrosoft.com/B2C_1A_SIGNUP_SIGNIN',
    },
    changePassword: {
      authority: 'https://petplaceb2cftr.b2clogin.com/petplaceb2cftr.onmicrosoft.com/B2C_1A_PASSWORDCHANGE',
    },
    accountActivation: {
      authority: 'https://petplaceb2cftr.b2clogin.com/petplaceb2cftr.onmicrosoft.com/B2C_1A_REDEEMTOKEN',
    },
  },
  authorityDomain: 'petplaceb2cftr.b2clogin.com',
};

const prodConfigs = {
  clientId: '2cfbc498-eb1d-4802-a14c-983e5b72bd0d',
  scopes: ['https://petplaceb2c.onmicrosoft.com/api/adopt.all', 'openid'],
  authorities: {
    signUpSignIn: {
      authority: 'https://petplaceb2c.b2clogin.com/petplaceb2c.onmicrosoft.com/B2C_1A_SIGNUP_SIGNIN',
    },
    changePassword: {
      authority: 'https://petplaceb2c.b2clogin.com/petplaceb2c.onmicrosoft.com/B2C_1A_PASSWORDCHANGE',
    },
    accountActivation: {
      authority: 'https://petplaceb2c.b2clogin.com/petplaceb2c.onmicrosoft.com/B2C_1A_REDEEMTOKEN',
    },
  },
  authorityDomain: 'petplaceb2c.b2clogin.com',
};

let b2cPolicies = {
  names: {
    signUpSignIn: 'B2C_1A_SIGNUP_SIGNIN',
  },
};

const currentUrl = window.location.href;

// if URL contains "www.petplace.com", merge prodConfigs into b2cPolicies
if (currentUrl.includes('www.petplace.com') || currentUrl.includes('main--petplace--hlxsites')) {
  b2cPolicies = { ...b2cPolicies, ...prodConfigs };
} else if (currentUrl.includes('adopt-test--petplace--hlxsites') || currentUrl.includes('release')) {
  b2cPolicies = { ...b2cPolicies, ...stageAltConfigs };
} else {
  b2cPolicies = { ...b2cPolicies, ...stageConfigs };
}

export function getB2CPolicies() {
  return b2cPolicies;
}

export const msalConfig = {
  // eslint-disable-next-line
  auth: {
    // This is the ONLY mandatory field; everything else is optional.
    clientId: b2cPolicies.clientId,
    // Choose sign-up/sign-in user-flow as your default.
    authority: b2cPolicies.authorities.signUpSignIn.authority,
    // You must identify your tenant's domain as a known authority.
    knownAuthorities: [b2cPolicies.authorityDomain],
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'localStorage', // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
    storeAuthStateInCookie: false,
    // If you wish to store cache items in cookies as well as browser cache, set this to "true".
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return;
        }
        switch (level) {
          // eslint-disable-next-line
          case msal.LogLevel.Error:
            // eslint-disable-next-line
            console.error(message);
            return;
            // eslint-disable-next-line
          case msal.LogLevel.Info:
            // eslint-disable-next-line
            console.info(message);
            return;
            // eslint-disable-next-line
          case msal.LogLevel.Verbose:
            // eslint-disable-next-line
            console.debug(message);
            return;
            // eslint-disable-next-line
          case msal.LogLevel.Warning:
            // eslint-disable-next-line
            console.warn(message);
            // eslint-disable-next-line
            return;
        }
      },
    },
  },
};

export const msalChangePwdConfig = {
  auth: {
    clientId: b2cPolicies.clientId,
    authority: b2cPolicies.authorities.changePassword.authority,
    knownAuthorities: [b2cPolicies.authorityDomain],
    redirectUri: window.location.origin,
  },
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit:
 * https://docs.microsoft.com/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
  scopes: b2cPolicies.scopes,
};

export const logoutRequest = {
  postLogoutRedirectUri: '/',
  mainWindowRedirectUri: '/',
};

/**
 * Scopes you add here will be used to request a token from Azure
 * AD B2C to be used for accessing a protected resource.
 * To learn more about how to work with scopes and resources, see:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/resources-and-scopes.md
 */
export const tokenRequest = {
  scopes: b2cPolicies.scopes,
  forceRefresh: false,
  // Set this to "true" to skip a cached token and go to the server to get a new token
};

export const redeemTokenRequest = {
  clientId: b2cPolicies.clientId,
  authority: b2cPolicies.authorities.accountActivation.authority,
};

export const changePwdRequest = {
  scopes: b2cPolicies.scopes,
  mainWindowRedirectUri: window.location.href,
};
