import { decorateIcons } from '../../scripts/lib-franklin.js';
import { decorateResponsiveImages } from '../../scripts/scripts.js';
import {
  Events,
  decorateSlideshowAria,
  changeSlide,
} from './aria-slideshow.js';

function getCurrentSlideIndex($block) {
  return [...$block.children].findIndex(($child) => $child.getAttribute('active') === 'true');
}

function disableChildLinks($slide) {
  [...$slide.querySelectorAll(':scope a')].forEach(($anchor) => {
    $anchor.setAttribute('disabled', true);
  });
}

function enableChildLinks($slide) {
  [...$slide.querySelectorAll(':scope a')].forEach(($anchor) => {
    $anchor.removeAttribute('disabled');
  });
}

function updateSlide(currentIndex, nextIndex, $block) {
  const $slidesContainer = $block.querySelector('.slides-container');
  const $tabBar = $block.querySelector('.tab-bar-container');

  disableChildLinks($slidesContainer.children[currentIndex]);
  enableChildLinks($slidesContainer.children[nextIndex]);

  $tabBar.querySelector('ol').children[currentIndex].querySelector('span').className = 'icon icon-circle';
  $tabBar.querySelector('ol').children[nextIndex].querySelector('span').className = 'icon icon-circle-fill';
  decorateIcons($tabBar.querySelector('ol'));

  $slidesContainer.style.transform = `translateX(-${nextIndex * 100}vw)`;
}

function initializeTouch($block, slideshowInfo) {
  const $slidesContainer = $block.querySelector('.slides-container');

  let startX;
  let currentX;
  let diffX = 0;

  $block.addEventListener('touchstart', (e) => {
    const { tagName } = e.target;
    if (tagName === 'A' || tagName === 'use') return;

    startX = e.touches[0].pageX;
  }, { passive: true });

  $block.addEventListener('touchmove', (e) => {
    const { tagName } = e.target;
    if (tagName === 'A' || tagName === 'use') return;

    currentX = e.touches[0].pageX;
    diffX = currentX - startX;

    const index = getCurrentSlideIndex($slidesContainer);
    $slidesContainer.style.transform = `translateX(calc(-${index}00vw + ${diffX}px))`;
  }, { passive: true });

  $block.addEventListener('touchend', (e) => {
    const { tagName } = e.target;
    if (tagName === 'A' || tagName === 'use') return;

    const index = getCurrentSlideIndex($slidesContainer);

    if (diffX > 50) {
      const nextIndex = index === 0 ? $slidesContainer.children.length - 1 : index - 1;
      changeSlide(slideshowInfo, index, nextIndex);
    } else if (diffX < -50) {
      const nextIndex = index === $slidesContainer.children.length - 1 ? 0 : index + 1;
      changeSlide(slideshowInfo, index, nextIndex);
    } else {
      $slidesContainer.setAttribute('style', `transform:translateX(-${index}00vw)`);
    }
  }, { passive: true });
}

export default async function decorate($block) {
  $block.children[0].setAttribute('active', true);

  // move slides into slides wrapper
  const $slidesContainer = document.createElement('div');
  $slidesContainer.innerHTML = $block.innerHTML;
  $block.innerHTML = '';
  $block.prepend($slidesContainer);
  $slidesContainer.classList.add('slides-container');

  const slides = [...$slidesContainer.children];
  slides.forEach(($slide) => {
    $slide.classList.add('slide');

    const imgDiv = $slide.children[0];
    imgDiv.classList.add('img-div');
    const textDiv = $slide.children[1];
    textDiv.classList.add('text-div');

    decorateResponsiveImages(imgDiv);
  });

  // create slider nav bar
  const $sliderNavBar = document.createElement('div');
  $sliderNavBar.classList.add('tab-bar-container');
  $sliderNavBar.innerHTML = '<ol></ol>';
  const tabList = $sliderNavBar.querySelector('ol');
  [...$slidesContainer.children].forEach(($slide, i) => {
    const $sliderNavBarButton = document.createElement('li');

    // add interactivity
    $sliderNavBarButton.innerHTML = `<button class="control-button"><span class="icon icon-circle${i === 0 ? '-fill' : ''}" /></button>`;
    tabList.append($sliderNavBarButton);
  });
  $block.prepend($sliderNavBar);
  $block.addEventListener(Events.SLIDE_CHANGED, (e) => {
    updateSlide(e.detail.currentIndex, e.detail.newIndex, $block);
  });

  const slideshowInfo = {
    slideshow: $block,
    slides,
    tabList,
  };
  decorateSlideshowAria(slideshowInfo);
  decorateIcons($sliderNavBar);

  initializeTouch($block, slideshowInfo);
}
