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

/**
 * @typedef Slideshow
 * @property {HTMLElement} slideshow The container representing the slideshow
 *  itself.
 * @property {Array<HTMLElement>} slides Elements containing the slides that
 *  are in the slideshow. If there is an h1 element in a slide, its value
 *  will be used as the slide's name in aria attributes.
 * @property {HTMLElement} [tabList] If provided, the element representing
 *  the tabs that allow users to select individual slides in the slideshow.
 *  This is expected to be an <ol> tag containing <li> elements representing
 *  each tab in the tablist. Slideshows that don't support tabs can omit
 *  this property.
 * @property {boolean} [rotateDelay=5000] The amount of time, in milliseconds,
 *  that the slideshow should wait when auto rotating between slides. If
 *  falsy, the slideshow will not auto rotate.
 */

/**
 * Sets the currently active slide to a new index in the slideshow's
 * list of slides.
 * @param {Slideshow} slideshowInfo Information about the slideshow being
 *  decorated.
 * @param {number} currentIndex Currently activated slide in the slideshow.
 * @param {number} newIndex Index of the new slide to activate.
 */
export function changeSlide(slideshowInfo, currentIndex, newIndex) {
  if (currentIndex === newIndex) {
    // optimize if user clicks on the same tab
    return;
  }
  const {
    slideshow,
    slides,
    tabList,
  } = slideshowInfo;

  slides[currentIndex].setAttribute('aria-hidden', true);
  slides[currentIndex].removeAttribute('active');
  slides[currentIndex].setAttribute('disabled', true);
  slides[newIndex].setAttribute('aria-hidden', false);
  slides[newIndex].setAttribute('active', true);
  slides[newIndex].removeAttribute('disabled');
  if (tabList) {
    const tabs = tabList.querySelectorAll('[role="tab"]');
    tabs[currentIndex].setAttribute('aria-selected', false);
    tabs[newIndex].setAttribute('aria-selected', true);
  }

  const event = new CustomEvent('hlx-slideshow-slide-changed', {
    detail: {
      currentIndex,
      newIndex,
    },
  });
  slideshow.dispatchEvent(event);
}

/**
 * Retrieves a value indicating whether the user has interacted with the slideshow
 * in any way (such as clicking one of its tabs, or using the keyboard).
 * @param {HTMLElement} slideshow Container element for the slideshow as a whole.
 * @returns {boolean} True if the user has manually interacted with the slideshow,
 *  false otherwise.
 */
function isSlideshowInteracted(slideshow) {
  return !!slideshow.dataset.interacted;
}

/**
 * Sets the value that specifies whether the user has manually interacted with
 * the slideshow in some way.
 * @param {HTMLElement} slideshow Container element for the slideshow as a whole.
 * @param {boolean} isInteracted Indicates whether the user has interacted with the
 *  slideshow or not.
 */
function setSlideshowInteracted(slideshow, isInteracted) {
  slideshow.dataset.interacted = isInteracted;
}

/**
 * Decorates the element containing the slideshow itself with required
 * accessibility attributes.
 * @param {HTMLElement} slideshow Element to decorate.
 */
function decorateSlideshow(slideshow) {
  slideshow.setAttribute('role', 'group');
  slideshow.setAttribute('aria-roledescription', 'carousel');
}

/**
 * Decorates slide elements within a slideshow with the required attributes
 * and functionality for making the slideshow fully accessible.
 * @param {Array<HTMLElement>} slides Individual slide elements that make up the
 *  slideshow.
 * @returns {Array<string>} The names of each slide.
 */
function decorateSlides(slides) {
  const slideNames = [];
  const numChildren = slides.length;
  slides.forEach(($slide, i) => {
    const title = $slide.querySelector('h1');
    const label = title !== null ? `"${title.innerText}"` : `${i + 1} of ${numChildren}`;
    slideNames.push(label);

    $slide.setAttribute('role', 'tabpanel');
    $slide.setAttribute('aria-roledescription', 'slide');
    $slide.setAttribute('aria-label', `Slide ${label}`);
    $slide.setAttribute('aria-hidden', (i !== 0).toString());
  });
  return slideNames;
}

/**
 * Gets the index of the slide that is currently the active slide of the
 * slideshow.
 * @param {Array<HTMLElement>} slides The slides making up the slideshow.
 * @returns {number} Index of the active slide.
 */
function getCurrentSlideIndex(slides) {
  return slides.findIndex(($child) => $child.getAttribute('active') === 'true');
}

/**
 * Decorates the slideshow's tab list with attributes and functionality required
 * to make it fully accessible.
 * @param {Slideshow} slideshow Information about the slideshow being decorated.
 * @param {Array<string>} slideNames Display names of each of the slides in the
 *  slideshow.
 */
function decorateTabList(slideshowInfo, slideNames) {
  const {
    slideshow,
    slides,
    tabList,
  } = slideshowInfo;
  tabList.setAttribute('role', 'tablist');

  const listItems = tabList.querySelectorAll('li');
  listItems.forEach((listItem, i) => {
    listItem.setAttribute('role', 'tab');
    listItem.setAttribute('aria-selected', (i === 0).toString());
    listItem.setAttribute('aria-label', `Go to slide ${slideNames[i]}`);
    listItem.addEventListener('click', () => {
      const currentIndex = getCurrentSlideIndex(slides);
      setSlideshowInteracted(slideshow, true);
      changeSlide(slideshowInfo, currentIndex, i);
    });
  });
}

/**
 * Adds auto rotating functionality to the slideshow.
 * @param {Slideshow} slideshowInfo Information about the slideshow being
 *  decorated.
 */
function applyAutoRotate(slideshowInfo) {
  const {
    slideshow,
    slides,
    rotateDelay = 5000,
  } = slideshowInfo;
  const numChildren = slides.length;

  if (!rotateDelay) {
    return;
  }

  // auto-play
  const autoplayTimer = new ResumableInterval(rotateDelay, () => {
    const currentIndex = getCurrentSlideIndex(slides);
    if (!isSlideshowInteracted(slideshow)) {
      changeSlide(slideshowInfo, currentIndex, (currentIndex + 1) % numChildren);
    }
  });
  autoplayTimer.start();

  slideshow.addEventListener('mouseenter', () => {
    autoplayTimer.pause();
  });

  slideshow.addEventListener('mouseleave', () => {
    autoplayTimer.resume();
  });

  slideshow.addEventListener('click', () => {
    setSlideshowInteracted(slideshow, true);
    autoplayTimer.pause();
  });
}

/**
 * Decorates a slideshow with aria and other accessibility-related attributes
 * to ensure the slideshow meets accessibility requirements. The decoration
 * will include:
 * * Adding required aria properties.
 * * Providing auto-rotation functionality, if specified.
 * * Adding mouse and keyboard interactivity to the slideshow's tab list, if
 *   specified.
 * @param {Slideshow} slideshowInfo Information about the slideshow that
 *  should be decorated with accessibility functionality.
 * @returns {Promise} Resolves when all decoration is complete.
 */
export async function decorateSlideshowAria(slideshowInfo) {
  decorateSlideshow(slideshowInfo.slideshow);
  const slideNames = decorateSlides(slideshowInfo.slides);
  if (slideshowInfo.tabList) {
    decorateTabList(slideshowInfo, slideNames);
  }
  applyAutoRotate(slideshowInfo);
}
