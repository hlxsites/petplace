const GENAI_SEARCH_TITLE = "Discover PetPlace";

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
    document.getElementById("clearButton").classList.add("show");
    document.getElementById("vertical-bar").classList.add("show");
  }

  // Adobe Internal Endpoint
  const socket = new WebSocket('wss://spire-dev.corp.ethos14-stage-va7.ethos.adobe.net/api/query');
  
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

  // Show stop button container and add a click event listener
  const stopButtonContainer = document.querySelector('.stop-button-container');
  stopButtonContainer.classList.add('show');
  let stopButton = stopButtonContainer.querySelector('.stop-button');
  removeAllEventListeners(stopButton);
  stopButton = stopButtonContainer.querySelector('.stop-button');
  stopButton.addEventListener('click', () => {
    // Close the WebSocket connection
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
      showRegenerateButton(resultsBlock);
    }
  });
};

let isRequestInProgress = false;

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

const createStreamingSearchCard = (resultsBlock) => {
  const card = document.createElement('div');
  card.className = 'search-card';
  card.classList.add('response-animation');
  card.innerHTML = `<div class="search-card-container"><article></article></div>`;

  resultsBlock.innerHTML = card.outerHTML;
}

const updateStreamingSearchCard = (resultsBlock, response, socket) => {  
  const article = resultsBlock.querySelector('.search-card article');

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
  resultsBlock.querySelector('.search-card article').innerHTML = marked.parse(response.result);

  // Add target="_blank" to all anchor tags
  const card = resultsBlock.querySelector('.search-card');
  const anchorTags = card.querySelectorAll('a');

  anchorTags?.forEach((anchorTag) => {
    anchorTag.setAttribute('target', '_blank');
  });

  // Loop through result.questions and create a button for each
  if (response.type === 'end') {
    // Remove the cursor animation element
    const cursorAnimation = resultsBlock.querySelector('.cursor-animation');
    cursorAnimation.classList.add('hide');

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
    resultsBlock.appendChild(createLinksCard(response));

    // Remove the stop button container
    const stopButtonContainer = document.querySelector('.stop-button-container');
    stopButtonContainer.classList.remove('show');
    showRegenerateButton(resultsBlock);

    // Masonry layout
    const masonry = new Masonry(".links-card-container ul", {
      itemSelector: ".links-card-container ul li",
      columnWidth: ".links-card-container ul li", // Set to a specific selector or number if needed
      gutter: 50, // Adjust the gap between items
      horizontalOrder: true, // Preserve the left-to-right order of items
      fitWidth: true
    });

    imagesLoaded('.links-card-container', () => {
      masonry.layout();
    });
  }
}

const createSearchCard = (results) => {
  const card = document.createElement('div');
  card.className = 'search-card';
  card.innerHTML = `<div class="search-card-container"><article>${marked.parse(results.result)}</article></div><div class="divider"></div><h4>Further Questions</h4>`;

  // Add target="_blank" to all anchor tags
  const anchorTags = card.querySelectorAll('a');

  anchorTags.forEach((anchorTag) => {
    anchorTag.setAttribute('target', '_blank');
  });

  // Loop through result.questions and create a button for each
  const paragraph = document.createElement('p');
  paragraph.className = 'search-card-buttons';
  results.questions?.forEach((question) => {
    const button = document.createElement('button');
    button.className = 'search-card-button';
    button.textContent = question;
    paragraph.appendChild(button);
  });
  card.appendChild(paragraph);

  return card.outerHTML;
}

const createLinksCard = (results) => {
  const linksContainer = document.createElement("div");
  linksContainer.className = "links-card-container";
  linksContainer.classList.add('response-animation');

  // Trigger the animation by adding the 'show' class
  linksContainer.classList.add('show');
  const list = document.createElement("ul");

  results.links?.forEach((link) => {
    const listItem = document.createElement("li");
    const thumbnailElement = document.createElement('img');
    thumbnailElement.src = link.thumbnail;
    thumbnailElement.alt = link.name;
    listItem.appendChild(thumbnailElement);

    const linkInfoElement = document.createElement('div');
    linkInfoElement.className = 'link-info';
    linkInfoElement.innerHTML = `<a href="${link.url}" target="_blank">${link.name}</a><p>${link.description}</p>`;
    listItem.appendChild(linkInfoElement);
    listItem.addEventListener('click', () => {
      window.open(link.url, '_blank');
    });
    list.appendChild(listItem);
  })

  linksContainer.appendChild(list);

  return linksContainer;
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

  // const apiURLBase = window.location.port === "3000" ? "http://localhost:8080" : "";
  const apiURLBase = "https://spire-dev.corp.ethos14-stage-va7.ethos.adobe.net";
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

const fetchResultsMock = async () => {
  const responseData = {
    "links": [
      {
          "description": "BambooHR article on how to find the right candidate for the job you are posting. Tips on how to invest the time now to ensure the best new hires.",
          "name": "The Right Candidate for Your Job Ad - BambooHR Blog",
          "thumbnail": "https://www.bamboohr.com/blog/media_10015e10cb75ec2e6b9c6d105abcf3ed9cd51f2f3.jpeg?width=1200&format=pjpg&optimize=medium",
          "url": "https://www.bamboohr.com/blog/attracting-right-candidates-job-ad"
      },
      {
          "description": "Onboarding and offboarding are the beginning and end of the employee experience, and they have a big impact on what comes in between.",
          "name": "HR 101 | Employee Onboarding & Offboarding",
          "thumbnail": "https://www.bamboohr.com/hr-101-guide/media_1f366a5205098a89c0378d5b0e92f59e68c7ebb35.png?width=1200&format=pjpg&optimize=medium",
          "url": "https://www.bamboohr.com/hr-101-guide/chapter-3-talent-acquisition"
      },
      {
          "description": "How do you capture the attention of the best job seekers and compete with big business at the same time? Check out our recruiting tips and tricks.",
          "name": "How to Recruit Like the Big Guys on a Small Business Budget",
          "thumbnail": "https://www.bamboohr.com/blog/media_1181468b0d96ae911f001ec78e6629f103ed2fee7.png?width=1200&format=pjpg&optimize=medium",
          "url": "https://www.bamboohr.com/blog/recruit-on-a-small-budget"
      },
      {
          "description": "It's tough to balance agility and quality. Here are four simple strategies for speeding up your recruiting process without sacrificing candidate quality.",
          "name": "5 Easy Steps to Speed Up Your Hiring Process - BambooHR Blog",
          "thumbnail": "https://www.bamboohr.com/blog/media_15282b3b902ae25dde9c6f155c5cd2e26d0bea4f0.jpeg?width=1200&format=pjpg&optimize=medium",
          "url": "https://www.bamboohr.com/blog/speed-up-your-hiring-process"
      },
      {
          "description": "Finding and retaining great talent can be difficult in today's market, but recruiting quality hires can make all the difference. To help you find and keep the best talent, you may need to take a look at your hiring processes and how you can improve them.",
          "name": "A How-To Guide for Improving Your Quality of Hire | BambooHR",
          "thumbnail": "https://www.bamboohr.com/resources/ebooks/media_178a190df02a4028e338bef7a7a8c77dc2f303a9f.jpeg?width=1200&format=pjpg&optimize=medium",
          "url": "https://www.bamboohr.com/resources/ebooks/a-how-to-guide-for-improving-your-quality-of-hire"
      },
      {
          "description": "Strategic HR departments use hiring forecasts to have people hired and ramped up just in time for increased demand. Here are some tips for creating your own.",
          "name": "10 Tips for Creating a Hiring Forecast | BambooHR",
          "thumbnail": "https://www.bamboohr.com/blog/media_158f6d2065b852651520f532d1f53520e2849bd1e.jpeg?width=1200&format=pjpg&optimize=medium",
          "url": "https://www.bamboohr.com/blog/10-tips-for-creating-a-hiring-forecast"
      }
    ],
    "query": "how do I make a good hire?",
    "questions": [
        "How can I ensure that a candidate will fit with the company culture?",
        "How can I assess a candidate's skills during the hiring process?",
        "What are some common mistakes to avoid during the hiring process?",
        "How can I attract top talent to my company?"
    ],
    "result": "## Tips for Making a Good Hire\nAccording to the BambooHR blog post \"The Right Candidate for Your Job Ad\", here are some tips for making a good hire:\n- Have a candid conversation with the hiring manager about what the job description should say.\n- Write a job description that gives an accurate reflection of the position along with preferred and critical qualifications.\n- Get the hiring info upfront, including salary range, realistic qualifications, desired qualifications, responsibilities, and perks.\n- Consider the status quo before hiring someone new. Ensure that everyone on the team is meeting the status quo for efficiency before bringing in someone new.\n- Prioritize hiring needs to make sure the most important positions are filled first.\n\nFor more tips on improving the quality of your hires, check out the BambooHR ebook \"A How-To Guide for Improving Your Quality of Hire\".\n\n\n\n\n\n\n"
  }
  await new Promise(r => setTimeout(r, 2000));  // Sleep in ms

  return responseData;
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
  // resultsBlock.appendChild(loadingMessage);
  const firstChild = resultsBlock.firstChild;
  resultsBlock.insertBefore(loadingMessage, firstChild);

  // const results = await fetchResults('bamboohr', query);
  // const results = await fetchResults('wkndcf', query);
  // const results = await fetchResultsMock();
  const results = await fetchStreamingResults('petplace4', query, resultsBlock);
  isRequestInProgress = false;
  
  // Assuming the response has a `result` property
  if (results && results.result) {
    // console.log(results.result);
    resultsBlock.innerHTML = createSearchCard(results);
    // resultsBlock.innerHTML += createLinksCard(results);
  } else {
    console.log('Invalid response format'); // Handle the case where the response does not have the expected structure
  }

  // Get search-card-container elements
  const cardContainer = resultsBlock.querySelector('.search-card');
  cardContainer.classList.add('response-animation');

  // Trigger the animation by adding the 'show' class after a small delay
  cardContainer.classList.add('show');
  // setTimeout(() => {
  //   cardContainer.classList.add('show');
  // }, 100);
}

export { decorateSearch, createSearchSummary, displaySearchResults, isRequestInProgress, GENAI_SEARCH_TITLE };