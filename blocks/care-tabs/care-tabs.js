import { slide } from '../../templates/breed-page/breed-page.js';

function setActiveCard(card, details) {
  document.querySelector('.care-tabs-wrapper .card.active').classList.remove('active');
  card.classList.add('active');
  const desktopDetailsContainer = document.querySelector('.desktop-details-container');
  desktopDetailsContainer.innerHTML = '';
  desktopDetailsContainer.append(details.cloneNode(true));
}
export default async function decorate(block) {
  [...block.children].forEach((child, i) => {
    if (i === 0) child.setAttribute('active', true);
    const card = child.children[0];
    const details = child.children[1];
    card.classList.add('card');
    if (i === 0) card.classList.add('active');
    details.classList.add('details');
    card.addEventListener('click', () => {
      setActiveCard(card, details);
    });

    // If children are not wrapped in p tags.  Wrap them
    const noPTags = [...card.children].some((c) => c.tagName !== 'P');
    if (noPTags) {
      const pictureWrapper = document.createElement('p');
      const textWrapper = document.createElement('p');

      [...card.childNodes].forEach((childNode) => {
        const { nodeName } = childNode;
        if (nodeName === '#text') {
          if (childNode.textContent.trim()) {
            textWrapper.append(childNode);
          }
        } else if (nodeName === 'PICTURE') {
          pictureWrapper.append(childNode);
        }
      });

      card.innerHTML = '';
      card.append(pictureWrapper);
      card.append(textWrapper);
    }
  });
  // Adjust header for mobile and desktop views
  const careHeading = document.querySelector('.section.care-tabs-container h2');
  const careSpan = document.createElement('span');
  const textSpan = document.createElement('span');
  careSpan.textContent = 'Care';
  textSpan.append(careHeading.innerHTML);
  careHeading.innerHTML = '';
  careHeading.append(careSpan);
  careHeading.append(textSpan);

  // Create the Toggle button elements
  const buttonPrev = document.createElement('button');
  buttonPrev.setAttribute('type', 'button');
  buttonPrev.setAttribute('data-role', 'none');
  buttonPrev.classList.add('slick-arrow', 'slick-prev');
  buttonPrev.addEventListener('click', () => {
    slide('prev', block, block.parentElement);
  });
  const buttonNext = document.createElement('button');
  buttonNext.setAttribute('type', 'button');
  buttonNext.setAttribute('data-role', 'none');
  buttonNext.classList.add('slick-arrow', 'slick-next');
  buttonNext.addEventListener('click', () => {
    slide('next', block, block.parentElement);
  });
  // Add the button to the DOM
  block.parentElement.parentElement.append(buttonPrev);
  block.parentElement.parentElement.append(buttonNext);

  // Inject details into desktop details
  const desktopDetailsContainer = document.createElement('div');
  desktopDetailsContainer.classList.add('desktop-details-container');
  desktopDetailsContainer.append(block.querySelector('.details').cloneNode(true));
  block.parentElement.parentElement.append(desktopDetailsContainer);
}
