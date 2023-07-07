// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './lib-franklin.js';
// eslint-disable-next-line import/no-cycle
import { loadScript } from './scripts.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

// add more delayed functionality here

window.PushlySDK = window.PushlySDK || [];
function pushly(...args) {
  window.PushlySDK.push(args);
}
pushly('load', {
  domainKey: 'cfOCEQj2H76JJXktWCy3uK0OZCb1DMbfNUnq',
});
loadScript('https://securepubads.g.doubleclick.net/tag/js/gpt.js', () => {}, { async: '' });
loadScript('https://cdn.p-n.io/pushly-sdk.min.js?domain_key=cfOCEQj2H76JJXktWCy3uK0OZCb1DMbfNUnq', null, { async: true });
