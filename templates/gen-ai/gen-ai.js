// import { buildBlock, sampleRUM } from '../../scripts/lib-franklin.js';
// import { decorateIcons } from '../../scripts/lib-franklin.js';

// import { decorateResponsiveImages } from '../../scripts/scripts.js';
import {
  Events,
  decorateSlideshowAria,
  changeSlide,
} from '../../blocks/slideshow/aria-slideshow.js';

// const GENAI_SEARCH_TITLE = 'Discover PetPlace';
const GENAI_SEARCH_WARNING = 'Discover PetPlace is powered by experimental Generative AI, information quality may vary.';

// const sampleQuestions = [
//   "Why Does One of My Cats Jump on the Other's Back and Bite His Neck?",
//   'Why Dog Urine Odor Comes Back and How to Stop It',
//   'When Is a Dog Considered an Adult?',
//   'Can an Alaskan Malamute or Siberian Husky Puppy Play Nice with the Family Cat?',
//   'Do Clavamox Antibiotic Drops Expire?',
//   'Is It Dangerous for Dogs to Drink Pool Water?',
//   'Can an Outdoor Cat Become an Indoor Cat?',
//   'Cat Stress After Moving',
//   'Is Eating Mice and Rabbits Healthy for My Cat?',
//   'What Happens When Cat Food Expires?',
//   'Does Your Puppy Need a Bordetella Vaccine?',
//   'How Much Should I Feed My Puppy?',
//   'Tips on Housetraining and Dealing with Accidents',
//   'Should a Pet Be Off Antihistamines or Steroid Before Allergy Testing?',
//   'My cat was recently spayed but the male cats still want to mate with her',
//   'Should You Board Your Cat or Get a Sitter?',
//   'Is Your Dog Smarter Than a 5th Grader?',
//   'How Long Can a Pet Be Overdue for a Rabies Vaccine and Still Be Protected?',
// ];

// const capabilities = [
//   'Uses semantic search to find relevant answers',
//   'Utilizes trusted data sources to generate responses',
//   'Declines irrelevant and inappropriate queries',
// ];

// const limitations = [
//   'Does not support keyword matching',
//   'Does not support complex queries',
//   'May occasionally generate incorrect information',
// ];

const isTrueSearch = window.location.pathname === '/discovery';
let isRequestInProgress = false;

function removeAllEventListeners(element) {
  const clone = element.cloneNode(true);
  element.parentNode.replaceChild(clone, element);
}


const fetchStreamingResults = async (index, query, resultsBlock) => {
  if (query === '') {
    return {
      result: 'Please enter a search query.',
    };
  }
  // document.getElementById("clearButton").classList.add("show");
  // document.getElementById("vertical-bar").classList.add("show");

  // console.log('fetchStreamingResults');

  // Adobe Internal Endpoint
  // const socket = new WebSocket('wss://spire-dev.corp.ethos14-stage-va7.ethos.adobe.net/api/query');

  // Adobe External Endpoint
  const socket = new WebSocket('wss://spire-pp-temp-pub.ethos14-stage-va7.ethos.adobe.net/api/query');

  // BambooHR Endpoint
  // const socket = new WebSocket('wss://spire-bhr-temp-pub.ethos14-stage-va7.ethos.adobe.net/api/query');

  socket.addEventListener('open', (event) => {
    console.log('WebSocket connection established');

    const messageToSend = JSON.stringify({ query, index });
    socket.send(messageToSend);
  });

  socket.addEventListener('message', (event) => {
    console.log('Message from server ', event);
    const message = JSON.parse(event.data);

    updateStreamingSearchCard(resultsBlock, message, socket);
  });

  socket.addEventListener('error', (error) => {
    console.error('WebSocket error:', error);
  });

  socket.addEventListener('close', (event) => {
    console.log('WebSocket connection closed');
  });
  // console.log('socket', socket);
  // Show stop button container and add a click event listener
  const stopButtonContainer = document.querySelector('.gen-ai .genai-search-container .stop-button-container');
  stopButtonContainer.classList.add('show');
  let stopButton = stopButtonContainer.querySelector('.stop-button');
  removeAllEventListeners(stopButton);
  stopButton = stopButtonContainer.querySelector('.stop-button');
  stopButton.addEventListener('click', () => {
  //   // Close the WebSocket connection
    socket.close();

    // Remove the cursor animation element
    const cursorAnimation = resultsBlock.querySelector('.cursor-animation');
    cursorAnimation.classList.add('hide');

    // Remove the loading message element
    const loadingMessage = resultsBlock.querySelector('.loading-message');
    if (loadingMessage) {
      resultsBlock.removeChild(loadingMessage);
    }

    // Remove the stop button container
    stopButtonContainer.classList.remove('show');

    const summaryContainer = resultsBlock.querySelector('.summary-columns');
    if (!summaryContainer) {
      // showRegenerateButton(resultsBlock);
    }
  });
};

const decorateSearch = () => {
  // Create the stop generating button <button> element
  const stopButtonContainer = document.createElement('div');
  stopButtonContainer.className = 'stop-button-container';
  const stopButton = document.createElement('button');
  stopButton.className = 'stop-button';
  stopButton.textContent = 'Stop generating';
  const xhr1 = new XMLHttpRequest();
  xhr1.open('GET', `${window.hlx.codeBasePath}/icons/stop.svg`, true);
  xhr1.onreadystatechange = function () {
    if (xhr1.readyState === 4 && xhr1.status === 200) {
      // On successful response, create and append the SVG element
      const svgElement = document.createElement('svg');
      svgElement.innerHTML = xhr1.responseText;
      const { firstChild } = stopButton;
      stopButton.insertBefore(svgElement, firstChild);
    }
  };
  xhr1.send();
  stopButtonContainer.appendChild(stopButton);

  // Create the regenerate response button <button> element
  const regenerateButtonContainer = document.createElement('div');
  regenerateButtonContainer.className = 'regenerate-button-container';
  const regenerateButton = document.createElement('button');
  regenerateButton.className = 'regenerate-button';
  regenerateButton.textContent = 'Regenerate response';
  const xhr2 = new XMLHttpRequest();
  xhr2.open('GET', `${window.hlx.codeBasePath}/icons/regenerate.svg`, true);
  xhr2.onreadystatechange = function () {
    if (xhr2.readyState === 4 && xhr2.status === 200) {
      // On successful response, create and append the SVG element
      const svgElement = document.createElement('svg');
      svgElement.innerHTML = xhr2.responseText;
      const { firstChild } = regenerateButton;
      regenerateButton.insertBefore(svgElement, firstChild);
    }
  };
  xhr2.send();
  regenerateButtonContainer.appendChild(regenerateButton);

  // Append the stop generating button <button> element to the search block <div> element
  // searchContainer.appendChild(stopButtonContainer);
  // searchContainer.appendChild(regenerateButtonContainer);

  // Create the search results <div> element with am-region attribute
  const searchResultsDivElement = document.createElement('div');
  searchResultsDivElement.setAttribute('class', 'search-results');
  searchResultsDivElement.setAttribute('am-region', 'Search');

  // Append the search results <div> element to the search block <div> element
  // searchDivElement.appendChild(searchResultsDivElement);
  return stopButtonContainer;
  // Append the inner <div> elements and search block <div> element to the outer <div> element
  // outerDivElement.appendChild(innerDivElement);
  // outerDivElement.appendChild(secondInnerDivElement);
  // secondInnerDivElement.appendChild(searchDivElement);

  // Append the outer <div> element to the <main> element
  // mainElement.appendChild(outerDivElement);

  // Append the <main> element to the body of the document
  // document.body.appendChild(mainElement);

  // return mainElement;
};

function getCurrentSlideIndex($block) {
  // console.log('$block', $block);
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

  disableChildLinks($slidesContainer.children[currentIndex]);
  enableChildLinks($slidesContainer.children[nextIndex]);

  $slidesContainer.style.transform = `translateX(-${nextIndex * 260}px)`;
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
    $slidesContainer.style.transform = `translateX(calc(-${index} * 260px))`;
  }, { passive: true });

  $block.addEventListener('touchend', (e) => {
    const { tagName } = e.target;
    if (tagName === 'A' || tagName === 'use') return;

    const index = getCurrentSlideIndex($slidesContainer);
    // console.log('index', index);
    if (diffX > 50) {
      const nextIndex = index === 0 ? $slidesContainer.children.length - 1 : index - 1;
      changeSlide(slideshowInfo, index, nextIndex);
    } else if (diffX < -50) {
      const nextIndex = index === $slidesContainer.children.length - 1 ? 0 : index + 1;
      changeSlide(slideshowInfo, index, nextIndex);
    } else {
      $slidesContainer.setAttribute('style', `transform:translateX(-${index} * 260px)`);
    }
  }, { passive: true });

  $block.addEventListener('click', (e) => {
    const index = getCurrentSlideIndex($slidesContainer);
    if (e.target.matches('.slideshow-prev') && !e.target.matches('.hide')) {
      const nextIndex = index - 1;
      document.querySelector('.slideshow-next')?.classList.remove('hide');
      if (nextIndex === 0) {
        document.querySelector('.slideshow-prev')?.classList.add('hide');
        $slidesContainer.setAttribute('style', 'transform:translateX(0px)');
      } else {
        document.querySelector('.slideshow-prev')?.classList.remove('hide');
      }
      changeSlide(slideshowInfo, index, nextIndex);
    } else if (e.target.matches('.slideshow-next') && !e.target.matches('.hide')) {
      const nextIndex = index === $slidesContainer.children.length - 1 ? 0 : index + 1;
      document.querySelector('.slideshow-prev')?.classList.remove('hide');

      if (nextIndex === $slidesContainer.children.length - 1) {
        document.querySelector('.slideshow-next')?.classList.add('hide');
      } else {
        document.querySelector('.slideshow-next')?.classList.remove('hide');
      }
      changeSlide(slideshowInfo, index, nextIndex);
    }
  });
}

const createStreamingSearchCard = (resultsBlock) => {
  const card = document.createElement('div');
  card.className = 'search-card';
  card.classList.add('response-animation');
  card.innerHTML = `<div class="search-card-container"><div class="search-card-warning"><p>${GENAI_SEARCH_WARNING}</p></div><article></article><div class="slideshow"></div></div>`;

  resultsBlock.innerHTML = card.outerHTML;
};

const updateStreamingSearchCard = (resultsBlock, response, socket) => {
  const article = resultsBlock.querySelector('.search-card article');

  // Create the div if it doesn't exist
  if (!article && response.type === 'streaming') {
    createStreamingSearchCard(resultsBlock);

    // Get search-card-container elements
    const cardContainer = resultsBlock.querySelector('.search-card');

    // Trigger the animation by adding the 'show' class
    cardContainer.classList.add('show');

    // Create the cursor animation element
    const cursorAnimation = document.createElement('span');
    cursorAnimation.className = 'cursor-animation';
    resultsBlock.querySelector('.search-card-container').appendChild(cursorAnimation);
  }

  // If the div already exists, update its content with the new message
  if (article && marked) {
    article.innerHTML = marked.parse(response.result);
  }

  // Add target="_blank" to all anchor tags
  const card = resultsBlock.querySelector('.search-card');
  const anchorTags = card?.querySelectorAll('a');

  anchorTags?.forEach((anchorTag) => {
    anchorTag.setAttribute('target', '_blank');
  });

  // Loop through result.questions and create a button for each
  if (response.type === 'end') {
    console.log('response', response);
    // Remove the cursor animation element
    const cursorAnimation = resultsBlock.querySelector('.cursor-animation');
    cursorAnimation.classList.add('hide');

    if (response.links?.length > 0) {
      const $slideShowContainer = document.querySelector('.gen-ai .genai-search-container .slideshow');

      const $slidesContainer = document.createElement('div');

      $slidesContainer.classList.add('slides-container');
      const slides = [];
      response.links?.forEach((link) => {
        const linkContainer = document.createElement('div');
        linkContainer.className = 'slide';

        const slideContent = document.createElement('a');
        slideContent.className = 'text-div';
        slideContent.href = link.url;
        slideContent.target = '_blank';

        let { hostname } = new URL(slideContent.href);
        if (hostname.indexOf('www.') > -1) {
          hostname = hostname.split('www.')[1];
        }

        const slideDomain = document.createElement('h4');
        slideDomain.textContent = hostname;

        const slideText = document.createElement('p');

        const slideTitle = document.createElement('strong');
  
        slideTitle.textContent = decodeURI(link.name);
        slideText.appendChild(slideTitle);
        const slideDescription = document.createTextNode(link.description);
        slideText.appendChild(slideDescription);

        slideContent.appendChild(slideDomain);
        slideContent.appendChild(slideText);
        linkContainer.appendChild(slideContent);
        $slidesContainer.appendChild(linkContainer);
        slides.push(linkContainer);
      });

      slides[0].setAttribute('active', true);

      $slideShowContainer.prepend($slidesContainer);

      const $sliderPrev = document.createElement('div');
      $sliderPrev.innerHTML = '&#60;';
      $sliderPrev.className = 'slideshow-prev hide';
      $slideShowContainer.appendChild($sliderPrev);
      const $sliderNext = document.createElement('div');
      $sliderNext.innerHTML = '&#62;';
      $sliderNext.className = 'slideshow-next';
      $slideShowContainer.appendChild($sliderNext);


      $slideShowContainer.addEventListener(Events.SLIDE_CHANGED, (e) => {
        updateSlide(e.detail.currentIndex, e.detail.newIndex, $slideShowContainer);
      });

      const slideshowInfo = {
        slideshowContainer: $slideShowContainer,
        slides,
      };

      decorateSlideshowAria(slideshowInfo, false);
      initializeTouch($slideShowContainer, slideshowInfo);
    }

    if (response.questions?.length > 0) {
      // Add the divider and further questions heading
      const divider = document.createElement('div');
      divider.className = 'divider';
      const h4 = document.createElement('h4');
      h4.textContent = 'Further Questions';
      card.appendChild(divider);
      card.appendChild(h4);
    }
    const paragraph = document.createElement('p');
    paragraph.className = 'search-card-buttons';
    response.questions?.forEach((question) => {
      const button = document.createElement('button');
      button.className = 'search-card-button';
      button.textContent = question;
      paragraph.appendChild(button);
    });

    card.appendChild(paragraph);
  }
};

async function displaySearchResults(query, resultsBlock) {
  if (isRequestInProgress) {
    // A request is already in progress, so do not proceed.
    return;
  }
  isRequestInProgress = true;

  // Create the loading message element
  const loadingMessage = document.createElement('div');
  loadingMessage.className = 'loading-message';
  loadingMessage.textContent = 'Gathering sources...';

  // Create the cursor animation element
  const cursorAnimation = document.createElement('span');
  cursorAnimation.className = 'cursor-animation';
  loadingMessage.appendChild(cursorAnimation);
  resultsBlock.appendChild(loadingMessage);
  const { firstChild } = resultsBlock;
  resultsBlock.insertBefore(loadingMessage, firstChild);

  const results = await fetchStreamingResults('petplace4', query, resultsBlock);
  isRequestInProgress = false;


  // Get search-card-container elements
  const cardContainer = resultsBlock.querySelector('.search-card');
  cardContainer?.classList.add('response-animation');

  // Trigger the animation by adding the 'show' class after a small delay
  cardContainer?.classList.add('show');

  resultsBlock.addEventListener('click', (event) => {
    const searchBox = document.getElementById('genai-search-box');

    const searchBlock = document.querySelector('.genai-search-wrapper');

    if (event.target.matches('.search-card-button') && isRequestInProgress === false) {
      searchBlock.scrollIntoView({ behavior: 'smooth' });
      searchBox.value = event.target.innerText;
      resultsBlock.innerHTML = '';

      displaySearchResults(event.target.innerText, resultsBlock);
      if (window.history.pushState) {
        const newSearch = `${window.location.protocol}//${window.location.host}${window.location.pathname}?q=${event.target.innerText}`;
        window.history.pushState({ path: newSearch }, '', newSearch);
      }
    }
  });
}

export async function loadEager() {
  // if (isTrueSearch) {
  //   createTemplateBlock(main, 'pagination');
  //   main.insertBefore(buildSortBtn(), main.querySelector(':scope > div:nth-of-type(2)'));
  // } else {
  //   const response = await fetch('/fragments/404.plain.html');
  //   main.innerHTML = await response.text();
  // }
}

export async function loadLazy(main) {
  const hero = document.createElement('div');
  const imgDiv = document.createElement('div');
  const contentDiv = document.createElement('div');
  const defaultContentWrapper = main.querySelector('.default-content-wrapper');
  const heroContainer = main.querySelector('.section.hero-container');
  hero.className = 'hero-wrapper';
  imgDiv.className = 'img-div';
  contentDiv.classList = 'text-div';

  [...heroContainer.querySelectorAll('picture')].forEach((el) => {
    imgDiv.append(el);
  });
  hero.append(imgDiv);
  contentDiv.append(document.querySelector('h1'));

  [...defaultContentWrapper.querySelectorAll('p')].forEach((el) => {
    if (el.innerText.trim() !== '') {
      contentDiv.append(el);
    }
  });
  if (isTrueSearch) {
    contentDiv.append(document.querySelector('.genai-search-wrapper'));
  }
  // heroContainer.remove();
  hero.append(contentDiv);
  // decorateResponsiveImages(imgDiv, ['461']);
  heroContainer.replaceWith(hero);

  // Create the search results <div> element with am-region attribute
  const searchResultsDivElement = document.createElement('div');
  searchResultsDivElement.setAttribute('class', 'search-results');
  searchResultsDivElement.setAttribute('am-region', 'Search');
  searchResultsDivElement.appendChild(decorateSearch());
  defaultContentWrapper.appendChild(searchResultsDivElement);

  const usp = new URLSearchParams(window.location.search);
  const searchQuery = usp.get('q') || '';
  if (searchQuery) {
    displaySearchResults(searchQuery, searchResultsDivElement);
  }

  // console.log('hero', hero);
  // renderArticles();
  // Softnav progressive enhancement for browsers that support it
  // if (window.navigation) {
  //   window.addEventListener('popstate', async () => {
  //     // renderArticles();
  //   });
  // }
}
