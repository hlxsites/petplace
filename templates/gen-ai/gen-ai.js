// import { buildBlock, sampleRUM } from '../../scripts/lib-franklin.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

// import { decorateResponsiveImages } from '../../scripts/scripts.js';
import {
  Events,
  decorateSlideshowAria,
  changeSlide,
} from '../../blocks/slideshow/aria-slideshow.js';

const GENAI_SEARCH_TITLE = "Discover PetPlace";
const GENAI_SEARCH_WARNING = "Discover PetPlace is powered by experimental Generative AI, information quality may vary.";

const sampleQuestions = [
  "Why Does One of My Cats Jump on the Other's Back and Bite His Neck?",
  "Why Dog Urine Odor Comes Back and How to Stop It",
  "When Is a Dog Considered an Adult?",
  "Can an Alaskan Malamute or Siberian Husky Puppy Play Nice with the Family Cat?",
  "Do Clavamox Antibiotic Drops Expire?",
  "Is It Dangerous for Dogs to Drink Pool Water?",
  "Can an Outdoor Cat Become an Indoor Cat?",
  "Cat Stress After Moving",
  "Is Eating Mice and Rabbits Healthy for My Cat?",
  "What Happens When Cat Food Expires?",
  "Does Your Puppy Need a Bordetella Vaccine?",
  "How Much Should I Feed My Puppy?",
  "Tips on Housetraining and Dealing with Accidents",
  "Should a Pet Be Off Antihistamines or Steroid Before Allergy Testing?",
  "My cat was recently spayed but the male cats still want to mate with her",
  "Should You Board Your Cat or Get a Sitter?",
  "Is Your Dog Smarter Than a 5th Grader?",
  "How Long Can a Pet Be Overdue for a Rabies Vaccine and Still Be Protected?"
]

const capabilities = [
  "Uses semantic search to find relevant answers",
  "Utilizes trusted data sources to generate responses",
  "Declines irrelevant and inappropriate queries",
]

const limitations = [
  "Does not support keyword matching",
  "Does not support complex queries",
  "May occasionally generate incorrect information",
]

const isTrueSearch = window.location.pathname === '/discovery';
let isRequestInProgress = false;

function removeAllEventListeners(element) {
  const clone = element.cloneNode(true);
  element.parentNode.replaceChild(clone, element);
}

function showRegenerateButton(resultsBlock) {
  // Show regenerate button container and add a click event listener
  const regenerateButtonContainer = document.querySelector('.regenerate-button-container');
  regenerateButtonContainer.classList.add('show');
  let regenerateButton = regenerateButtonContainer.querySelector('.regenerate-button');
  removeAllEventListeners(regenerateButton);
  regenerateButton = regenerateButtonContainer.querySelector('.regenerate-button');
  regenerateButton.addEventListener('click', () => {
    regenerateButtonContainer.classList.remove('show');

    const searchBox = document.getElementById('search-box');
    resultsBlock.innerHTML = '';
    displaySearchResults(searchBox.value, resultsBlock);
  });
}



const fetchStreamingResults = async (index, query, resultsBlock) => {
  if (query === '') {
    return {
      result: 'Please enter a search query.'
    }
  } else {
    // document.getElementById("clearButton").classList.add("show");
    // document.getElementById("vertical-bar").classList.add("show");
  }
  console.log('fetchStreamingResults');

  // Adobe Internal Endpoint
  // const socket = new WebSocket('wss://spire-dev.corp.ethos14-stage-va7.ethos.adobe.net/api/query');

  // Adobe External Endpoint
  const socket = new WebSocket("wss://spire-pp-temp-pub.ethos14-stage-va7.ethos.adobe.net/api/query");
  
  // BambooHR Endpoint
  // const socket = new WebSocket('wss://spire-bhr-temp-pub.ethos14-stage-va7.ethos.adobe.net/api/query');

  socket.addEventListener('open', function(event) {
    console.log('WebSocket connection established');

    const messageToSend = JSON.stringify({"query": query, "index": index});
    socket.send(messageToSend);
  });

  socket.addEventListener('message', function(event) {
    console.log('Message from server ', event);
    const message = JSON.parse(event.data);
    
    updateStreamingSearchCard(resultsBlock, message, socket);
  });

  socket.addEventListener('error', function(error) {
    console.error('WebSocket error:', error);
  });

  socket.addEventListener('close', function(event) {
    console.log('WebSocket connection closed');
  });
  console.log('socket', socket);
  // Show stop button container and add a click event listener
  // const stopButtonContainer = document.querySelector('.stop-button-container');
  // stopButtonContainer.classList.add('show');
  // let stopButton = stopButtonContainer.querySelector('.stop-button');
  // removeAllEventListeners(stopButton);
  // stopButton = stopButtonContainer.querySelector('.stop-button');
  // stopButton.addEventListener('click', () => {
  //   // Close the WebSocket connection
  //   socket.close();

  //   // Remove the cursor animation element
  //   const cursorAnimation = resultsBlock.querySelector('.cursor-animation');
  //   cursorAnimation.classList.add('hide');

  //   // Remove the loading message element
  //   const loadingMessage = resultsBlock.querySelector('.loading-message');
  //   if (loadingMessage) {
  //     resultsBlock.removeChild(loadingMessage);
  //   }

  //   // Remove the stop button container
  //   stopButtonContainer.classList.remove('show');

  //   const summaryContainer = resultsBlock.querySelector('.summary-columns');
  //   if (!summaryContainer) {
  //     // showRegenerateButton(resultsBlock);
  //   }
  // });
};

// Randomly select three questions from an array
const getRandomQuestions = (questions) => {
  const randomQuestions = [];
  while (randomQuestions.length < 3) {
    const randomIndex = Math.floor(Math.random() * questions.length);
    const randomQuestion = questions[randomIndex];
    if (!randomQuestions.includes(randomQuestion)) {
      randomQuestions.push(randomQuestion);
    }
  }
  return randomQuestions;
}

const decorateSearch = () => {
  // Create the <main> element
  const mainElement = document.createElement('div');
  mainElement.setAttribute('id', 'search-main');

  // Create the outer <div> element with class and data attributes
  const outerDivElement = document.createElement('div');
  outerDivElement.setAttribute('class', 'section genai-search-container');
  outerDivElement.setAttribute('data-section-status', 'loaded');

  // Create the inner <div> element with class attribute
  const innerDivElement = document.createElement('div');
  innerDivElement.setAttribute('class', 'default-content-wrapper');

  // Create the <h1> element with id attribute and text content
  const h1Element = document.createElement('h1');
  h1Element.setAttribute('id', 'search');
  const h1Text = document.createTextNode("Discover");
  h1Element.appendChild(h1Text);

  const xhrLogo = new XMLHttpRequest();
  xhrLogo.open('GET', `${window.hlx.codeBasePath}/icons/logo.svg`, true);
  xhrLogo.onreadystatechange = function () {
    if (xhrLogo.readyState === 4 && xhrLogo.status === 200) {
      // On successful response, create and append the SVG element
      const svgElement = document.createElement('svg');
      svgElement.className = 'icon-logo';
      svgElement.innerHTML = xhrLogo.responseText;
      h1Element.insertAdjacentHTML('afterend', svgElement.outerHTML);
    }
  };
  xhrLogo.send();

  // Append the <h1> element to the inner <div> element
  innerDivElement.appendChild(h1Element);

  // Create the second inner <div> element with class attribute
  const secondInnerDivElement = document.createElement('div');
  secondInnerDivElement.setAttribute('class', 'search-wrapper');

  // Create the search block <div> element with data attributes
  const searchDivElement = document.createElement('div');
  searchDivElement.setAttribute('class', 'search block');
  searchDivElement.setAttribute('data-block-name', 'search');
  searchDivElement.setAttribute('data-block-status', 'loaded');

  // Create the search box <div> element
  const searchBoxDivElement = document.createElement('div');
  searchBoxDivElement.setAttribute('class', 'search-box');

  // Create the search input <input> element with id and placeholder attributes
  const searchInput = document.createElement('input');
  searchInput.setAttribute('id', 'search-box');
  searchInput.setAttribute('type', 'text');
  searchInput.setAttribute('placeholder', 'Ask a question...');

  // Create clear button <button> element with id and image element
  const clearButton = document.createElement('button');
  clearButton.setAttribute('id', 'clearButton');
  clearButton.setAttribute('type', 'button');
  clearButton.innerHTML = '&#10005;';
  
  const verticalBar = document.createElement('span');
  verticalBar.setAttribute('id', 'vertical-bar');
  verticalBar.setAttribute('class', 'vertical-bar');

  searchInput.addEventListener("input", () => {
    if (searchInput.value.trim() !== "") {
      clearButton.classList.add("show");
      verticalBar.classList.add("show");
    } else {
      clearButton.classList.remove("show");
      verticalBar.classList.remove("show");
    }
  });

  searchInput.addEventListener("focus", () => {
    if (searchInput.value.trim() !== "") {
      clearButton.classList.add("show");
      verticalBar.classList.add("show");
    }
  });

  clearButton.addEventListener("click", () => {
    searchInput.value = '';
    searchInput.focus();
    clearButton.classList.remove("show");
    verticalBar.classList.remove("show");
  });

  // Create the search button <button> element with id and image element
  const searchButton = document.createElement('button');
  searchButton.setAttribute('id', 'search-button');
  searchButton.setAttribute('type', 'button');
  // const imageElement = document.createElement('img');
  // imageElement.src = `${window.hlx.codeBasePath}/icons/search.svg`;
  // imageElement.alt = 'Search';
  // imageElement.className = 'icon-search';
  // Create an AJAX request to fetch the SVG file
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `${window.hlx.codeBasePath}/icons/send.svg`, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      // On successful response, create and append the SVG element
      const svgElement = document.createElement('svg');
      svgElement.className = 'icon-search';
      svgElement.innerHTML = xhr.responseText;
      searchButton.appendChild(svgElement);
    }
  };
  xhr.send();
  // searchButton.appendChild(imageElement);
  // Append the search input <input> element to the search box <div> element
  searchBoxDivElement.appendChild(searchInput);
  searchBoxDivElement.appendChild(clearButton);
  console.log('clear button');
  searchBoxDivElement.appendChild(verticalBar);
  searchBoxDivElement.appendChild(searchButton);

  // Append the search box <div> element to the search block <div> element
  searchDivElement.appendChild(searchBoxDivElement);

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
      const firstChild = stopButton.firstChild;
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
      const firstChild = regenerateButton.firstChild;
      regenerateButton.insertBefore(svgElement, firstChild);
    }
  };
  xhr2.send();
  regenerateButtonContainer.appendChild(regenerateButton);

  // Append the stop generating button <button> element to the search block <div> element
  searchDivElement.appendChild(stopButtonContainer);
  searchDivElement.appendChild(regenerateButtonContainer);

  // Create the search results <div> element with am-region attribute
  const searchResultsDivElement = document.createElement('div');
  searchResultsDivElement.setAttribute('class', 'search-results');
  searchResultsDivElement.setAttribute('am-region', 'Search');

  // Append the search results <div> element to the search block <div> element
  searchDivElement.appendChild(searchResultsDivElement);

  // Append the inner <div> elements and search block <div> element to the outer <div> element
  outerDivElement.appendChild(innerDivElement);
  outerDivElement.appendChild(secondInnerDivElement);
  secondInnerDivElement.appendChild(searchDivElement);

  // Append the outer <div> element to the <main> element
  mainElement.appendChild(outerDivElement);

  // Append the <main> element to the body of the document
  document.body.appendChild(mainElement);

  return mainElement;
}

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
  // const $tabBar = $block.querySelector('.tab-bar-container');

  disableChildLinks($slidesContainer.children[currentIndex]);
  enableChildLinks($slidesContainer.children[nextIndex]);

  // $tabBar.querySelector('ol').children[currentIndex].querySelector('span').className = 'icon icon-circle';
  // $tabBar.querySelector('ol').children[nextIndex].querySelector('span').className = 'icon icon-circle-fill';
  // decorateIcons($tabBar.querySelector('ol'));

  $slidesContainer.style.transform = `translateX(-${nextIndex * 100}vw)`;
}

function initializeTouch($block, slideshowInfo) {
  // console.log('initializeTouch', $block, slideshowInfo);
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
    // console.log('index', index)
    $slidesContainer.style.transform = `translateX(calc(-${index}00vw + ${diffX}px))`;
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
      $slidesContainer.setAttribute('style', `transform:translateX(-${index}00vw)`);
    }
  }, { passive: true });
}

const createStreamingSearchCard = (resultsBlock) => {
  const card = document.createElement('div');
  card.className = 'search-card';
  card.classList.add('response-animation');
  card.innerHTML = `<div class="search-card-container"><div class="search-card-warning"><p>${GENAI_SEARCH_WARNING}</p></div><article></article><div class="slideshow"></div></div>`;

  resultsBlock.innerHTML = card.outerHTML;
};

const updateStreamingSearchCard = (resultsBlock, response, socket) => {  
  // console.log('updateStreamingSearchCard', resultsBlock, response, socket);
  const article = resultsBlock.querySelector('.search-card article');
  // const articleLinks = resultsBlock.querySelector('.search-card .slideshow');

  // Create the div if it doesn't exist
  if (!article && response.type === 'streaming') {
    console.log('Creating new search card');
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
  // resultsBlock.querySelector('.search-card article').innerHTML = marked.parse(response.result);
  if (article) {
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
      const $slideShowContainer = document.querySelector('.gen-ai .slideshow');

      const $slidesContainer = document.createElement('div');

      $slidesContainer.classList.add('slides-container');
      const slides = [];
      response.links?.forEach((link) => {
        const linkContainer = document.createElement('div');
        linkContainer.className = 'slide';
        const slideContent = document.createElement('div');
        slideContent.className = 'text-div';
        const slideTitle = document.createElement('h4');
        const slideText = document.createElement('p');
        slideTitle.textContent = link.name;
        slideText.textContent = link.description;

        slideContent.appendChild(slideTitle);
        slideContent.appendChild(slideText);
        linkContainer.appendChild(slideContent);
        $slidesContainer.appendChild(linkContainer);
        slides.push(linkContainer);
      });
      // console.log('slides', slides);

      slides[0].setAttribute('active', true);

      $slideShowContainer.prepend($slidesContainer);

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
      // $slideShowContainer.prepend($sliderNavBar);

      $slideShowContainer.addEventListener(Events.SLIDE_CHANGED, (e) => {
        updateSlide(e.detail.currentIndex, e.detail.newIndex, $slideShowContainer);
      });

      const slideshowInfo = {
        slideshowContainer: $slideShowContainer,
        slides,
        tabList,
      };
      decorateSlideshowAria(slideshowInfo, false);
      // decorateIcons($sliderNavBar);

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
    // resultsBlock.appendChild(createLinksCard(response));

    // Remove the stop button container
    // const stopButtonContainer = document.querySelector('.stop-button-container');
    // stopButtonContainer.classList.remove('show');
    // showRegenerateButton(resultsBlock);

    // Masonry layout
    // const masonry = new Masonry(".links-card-container ul", {
    //   itemSelector: ".links-card-container ul li",
    //   columnWidth: ".links-card-container ul li", // Set to a specific selector or number if needed
    //   gutter: 50, // Adjust the gap between items
    //   horizontalOrder: true, // Preserve the left-to-right order of items
    //   fitWidth: true
    // });

    // imagesLoaded('.links-card-container', () => {
    //   masonry.layout();
    // });
  }
}


const createSummaryColumn = (icon, title, list, type) => {
  const summaryColumnDiv = document.createElement("div");
  summaryColumnDiv.className = "summary-column";

  const titleElement = document.createElement("h4");
  titleElement.textContent = title;

  const xhr = new XMLHttpRequest();
  xhr.open('GET', `${window.hlx.codeBasePath}/icons/${icon}.svg`, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      // On successful response, create and append the SVG element
      const svgElement = document.createElement('svg');
      svgElement.className = 'icon-search';
      svgElement.innerHTML = xhr.responseText;

      const firstChild = titleElement.firstChild;
      titleElement.insertBefore(svgElement, firstChild);
    }
  };
  xhr.send();

  const items = document.createElement("ul");
  items.className = "summary-items";

  list.forEach((text) => {
    const item = document.createElement("li");
    item.className = 'summary-item';
    item.textContent = text;
    if (type === "button") {
      item.classList.add('hand-cursor');
      item.addEventListener('click', () => {
        if (isRequestInProgress === false) {
          const searchBox = document.getElementById('search-box');
          searchBox.value = text;
          displaySearchResults(text, document.querySelector('.search-results'));
        }
        
      })
    }
    items.appendChild(item);
  })

  summaryColumnDiv.appendChild(titleElement);
  summaryColumnDiv.appendChild(items);

  return summaryColumnDiv;
}

const createSearchSummary = () => {
  const summaryColumns = document.createElement("div");
  summaryColumns.className = "summary-columns";

  const summaryColumn1 = createSummaryColumn("examples", "Examples", getRandomQuestions(sampleQuestions), "button");
  const summaryColumn2 = createSummaryColumn("capabilities", "Capabilities", capabilities, "list");
  const summaryColumn3 = createSummaryColumn("limitations", "Limitations", limitations, "list");

  summaryColumns.appendChild(summaryColumn1);
  summaryColumns.appendChild(summaryColumn2);
  summaryColumns.appendChild(summaryColumn3);

  return summaryColumns;
}

const fetchResults = async (index, query) => {
  if (query === '') {
    return {
      result: 'Please enter a search query.'
    }
  } else {
    document.getElementById("clearButton").classList.add("show");
    document.getElementById("vertical-bar").classList.add("show");
  }

  // const apiURLBase = "https://spire-dev.corp.ethos14-stage-va7.ethos.adobe.net"; // Internal Endpoint
  const apiURLBase = "https://spire-pp-temp-pub.ethos14-stage-va7.ethos.adobe.net"; // External Endpoint
  const apiURL = apiURLBase + `/api/index/${index}/search`;
  const answer = await fetch(`${apiURL}?q=${query}`).then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Sorry, something went wrong. Please try again later.');
    }
  }).catch((error) => {
    console.log(error);
    return {
      result: 'Sorry, something went wrong. Please try again later.'
    }
  });

  return answer;
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

  // Assuming the response has a `result` property
  if (results && results.result) {
    console.log(results.result);
    // resultsBlock.innerHTML = createSearchCard(results);
    // resultsBlock.innerHTML += createLinksCard(results);
  } else {
    console.log('Invalid response format'); // Handle the case where the response does not have the expected structure
  }

  // Get search-card-container elements
  const cardContainer = resultsBlock.querySelector('.search-card');
  cardContainer?.classList.add('response-animation');

  // Trigger the animation by adding the 'show' class after a small delay
  cardContainer?.classList.add('show');
  // setTimeout(() => {
  //   cardContainer.classList.add('show');
  // }, 100);

  resultsBlock.addEventListener('click', (event) => {
    const searchBox = document.getElementById('genai-search-box');

    console.log('clicked results', searchBox);
    const searchBlock = document.querySelector('.genai-search-wrapper');

    if (event.target.matches('.search-card-button') && isRequestInProgress === false) {
      console.log('Further questions clicked!');
      searchBlock.scrollIntoView({ behavior: 'smooth' });
      searchBox.value = event.target.innerText;
      resultsBlock.innerHTML = '';
      // const regenerateButtonContainer = document.querySelector('.regenerate-button-container');
      // regenerateButtonContainer.classList.remove('show');
      displaySearchResults(event.target.innerText, resultsBlock);
      if (window.history.pushState) {
        const newSearch = `${window.location.protocol}//${window.location.host}${window.location.pathname}?q=${event.target.innerText}`;
        window.history.pushState({ path: newSearch }, '', newSearch);
      }
    }
  });
  console.log('resultsBlock', resultsBlock);
}



export async function loadEager(main) {
  // if (isTrueSearch) {
  //   createTemplateBlock(main, 'pagination');
  //   main.insertBefore(buildSortBtn(), main.querySelector(':scope > div:nth-of-type(2)'));
  // } else {
  //   const response = await fetch('/fragments/404.plain.html');
  //   main.innerHTML = await response.text();
  // }
}

export async function loadLazy(main) {
  console.log('loadLazy', main);
  const hero = document.createElement('div');
  const imgDiv = document.createElement('div');
  const contentDiv = document.createElement('div');
  const defaultContentWrapper = main.querySelector('.default-content-wrapper');
  const heroContainer = main.querySelector('.section.hero-container');
  defaultContentWrapper.parentElement.classList.add('hero-container');
  hero.className = 'hero-wrapper';
  imgDiv.className = 'img-div';
  contentDiv.classList = 'text-div';
  
  [...heroContainer.querySelectorAll('picture')].forEach((el) => {
    imgDiv.append(el);
  });
  hero.append(imgDiv);
  contentDiv.append(document.querySelector('h1'));
  console.log('imgDiv', imgDiv);
  console.log('defaultContentWrapper', defaultContentWrapper);
  
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
  defaultContentWrapper.appendChild(searchResultsDivElement);

  const usp = new URLSearchParams(window.location.search);
  let searchQuery = usp.get('q') || '';
  console.log('searchBox', searchQuery );
  if(searchQuery){

    displaySearchResults(searchQuery , searchResultsDivElement);
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
