// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './lib-franklin.js';
// eslint-disable-next-line import/no-cycle
import { isMobile, loadScript } from './scripts.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');

async function loadAccessibeWidget() {
  await loadScript('https://acsbapp.com/apps/app/dist/js/app.js', () => {
    const HIGHLIGHT_COLOR = '#FF7D5A';
    window.acsbJS.init({
      statementLink: '',
      footerHtml: '',
      hideMobile: false,
      hideTrigger: false,
      language: 'en',
      position: 'right',
      leadColor: HIGHLIGHT_COLOR,
      triggerColor: HIGHLIGHT_COLOR,
      triggerRadius: '50%',
      triggerPositionX: 'right',
      triggerPositionY: 'bottom',
      triggerIcon: 'wheels',
      triggerSize: 'medium',
      triggerOffsetX: 20,
      triggerOffsetY: 20,
      mobile: {
        triggerSize: 'small',
        triggerPositionX: 'right',
        triggerPositionY: 'bottom',
        triggerOffsetX: 10,
        triggerOffsetY: 10,
        triggerRadius: '50%',
      },
    });
  }, { async: true });
}

// add more delayed functionality here
if (isMobile()) {
  loadScript('https://securepubads.g.doubleclick.net/tag/js/gpt.js', () => {}, { async: '' });
}

window.PushlySDK = window.PushlySDK || [];
function pushly(...args) {
  window.PushlySDK.push(args);
}
pushly('load', {
  domainKey: 'cfOCEQj2H76JJXktWCy3uK0OZCb1DMbfNUnq',
});
loadScript('https://cdn.p-n.io/pushly-sdk.min.js?domain_key=cfOCEQj2H76JJXktWCy3uK0OZCb1DMbfNUnq', null, { async: true });

if (window.location.hostname === 'www.petplace.com'
  || window.location.hostname.startsWith('main--petplace--hlxsites.hlx.')) {
  loadAccessibeWidget();
}
