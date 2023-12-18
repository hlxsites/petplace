import { buildBlock, sampleRUM } from '../../scripts/lib-franklin.js';
import { decorateResponsiveImages } from '../../scripts/scripts.js';
import {  decorateSearch, showRegenerateButton,  createSearchSummary, GENAI_SEARCH_TITLE } from '../../blocks/header/genai-search.js';

const GENAI_SEARCH_WARNING = "Discover PetPlace is powered by experimental Generative AI, information quality may vary.";

const isTrueSearch = window.location.pathname === '/discovery';
let isRequestInProgress = false;

const createStreamingSearchCard = (resultsBlock) => {
  const card = document.createElement('div');
  card.className = 'search-card';
  card.classList.add('response-animation');
  card.innerHTML = `<div class="search-card-container"><div class="search-card-warning"><p>${GENAI_SEARCH_WARNING}</p></div><article></article><div class="search-card-links"></div></div>`;

  resultsBlock.innerHTML = card.outerHTML;
};

const updateStreamingSearchCard = (resultsBlock, response, socket) => {  
  console.log('updateStreamingSearchCard', resultsBlock, response, socket);
  const article = resultsBlock.querySelector('.search-card article');
  const articleLinks = resultsBlock.querySelector('.search-card .search-card-links');

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
      response.links?.forEach((link) => {
        const linkContainer = document.createElement('span');
        linkContainer.className = 'search-card-link';
        const linkTitle = document.createElement('h4');
        const linkText = document.createElement('p');
        linkTitle.textContent = link.name;
        linkText.textContent  = link.description;

        linkContainer.appendChild(linkTitle);
        linkContainer.appendChild(linkText);
        articleLinks.appendChild(linkContainer);
      });

      const linkGroup = document.createElement('div');
      linkGroup.className = 'search-card-links';
      articleLinks.appendChild(linkGroup);
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
  // resultsBlock.appendChild(loadingMessage);
  const firstChild = resultsBlock.firstChild;
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
