import { msalConfig } from './default-msal-config.js';

export function createDefaultMsalInstance() {
    return new window.msal.PublicClientApplication(msalConfig);
}

export function createMsalInstance(config) {
    return new window.msal.PublicClientApplication(config);
}
