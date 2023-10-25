import { createNewsletterAutoBlock } from '../../scripts/scripts.js';
import { loadBlock } from '../../scripts/lib-franklin.js';

// eslint-disable-next-line import/prefer-default-export
export async function loadLazy(main) {
  const templateContent = document.createElement('div');
  templateContent.classList.add('article-signup-section');
  const defaultContent = main.querySelector('.default-content-wrapper');
  if (!defaultContent) {
    return;
  }

  // rearrange element structure so that there are three items at
  // the same level:
  // 1. The first picture in the document
  // 2. A div containing all the rest of the content from the
  //    document.
  // 3. The newsletter signup form
  let pictureFound = false;
  const contentDiv = document.createElement('div');
  contentDiv.classList.add('article-signup-content');
  [...defaultContent.children].forEach((child) => {
    const picture = child.querySelector('picture');
    if (!pictureFound && picture) {
      pictureFound = true;
      templateContent.append(picture);
    } else {
      contentDiv.append(child);
    }
  });
  templateContent.append(contentDiv);

  defaultContent.innerHTML = '';
  defaultContent.append(templateContent);

  const newsletter = await createNewsletterAutoBlock('/fragments/newsletter-footer', (block) => {
    templateContent.append(block);
  });
  await loadBlock(newsletter);
}
