import { isMobile, isTablet } from '../../scripts/scripts.js';

// TODO: this will come in as a fragment at a later date
export default async function decorate(block) {
  const heading = document.createElement('h2');
  const img = document.createElement('img');
  const details = document.createElement('span');
  const button = document.createElement('button');

  heading.textContent = 'Pet Insurance: A Pet Care Must Have';
  details.textContent = 'Compare the top pet insurance plans all in one place to find the one that works best for you and your pet';

  img.classList.add('article-cta-img');
  img.width = 322;
  img.height = 184;
  if (isMobile()) {
    img.src = '/icons/compare-plans-screen.svg';
  } else if (isTablet()) {
    img.src = '/icons/compare-plans-tablet.svg';
    img.width = 672;
    img.height = 184;
  } else {
    img.src = '/icons/compare-plans-screen.svg';
  }

  button.textContent = 'Compare Plans';
  button.addEventListener('click', (e) => {
    e.preventDefault();
    window.open('/pet-insurance', '_blank');
  });

  block.append(heading);
  block.append(img);
  block.append(details);
  block.append(button);
}
