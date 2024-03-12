import {
  Events,
  decorateSlideshowAria,
  changeSlide,
} from '../../blocks/slideshow/aria-slideshow.js';

const GENAI_SEARCH_WARNING = 'Discover PetPlace is powered by experimental Generative AI, information quality may vary.';


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

  const socket = new WebSocket("wss://experience-platform-asgd-spire-deploy-ethos12-prod-cbc821.cloud.adobe.io/api/query");

  socket.addEventListener('open', (event) => {
    // console.log('WebSocket connection established');

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

  // Create the search results <div> element with am-region attribute
  const searchResultsDivElement = document.createElement('div');
  searchResultsDivElement.setAttribute('class', 'search-results');
  searchResultsDivElement.setAttribute('am-region', 'Search');

  // Append the search results <div> element to the search block <div> element
  return stopButtonContainer;

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
        if (link.name) {
          slideTitle.textContent = decodeURI(link.name);
          slideText.appendChild(slideTitle);
        }
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

function displayInsuranceCTA(resultsBlock) {
  const insuranceCtaCopy = document.head.querySelector('insurance-cta-text')?.content || 'Pet insurance may provide assistance with costs related to accidents & illness, Click to learn more.';
  const insuranceCtaPath = document.head.querySelector('insurance-page-path')?.content || '/pet-insurance';

  const resultContainer = document.createElement('div');
  resultContainer.className = 'insurance-card';
  resultContainer.innerHTML = `<div class="search-card-warning"><p>${GENAI_SEARCH_WARNING}</p></div>`;
  
  const ctaContainer = document.createElement('div');
  ctaContainer.className = 'cta-container';
  
  const ctaTitle = document.createElement('h4');
  ctaTitle.textContent = 'Petplace.com/pet-insurance';

  const ctaText = document.createElement('p');
  ctaText.textContent = insuranceCtaCopy;

  ctaContainer.appendChild(ctaTitle);
  ctaContainer.appendChild(ctaText);
  resultContainer.appendChild(ctaContainer);
  resultsBlock.appendChild(resultContainer);

  ctaContainer.addEventListener('click', () => {
    const petInsurancePath = `${window.location.protocol}//${window.location.host}${insuranceCtaPath}`;
    window.location.href = petInsurancePath;
  });
}

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
    const searchBox = document.getElementById('genai-search-box') || document.getElementById('search-box');

    const searchBlock = document.querySelector('.genai-search-wrapper');

    if (event.target.matches('.search-card-button') && isRequestInProgress === false) {
      searchBlock.scrollIntoView({ behavior: 'smooth' });

      window.localStorage.setItem('gen-ai-query', JSON.stringify(event.target.innerText));
      searchBox.value = event.target.innerText;
      resultsBlock.innerHTML = '';
      displaySearchResults(event.target.innerText, resultsBlock);
    }
  });
}

export async function loadEager() {

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
  hero.append(contentDiv);
  heroContainer.replaceWith(hero);

  // Create the search results <div> element with am-region attribute
  const searchResultsDivElement = document.createElement('div');
  searchResultsDivElement.setAttribute('class', 'search-results');
  searchResultsDivElement.setAttribute('am-region', 'Search');
  searchResultsDivElement.appendChild(decorateSearch());
  defaultContentWrapper.appendChild(searchResultsDivElement);

  const searchQuery = window.localStorage.getItem('gen-ai-query');
  if (searchQuery) {
    if (searchQuery.indexOf('insurance') === -1) {
      displaySearchResults(searchQuery, searchResultsDivElement);
    } else {
      displayInsuranceCTA(searchResultsDivElement);
    }
    // window.localStorage.removeItem('gen-ai-query');
  }

}
