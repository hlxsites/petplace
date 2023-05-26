import {
  buildBlock,
  getMetadata,
  createOptimizedPicture,
} from '../../scripts/lib-franklin.js';

function createTemplateBlock(main, blockName, elems = []) {
  const section = document.createElement('div');

  const block = buildBlock(blockName, { elems });
  section.append(block);
  main.append(section);
}

// eslint-disable-next-line import/prefer-default-export
export function loadEager(main) {
  const avatarUrl = getMetadata('avatar');
  const authorName = getMetadata('author-name');
  const p = document.createElement('p');
  p.innerText = authorName;
  const avatar = createOptimizedPicture(avatarUrl, authorName, false);

  createTemplateBlock(main, 'author-info', [avatar, p]);
  createTemplateBlock(main, 'social-share');
  createTemplateBlock(main, 'popular-tags');
}

export function loadLazy(main) {
  const hero = main.querySelector('.hero > div > div');
  const h3 = main.querySelector('h3');
  if (h3) {
    hero.append(h3);
  }

  const autoBlockDiv = document.createElement('div');
  autoBlockDiv.classList.add('ask-author-page-hero-auto-block');
  const askNow = document.createElement('a');
  askNow.href = 'mailto:info@petplace.com';
  askNow.innerText = 'Ask Now';
  autoBlockDiv.append(askNow);

  const firstName = getMetadata('author-first-name');
  const finePrint1 = document.createElement('p');
  const finePrint2 = document.createElement('p');
  finePrint1.innerText = `* Due to the high volume of responses, ${firstName} will be unable to answer all questions received and publication of accepted questions will take a minimum of two weeks.`;
  finePrint2.innerText = `${firstName}'s guidance should not be considered veterinary advice like that provided by your veterinarian, since she is unable to personally examine your pet. If you have an immediate concern or emergency, contact a veterinarian or local veterinary hospital about your specific situation.`;
  autoBlockDiv.append(finePrint1);
  autoBlockDiv.append(finePrint2);
  hero.append(autoBlockDiv);
}
