import { isTablet } from '../../scripts/scripts.js';

// TODO: this will come in as a fragment at a later date
export default async function decorate(block) {
  const heading = document.createElement('h2');
  const img = document.createElement('img');
  const details = document.createElement('span');
  const button = document.createElement('button');

  heading.textContent = 'Pet Insurance: A Pet Care Must Have';
  details.textContent =
    'Compare the top pet insurance plans all in one place to find the one that works best for you and your pet';

  img.classList.add('article-cta-img');
  // img.src = '/icons/compare-plans-screen.svg';
  img.src = isTablet()
    ? '/icons/compare-plans-tablet.svg'
    : '/icons/compare-plans-screen.svg';
  button.textContent = 'Compare Plans';
  button.href = '/pet-insurance';

  block.append(heading);
  block.append(img);
  block.append(details);
  block.append(button);
}