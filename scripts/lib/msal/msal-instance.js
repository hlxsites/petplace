import { msalConfig } from './default-msal-config.js';

let scriptLoaded = false;
let defaultMsalInstance = null;
let msalInstances = {};

function loadMsalScript() {
    return new Promise((resolve, reject) => {
        if (scriptLoaded) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://alcdn.msauth.net/browser/2.30.0/js/msal-browser.js';
        script.integrity = 'sha384-o4ufwq3oKqc7IoCcR08YtZXmgOljhTggRwxP2CLbSqeXGtitAxwYaUln/05nJjit';
        script.crossOrigin = 'anonymous';
        script.onload = () => {
            scriptLoaded = true;
            resolve();
        };
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

export async function getDefaultMsalInstance() {
    await loadMsalScript();
    if (!defaultMsalInstance) {
        defaultMsalInstance = new window.msal.PublicClientApplication(msalConfig);
    }
    return defaultMsalInstance;
}

export async function getMsalInstance(config) {
    await loadMsalScript();
    const configKey = JSON.stringify(config);
    if (!msalInstances[configKey]) {
        msalInstances[configKey] = new window.msal.PublicClientApplication(config);
    }
    return msalInstances[configKey];
}
