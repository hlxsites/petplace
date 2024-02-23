import { msalConfig } from './default-msal-config.js';

export function createDefaultMsalInstance() {
    return new msal.PublicClientApplication(msalConfig);
}

export function createMsalInstance(msalConfig) {
    return new msal.PublicClientApplication(msalConfig);
}
