import { decorateResponsiveImages } from '../../scripts/scripts.js';

export default function loadLazy(document) {
  const imgDiv = document.querySelector('.home-banner').querySelector('div')
    .children[1];
  decorateResponsiveImages(imgDiv);

  const main = document.querySelector('main');
  const bgWaveDiv = document.createElement('div');
  bgWaveDiv.append(main.children[0]);
  // add this in for when "explore" is live
  // bgWaveDiv.append(main.children[0]);
  bgWaveDiv.className = 'home-banner-bg';
  main.prepend(bgWaveDiv);
}
