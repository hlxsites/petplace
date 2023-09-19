import { createNewsletterAutoBlock } from '../../scripts/scripts.js';
import { loadBlock } from '../../scripts/lib-franklin.js';

// eslint-disable-next-line import/prefer-default-export
export async function loadLazy(main) {
  const picture = main.querySelector('picture');
  const defaultContent = main.querySelector('.default-content-wrapper');
  if (picture && defaultContent) {
    const pictureParent = picture.parentElement;
    defaultContent.parentElement.insertBefore(picture, defaultContent);
    if (pictureParent.children.length === 0) {
      pictureParent.remove();
    }
    const newsletter = await createNewsletterAutoBlock('/fragments/newsletter-footer', (block) => {
      defaultContent.append(block);
    });
    newsletter.classList.add('horizontal');
    await loadBlock(newsletter);
  }
}
