import { decorateIcons } from '../../scripts/lib-franklin.js';
import { decorateResponsiveImages } from '../../scripts/scripts.js';

class ResumableInterval {
  constructor(intervalTime, callback) {
    this.interval = null;
    this.intervalTime = intervalTime;
    this.callback = callback;
  }

  start() {
    this.interval = setInterval(() => {
      this.callback();
    }, this.intervalTime);
  }

  pause() {
    clearInterval(this.interval);
  }

  resume() {
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.callback();
    }, this.intervalTime);
  }
}

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

function updateSlide(nextIndex, $block) {
  const $slidesContainer = $block.querySelector('.slides-container');
  const $tabBar = $block.querySelector('.tab-bar-container');

  const currentIndex = getCurrentSlideIndex($slidesContainer);

  $slidesContainer.children[currentIndex].removeAttribute('active');
  $slidesContainer.children[currentIndex].setAttribute('aria-hidden', true);
  $slidesContainer.children[currentIndex].setAttribute('disabled', true);
  disableChildLinks($slidesContainer.children[currentIndex]);
  $slidesContainer.children[nextIndex].setAttribute('active', true);
  $slidesContainer.children[nextIndex].setAttribute('aria-hidden', false);
  enableChildLinks($slidesContainer.children[nextIndex]);

  $tabBar.querySelector('ol').children[currentIndex].setAttribute('aria-selected', false);
  $tabBar.querySelector('ol').children[nextIndex].setAttribute('aria-selected', true);
  $tabBar.querySelector('ol').children[currentIndex].querySelector('span').className = 'icon icon-circle';
  $tabBar.querySelector('ol').children[nextIndex].querySelector('span').className = 'icon icon-circle-fill';
  decorateIcons($tabBar.querySelector('ol'));

  $slidesContainer.style.transform = `translateX(-${nextIndex * 100}vw)`;
}

export default async function decorate($block) {
  const numChildren = $block.children.length;
  $block.children[0].setAttribute('active', true);

  // set a11y properties
  $block.setAttribute('role', 'group');
  $block.setAttribute('aria-roledescription', 'carousel');

  // move slides into slides wrapper
  const $slidesContainer = document.createElement('div');
  $slidesContainer.innerHTML = $block.innerHTML;
  $block.innerHTML = '';
  $block.prepend($slidesContainer);
  $slidesContainer.classList.add('slides-container');

  [...$slidesContainer.children].forEach(($slide, i) => {
    // set slide a11y properties
    $slide.setAttribute('role', 'tabpanel');
    $slide.setAttribute('aria-roledescription', 'slide');
    $slide.setAttribute('aria-label', `Slide ${i + 1} of ${numChildren}`);
    $slide.setAttribute('aria-hidden', (i !== 0).toString());
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
  $sliderNavBar.innerHTML = '<ol role="tablist"></ol>';
  [...$slidesContainer.children].forEach(($slide, i) => {
    const $sliderNavBarButton = document.createElement('li');

    // set a11y properties
    $sliderNavBarButton.setAttribute('role', 'tab');
    $sliderNavBarButton.setAttribute('aria-selected', (i === 0).toString());

    // add interactivity
    $sliderNavBarButton.innerHTML = `<button class="control-button" aria-label="Go to slide ${i + 1} of ${numChildren}"><span class="icon icon-circle${i === 0 ? '-fill' : ''}" /></button>`;
    $sliderNavBar.querySelector('ol').append($sliderNavBarButton);
    $sliderNavBarButton.querySelector('button').addEventListener('click', () => {
      updateSlide(i, $block);
    });
  });
  $block.append($sliderNavBar);
  decorateIcons($sliderNavBar);

  // auto-play
  const autoplayTimer = new ResumableInterval(5000, () => {
    const currentIndex = getCurrentSlideIndex($slidesContainer);
    updateSlide((currentIndex + 1) % numChildren, $block);
  });
  autoplayTimer.start();
  let slideShowInteracted = false;

  $block.addEventListener('mouseenter', () => {
    autoplayTimer.pause();
  });

  $block.addEventListener('mouseleave', () => {
    if (!slideShowInteracted) {
      autoplayTimer.resume();
    }
  });

  $block.addEventListener('click', () => {
    slideShowInteracted = true;
    autoplayTimer.pause();
  });
}
