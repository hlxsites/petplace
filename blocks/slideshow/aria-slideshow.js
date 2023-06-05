export const Events = {
  SLIDE_CHANGED: 'hlx-slideshow-slide-changed',
};

class ResumableInterval {
  constructor(intervalTime, callback) {
    this.interval = null;
    this.intervalTime = intervalTime;
    this.callback = callback;
    this.inputs = {};
  }

  start() {
    this.interval = setInterval(() => {
      this.callback();
    }, this.intervalTime);
  }

  setInputs(inputs) {
    this.inputs = {
      ...this.inputs,
      ...inputs,
    };
  }

  areInputsCleared() {
    return !this.inputs.mouse && !this.inputs.keyboard;
  }

  pause(slideshow, inputs = {}) {
    this.setInputs(inputs);
    slideshow.setAttribute('aria-live', 'polite');
    clearInterval(this.interval);
  }

  resume(slideshow, inputs = {}) {
    this.setInputs(inputs);
    clearInterval(this.interval);
    // ensure that neither mouse nor keyboard has paused
    // the interval
    if (this.areInputsCleared()) {
      slideshow.setAttribute('aria-live', 'off');
      this.interval = setInterval(() => {
        this.callback();
      }, this.intervalTime);
    }
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
 * @typedef Slide
 * @property {string} name The user-friendly name of a slide.
 * @property {string} id The ID of a slide.
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
    tabs[currentIndex].querySelector('button').setAttribute('tabindex', -1);
    tabs[newIndex].setAttribute('aria-selected', true);
    tabs[newIndex].querySelector('button').setAttribute('tabindex', 0);
  }

  const event = new CustomEvent(Events.SLIDE_CHANGED, {
    detail: {
      currentIndex,
      newIndex,
    },
  });
  slideshow.dispatchEvent(event);
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
 * Sets the currently active slide to a new index in the slideshow's
 * list of slides, and sets the tab at the new index as the newly
 * focused tab.
 * @param {Slideshow} slideshowInfo Information about the slideshow being
 *  decorated.
 * @param {function} getNewIndex Will be invoked with the current index
 *  as the first argument, and should return the new index to focus.
 */
function focusNewSlide(slideshowInfo, getNewIndex) {
  const currentIndex = getCurrentSlideIndex(slideshowInfo.slides);
  const newIndex = getNewIndex(currentIndex);
  changeSlide(slideshowInfo, currentIndex, newIndex);

  const tabs = slideshowInfo.tabList.querySelectorAll('[role="tab"]');
  if (!tabs || tabs.length < newIndex) {
    return;
  }
  const newFocus = tabs[newIndex];
  newFocus.querySelector('button').focus();
}

/**
 * Decorates the element containing the slideshow itself with required
 * accessibility attributes.
 * @param {HTMLElement} slideshow Element to decorate.
 */
function decorateSlideshow(slideshow) {
  slideshow.setAttribute('role', 'group');
  slideshow.setAttribute('aria-roledescription', 'carousel');
  slideshow.setAttribute('aria-label', 'Slideshow of popular articles');
}

/**
 * Given an HTML element, retrieves the ID set on it, or generates a new
 * one and assigns it as the element's id.
 * @param {HTMLElement} element Element whose ID should be retrieved.
 * @returns The ID of an element.
 */
function getOrGenerateId(element) {
  if (!element.id) {
    element.id = Math.random().toString(32).substring(2);
  }
  return element.id;
}

/**
 * Decorates slide elements within a slideshow with the required attributes
 * and functionality for making the slideshow fully accessible.
 * @param {Array<HTMLElement>} slides Individual slide elements that make up the
 *  slideshow.
 * @returns {Array<Slide>} Information about the slides.
 */
function decorateSlides(slides) {
  const slideInfos = [];
  const numChildren = slides.length;
  slides.forEach(($slide, i) => {
    // ensure each slide has an ID so that corresponding tabs can
    // reference it
    getOrGenerateId($slide);
    const title = $slide.querySelector('h1');
    const label = title !== null ? title.innerText : `${i + 1} of ${numChildren}`;
    slideInfos.push({
      name: label,
      id: $slide.id,
    });

    $slide.setAttribute('role', 'tabpanel');
    $slide.setAttribute('aria-label', `Slide "${label}"`);
    $slide.setAttribute('aria-hidden', (i !== 0).toString());
  });
  return slideInfos;
}

/**
 * Decorates the slideshow's tab list with attributes and functionality required
 * to make it fully accessible.
 * @param {Slideshow} slideshow Information about the slideshow being decorated.
 * @param {Array<Slide>} slideInfos Information about the slides present in the
 *  slideshow.
 */
function decorateTabList(slideshowInfo, slideInfos) {
  const {
    slides,
    tabList,
  } = slideshowInfo;
  tabList.setAttribute('role', 'tablist');
  tabList.setAttribute('aria-label', 'Choose slide to display');

  const listItems = tabList.querySelectorAll('li');
  listItems.forEach((listItem, i) => {
    listItem.setAttribute('role', 'tab');
    listItem.setAttribute('aria-selected', (i === 0).toString());
    listItem.setAttribute('aria-label', `Select slide "${slideInfos[i].name}"`);
    listItem.setAttribute('aria-controls', slides[i].id);
    listItem.querySelector('button').setAttribute('tabindex', i === 0 ? 0 : -1);
    listItem.addEventListener('click', () => {
      const currentIndex = getCurrentSlideIndex(slides);
      changeSlide(slideshowInfo, currentIndex, i);
    });
    listItem.addEventListener('keydown', (ev) => {
      switch (ev.key) {
        case 'Home':
          ev.preventDefault();
          focusNewSlide(slideshowInfo, () => 0);
          break;
        case 'ArrowLeft':
          ev.preventDefault();
          focusNewSlide(slideshowInfo, (currIndex) => (currIndex || slides.length) - 1);
          break;
        case 'ArrowRight':
          ev.preventDefault();
          focusNewSlide(slideshowInfo, (currIndex) => (currIndex + 1) % slides.length);
          break;
        case 'End':
          ev.preventDefault();
          focusNewSlide(slideshowInfo, () => slides.length - 1);
          break;
        default:
          break;
      }
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

  slideshow.setAttribute('aria-atomic', false);
  slideshow.setAttribute('aria-live', 'off');

  // auto-play
  const autoplayTimer = new ResumableInterval(rotateDelay, () => {
    const currentIndex = getCurrentSlideIndex(slides);
    changeSlide(slideshowInfo, currentIndex, (currentIndex + 1) % numChildren);
  });
  autoplayTimer.start();

  slideshow.addEventListener('mouseenter', () => {
    autoplayTimer.pause(slideshow, { mouse: true });
  });

  slideshow.addEventListener('mouseleave', () => {
    autoplayTimer.resume(slideshow, { mouse: false });
  });

  slideshow.addEventListener('focusin', () => {
    autoplayTimer.pause(slideshow, { keyboard: true });
  });

  slideshow.addEventListener('focusout', () => {
    autoplayTimer.resume(slideshow, { keyboard: false });
  });

  slideshow.addEventListener('click', () => {
    autoplayTimer.pause(slideshow, { mouse: true });
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
  const slides = decorateSlides(slideshowInfo.slides);
  if (slideshowInfo.tabList) {
    decorateTabList(slideshowInfo, slides);
  }
  applyAutoRotate(slideshowInfo);
}
