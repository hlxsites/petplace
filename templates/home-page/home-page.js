const GENAI_TOOLTIP = 'Try our AI powered discovery tool and get all your questions answered';

function isValidZipcode(code) {
  const regex = /^[0-9]{5}(?:-[0-9]{4})?$/;

  return regex.test(code);
}

function createSpanBlock(main) {
  const insuranceSearch = main.querySelector('.insurance-search');
  if (!insuranceSearch) {
    return;
  }
  const formEl = insuranceSearch.querySelector('.search-box-wrapper');
  formEl.removeAttribute('action');
  const searchInput = formEl.querySelector('.search-input');
  const searchButton = insuranceSearch.querySelector('.search-button');
  const errorMsg = main.querySelector('.find-useful-wrapper');

  // Eventlistener to redirect user to aggregator site.
  searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    const code = searchInput.value;
    if (isValidZipcode(code)) {
      errorMsg.style.display = 'none';
      searchInput.classList.remove('error-state');
      formEl.classList.remove('error-spacing');
      searchInput.value = '';
      window.open(
        `https://quote.petplace.com/quote?zipCode=${code}`,
        '_blank',
      );
    } else {
      errorMsg.style.display = 'block';
      searchInput.classList.add('error-state');
      formEl.classList.add('error-spacing');
      searchInput.value = '';
    }
  });
}

function addWidgetScript(block) {
  const scriptContent = `
    (() => {
        const e = document.currentScript.getAttributeNames(),
            t = document.getElementById("widgetTarget");
        document.createElement("object");
        let r = "";
        if (e && e.length > 0) {
            let t = e.find((e) => "brand" === e.toLocaleLowerCase());
            t && (r = "/" + document.currentScript.getAttribute(t)), (r += "/widget");
            let c = !0;
            e.forEach((e) => {
                if ("brand" === e.toLocaleLowerCase()) return;
                let t = \`\${e}=\${document.currentScript.getAttribute(e)}\`;
                c ? ((c = !1), (r += "?")) : (t = "&" + t), (r += t);
            });
        }
        let c = "https://quote.petpremium.com" + r;
        t.innerHTML = \`<iframe loading="lazy" style='width: 100%; height: 100%; border: none' src='\${c}'></iframe>\`;
    })();
  `;

  // Select the target div
  const widgetDiv = block.querySelector('.aggregator-tool');
  if (widgetDiv) {
    // Append the HTML content
    widgetDiv.innerHTML = `
      <div id="widgetTarget" style="height: 100%; width: 100%"></div>
    `;

    // Create a new script element
    const scriptElement = document.createElement('script');
    scriptElement.setAttribute('brand', 'petplace');
    scriptElement.setAttribute('source', 'petplace_home');
    scriptElement.textContent = scriptContent;

    // Append the script element to the target div
    widgetDiv.querySelector('#widgetTarget').appendChild(scriptElement);
  }
}

const buildGenAISearchCTA = () => {
  const headerSearchButton = document.createElement('div');
  headerSearchButton.className = 'header-search';
  headerSearchButton.innerHTML = `<a data-modal="/tools/search"><img src="${window.hlx.codeBasePath}/icons/ai_generate_white.svg"><span class="tooltip">${GENAI_TOOLTIP}</span></a>`;

  window.addEventListener('scroll', () => {
    if (window.scrollY >= 68) {
      headerSearchButton.classList.add('scrolled'); // New position when scrolled to the threshold
    } else {
      headerSearchButton.classList.remove('scrolled'); // Original position
    }
  });

  headerSearchButton.addEventListener('click', async () => {
    const { pushToDataLayer } = await import('../../scripts/utils/helpers.js');
    await pushToDataLayer({
      event: 'genai_floater',
      element_type: 'button',
    });
    document.location.pathname = '/discovery';
  });

  return headerSearchButton;
};

export async function loadLazy(document) {
  // adding wave background
  const main = document.querySelector('#main');
  const bgWaveDiv = document.createElement('div');
  bgWaveDiv.append(main.children[0]);
  bgWaveDiv.append(main.children[0]);
  bgWaveDiv.className = 'home-banner-bg';
  main.prepend(bgWaveDiv);

  // insurance form
  createSpanBlock(main);

  // Lazy-loading iframe to improve page performance.

  const targetElements = document.querySelectorAll('.aggregator-tool');

  const options = {
    threshold: 0.1,
  };

  // Create an Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        addWidgetScript(main);

        // Stop observing
        observer.unobserve(targetElements[0]);
      }
    });
  }, options);

  // Start Observing
  observer.observe(targetElements[0]);

  const { adsenseFunc } = await import('../../scripts/adsense.js');
  adsenseFunc('home', 'create');

  // GenAI Search
  if (document.body.classList.contains('home-page')) {
    main.append(buildGenAISearchCTA());
  }
}

// eslint-disable-next-line import/prefer-default-export
export function loadEager() {
  return false;
}

export async function loadDelayed() {
  const { adsenseFunc } = await import('../../scripts/adsense.js');
  adsenseFunc('home');
}
