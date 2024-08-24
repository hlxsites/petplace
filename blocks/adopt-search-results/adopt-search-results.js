/* eslint-disable indent */
import { fetchPlaceholders } from '../../scripts/lib-franklin.js';
import endPoints from '../../variables/endpoints.js';
// eslint-disable-next-line
import { acquireToken, isLoggedIn } from '../../scripts/lib/msal/msal-authentication.js';
import { buildPetCard } from '../../scripts/adoption/buildPetCard.js';
import { setSaveSearch } from '../../scripts/adoption/saveSearch.js';
import { callUserApi } from '../account/account.js';
import { initRedirectHandlers } from '../../scripts/lib/msal/login-redirect-handlers.js';
import { isMobile } from '../../scripts/scripts.js';
import errorPage from '../../scripts/adoption/errorPage.js';
import MultiSelect from '../pet-survey/multi-select.js';

// fetch placeholders from the /adopt folder currently, but placeholders should |
// be moved into the root' folder eventually
const placeholders = await fetchPlaceholders('/pet-adoption');
const {
    petTypeLabel,
    petTypeValues,
    breedLabel,
    shelterLabel,
    zipLabel,
    zipPlaceholder,
    searchAlertText,
    genderOptions,
    sizeOptions,
    radiusOptions,
    ageOptions,
    filtersLabel,
    radiusLabel,
    genderLabel,
    sizeLabel,
    ageLabel,
    clearLabel,
    sortedLabel,
    applyFiltersLabel,
    filterCta,
    createSearchAlert,
    zipErrorMessage,
    clearShelterFilters,
    noResultsConsiderExpandRadius,
} = placeholders;

let breedList = [];
let shelterList = [];
let currentPage = 1;
const recordsPerPage = 16;
let animalArray = [];
let selectedBreeds = [];
let selectedShelters = [];
let shelterMultiSelect = null;

const noResultsContent = `
<svg xmlns="http://www.w3.org/2000/svg" width="80" height="81" viewBox="0 0 80 81" fill="none">
<path d="M4.55688 43.6738C4.55688 47.8761 5.38459 52.0373 6.99274 55.9197C8.60089 59.8021 10.958 63.3298 13.9295 66.3012C16.9009 69.2727 20.4286 71.6298 24.311 73.238C28.1934 74.8461 32.3546 75.6738 36.5569 75.6738C40.7592 75.6738 44.9203 74.8461 48.8028 73.238C52.6852 71.6298 56.2128 69.2727 59.1843 66.3012C62.1558 63.3298 64.5129 59.8021 66.121 55.9197C67.7292 52.0373 68.5569 47.8761 68.5569 43.6738C68.5569 35.1869 65.1855 27.0476 59.1843 21.0464C53.1831 15.0452 45.0438 11.6738 36.5569 11.6738C28.07 11.6738 19.9306 15.0452 13.9295 21.0464C7.9283 27.0476 4.55688 35.1869 4.55688 43.6738Z" fill="#EBE8FC"/>
<path d="M11.0369 19.3032H59.1945V57.2736H11.0369V19.3032Z" fill="#7369AB"/>
<path d="M19.372 19.3032H13.8152C13.0789 19.3041 12.373 19.5972 11.8527 20.1181C11.3323 20.6391 11.04 21.3453 11.04 22.0816V32.2688H19.372V19.3032Z" fill="white"/>
<path d="M22.1504 35.9727H46.2288V45.2335H22.1504V35.9727Z" fill="white"/>
<path d="M38.8201 32.2688V19.3032H36.0417V32.2688H22.1505V19.3032H19.3721V57.2712H22.1505V48.012H46.2305V57.2712H49.0089V35.9728H59.1945V32.2688H38.8201ZM46.2289 45.2336H22.1489V35.9728H46.2289V45.2336Z" fill="white" stroke="#302280" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M11.0369 19.3032H59.1945V57.2736H11.0369V19.3032Z" stroke="#302280" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M32.3368 5.271C34.5469 5.27078 36.6667 6.14845 38.2298 7.71095C39.7929 9.27346 40.6714 11.3929 40.672 13.603C40.672 17.4382 34.8856 25.9286 32.9552 28.655C32.8852 28.7539 32.7925 28.8346 32.6849 28.8902C32.5773 28.9459 32.458 28.9749 32.3368 28.9749C32.2157 28.9749 32.0963 28.9459 31.9887 28.8902C31.8811 28.8346 31.7884 28.7539 31.7184 28.655C29.788 25.9286 24 17.4382 24 13.603C24.0003 12.5085 24.2162 11.4248 24.6353 10.4137C25.0545 9.40269 25.6686 8.48409 26.4428 7.71039C27.2169 6.93669 28.1359 6.32305 29.1472 5.9045C30.1585 5.48594 31.2423 5.27068 32.3368 5.271Z" fill="white" stroke="#302280" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M28.5481 13.6033C28.5481 14.6081 28.9473 15.5718 29.6578 16.2823C30.3683 16.9929 31.332 17.3921 32.3369 17.3921C33.3417 17.3921 34.3054 16.9929 35.016 16.2823C35.7265 15.5718 36.1257 14.6081 36.1257 13.6033C36.1257 12.5984 35.7265 11.6347 35.016 10.9242C34.3054 10.2136 33.3417 9.81445 32.3369 9.81445C31.332 9.81445 30.3683 10.2136 29.6578 10.9242C28.9473 11.6347 28.5481 12.5984 28.5481 13.6033Z" fill="#7369AB" stroke="#302280" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M23.5393 69.5441C23.5393 69.9124 24.8077 70.2657 27.0655 70.5261C29.3233 70.7866 32.3855 70.9329 35.5785 70.9329C38.7715 70.9329 41.8337 70.7866 44.0915 70.5261C46.3493 70.2657 47.6177 69.9124 47.6177 69.5441C47.6177 69.1757 46.3493 68.8225 44.0915 68.562C41.8337 68.3016 38.7715 68.1553 35.5785 68.1553C32.3855 68.1553 29.3233 68.3016 27.0655 68.562C24.8077 68.8225 23.5393 69.1757 23.5393 69.5441Z" fill="#7369AB"/>
<path d="M49.0071 57.2711H56.4159C57.1528 57.2711 57.8595 56.9783 58.3805 56.4573C58.9016 55.9362 59.1943 55.2295 59.1943 54.4927V35.9727H49.0071V57.2711Z" fill="white"/>
<path d="M33.6105 54.7174C34.7057 56.5072 36.1427 58.0637 37.8395 59.2982C39.5363 60.5326 41.4596 61.4208 43.4996 61.9119C45.5397 62.4031 47.6565 62.4876 49.7292 62.1607C51.8019 61.8338 53.7899 61.1018 55.5797 60.0066C57.3695 58.9113 58.9261 57.4743 60.1605 55.7775C61.3949 54.0807 62.2831 52.1574 62.7742 50.1174C63.2654 48.0774 63.3499 45.9606 63.023 43.8879C62.6961 41.8152 61.9641 39.8272 60.8689 38.0374C59.7736 36.2476 58.3366 34.691 56.6398 33.4565C54.943 32.2221 53.0197 31.3339 50.9797 30.8428C48.9397 30.3517 46.8229 30.2671 44.7502 30.5941C42.6775 30.921 40.6895 31.6529 38.8997 32.7482C37.1099 33.8434 35.5533 35.2804 34.3189 36.9772C33.0844 38.674 32.1963 40.5973 31.7051 42.6373C31.214 44.6774 31.1294 46.7942 31.4564 48.8669C31.7833 50.9396 32.5153 52.9276 33.6105 54.7174Z" fill="white" stroke="#302280" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M34.4568 46.3776C34.4568 49.7677 35.8035 53.019 38.2007 55.4161C40.5978 57.8133 43.8491 59.16 47.2392 59.16C50.6293 59.16 53.8805 57.8133 56.2777 55.4161C58.6749 53.019 60.0216 49.7677 60.0216 46.3776C60.0216 42.9875 58.6749 39.7363 56.2777 37.3391C53.8805 34.9419 50.6293 33.5952 47.2392 33.5952C43.8491 33.5952 40.5978 34.9419 38.2007 37.3391C35.8035 39.7363 34.4568 42.9875 34.4568 46.3776Z" fill="#7369AB"/>
<path d="M56.2775 37.3386C58.0647 39.1264 59.2817 41.404 59.7746 43.8835C60.2675 46.3629 60.0141 48.9328 59.0465 51.2682C58.0789 53.6037 56.4405 55.5998 54.3386 57.0041C52.2366 58.4085 49.7654 59.1581 47.2375 59.1581C44.7095 59.1581 42.2384 58.4085 40.1364 57.0041C38.0344 55.5998 36.3961 53.6037 35.4285 51.2682C34.4609 48.9328 34.2075 46.3629 34.7004 43.8835C35.1933 41.404 36.4103 39.1264 38.1975 37.3386C39.3845 36.1512 40.7938 35.2093 42.3449 34.5667C43.896 33.924 45.5585 33.5933 47.2375 33.5933C48.9164 33.5933 50.579 33.924 52.1301 34.5667C53.6812 35.2093 55.0905 36.1512 56.2775 37.3386Z" stroke="#302280" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M63.8096 59.1818L60.2641 55.6362C59.7462 56.3627 59.1687 57.0448 58.5376 57.6754C58.1558 58.0573 57.7606 58.4154 57.3521 58.7498L60.8 62.1946L63.8096 59.1818Z" fill="white" stroke="#302280" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M44.5744 41.3761C44.8278 41.9808 44.8305 42.6613 44.5821 43.268C44.3336 43.8748 43.8543 44.3579 43.2496 44.6113C42.645 44.8646 41.9644 44.8673 41.3577 44.6189C40.751 44.3704 40.2678 43.8912 40.0144 43.2865C39.624 42.3545 40.0144 39.7801 40.2432 38.5057C40.2574 38.4243 40.2919 38.3478 40.3434 38.2833C40.3949 38.2187 40.4618 38.1682 40.538 38.1363C40.6142 38.1044 40.6972 38.0922 40.7794 38.1008C40.8615 38.1095 40.9401 38.1386 41.008 38.1857C42.08 38.9169 44.184 40.4441 44.5744 41.3761Z" fill="#7369AB" stroke="#302280" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M49.9039 41.3761C49.6506 41.9808 49.6478 42.6613 49.8963 43.268C50.1447 43.8748 50.624 44.3579 51.2287 44.6113C51.8334 44.8646 52.514 44.8673 53.1207 44.6189C53.7274 44.3704 54.2106 43.8912 54.4639 43.2865C54.8543 42.3545 54.4639 39.7801 54.2351 38.5057C54.2209 38.4244 54.1864 38.3481 54.135 38.2836C54.0835 38.2192 54.0167 38.1687 53.9406 38.1368C53.8645 38.105 53.7817 38.0927 53.6996 38.1013C53.6176 38.1098 53.539 38.1388 53.4711 38.1857C52.3999 38.9169 50.2943 40.4441 49.9039 41.3761Z" fill="#7369AB" stroke="#302280" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M47.2393 55.077C42.2945 55.077 36.4913 41.8906 47.2393 41.8906C57.9873 41.8906 52.1841 55.077 47.2393 55.077Z" fill="white"/>
<path d="M51.944 51.4585C54.1168 47.7281 54.2736 42.3905 48.1368 41.9233C47.6339 42.7774 47.3332 43.7353 47.2578 44.7235C47.1824 45.7118 47.3343 46.7042 47.7018 47.6247C48.0694 48.5451 48.6428 49.3692 49.3781 50.0338C50.1134 50.6983 50.9911 51.1857 51.944 51.4585Z" fill="#7369AB"/>
<path d="M47.2393 55.077C42.2945 55.077 36.4913 41.8906 47.2393 41.8906C57.9873 41.8906 52.1841 55.077 47.2393 55.077Z" stroke="#302280" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M43.488 46.423C43.488 46.7508 43.6183 47.0652 43.8501 47.297C44.0818 47.5288 44.3962 47.659 44.724 47.659C45.0518 47.659 45.3662 47.5288 45.598 47.297C45.8298 47.0652 45.96 46.7508 45.96 46.423C45.96 46.0952 45.8298 45.7808 45.598 45.549C45.3662 45.3172 45.0518 45.187 44.724 45.187C44.3962 45.187 44.0818 45.3172 43.8501 45.549C43.6183 45.7808 43.488 46.0952 43.488 46.423Z" fill="#302280"/>
<path d="M48.568 53.7512C48.568 54.4848 47.2392 55.08 47.2392 55.08C47.2392 55.08 45.9104 54.4848 45.9104 53.7512C45.9104 53.3987 46.0504 53.0608 46.2996 52.8116C46.5488 52.5624 46.8868 52.4224 47.2392 52.4224C47.5916 52.4224 47.9296 52.5624 48.1788 52.8116C48.428 53.0608 48.568 53.3987 48.568 53.7512Z" fill="#302280"/>
<path d="M48.5183 46.423C48.5183 46.7508 48.6485 47.0652 48.8803 47.297C49.1121 47.5288 49.4265 47.659 49.7543 47.659C50.0821 47.659 50.3965 47.5288 50.6283 47.297C50.8601 47.0652 50.9903 46.7508 50.9903 46.423C50.9903 46.0952 50.8601 45.7808 50.6283 45.549C50.3965 45.3172 50.0821 45.187 49.7543 45.187C49.4265 45.187 49.1121 45.3172 48.8803 45.549C48.6485 45.7808 48.5183 46.0952 48.5183 46.423Z" fill="#302280"/>
<path d="M60.5136 63.981C60.4142 63.8817 60.3354 63.7637 60.2816 63.634C60.2279 63.5042 60.2002 63.3651 60.2002 63.2246C60.2002 63.0841 60.2279 62.945 60.2816 62.8152C60.3354 62.6854 60.4142 62.5675 60.5136 62.4682L63.7848 59.197C63.884 59.0975 64.0019 59.0187 64.1317 58.9648C64.2615 58.911 64.4006 58.8833 64.5412 58.8833C64.6817 58.8833 64.8208 58.911 64.9506 58.9648C65.0804 59.0187 65.1983 59.0975 65.2976 59.197L74.452 68.3514C75.0864 68.9858 75.4428 69.8462 75.4428 70.7434C75.4428 71.6406 75.0864 72.501 74.452 73.1354C73.8176 73.7698 72.9571 74.1262 72.06 74.1262C71.1628 74.1262 70.3024 73.7698 69.668 73.1354L60.5136 63.981Z" fill="#7369AB"/>
<path d="M60.5136 63.981C60.4142 63.8817 60.3354 63.7637 60.2816 63.634C60.2279 63.5042 60.2002 63.3651 60.2002 63.2246C60.2002 63.0841 60.2279 62.945 60.2816 62.8152C60.3354 62.6854 60.4142 62.5675 60.5136 62.4682L63.7848 59.197C63.884 59.0975 64.0019 59.0187 64.1317 58.9648C64.2615 58.911 64.4006 58.8833 64.5412 58.8833C64.6817 58.8833 64.8208 58.911 64.9506 58.9648C65.0804 59.0187 65.1983 59.0975 65.2976 59.197L74.452 68.3514C75.0864 68.9858 75.4428 69.8462 75.4428 70.7434C75.4428 71.6406 75.0864 72.501 74.452 73.1354C73.8176 73.7698 72.9571 74.1262 72.06 74.1262C71.1628 74.1262 70.3024 73.7698 69.668 73.1354L60.5136 63.981Z" stroke="#302280" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
${noResultsConsiderExpandRadius}`;

 // Get filters
function getFilters() {
    const genderFilters = document.querySelectorAll('input[name="gender"]:checked');
    let genderFilterList = '';
    genderFilters?.forEach((gender) => {
        if (genderFilterList !== '') {
            genderFilterList += `,${gender?.value}`;
        } else {
            genderFilterList += gender?.value || '';
        }
    });
    const ageFilters = document.querySelectorAll('input[name="age"]:checked');
    let ageFilterList = '';
    ageFilters?.forEach((age) => {
        if (ageFilterList !== '') {
            ageFilterList += `,${age?.value || ''}`;
        } else {
            ageFilterList += age?.value || 0;
        }
    });

    const sizeFilters = document.querySelectorAll('input[name="size"]:checked');
    let sizeFilterList = '';
    sizeFilters?.forEach((size) => {
        if (sizeFilterList !== '') {
            sizeFilterList += `,${size?.value || 0}`;
        } else {
            sizeFilterList += size?.value || 0;
        }
    });
    const filters = {
        milesRadius: document.getElementById('radius')?.value,
        filterGender: genderFilterList,
        filterAge: ageFilterList,
        filterAnimalType: document.getElementById('pet-type')?.value,
        filterBreed: selectedBreeds,
        filterShelter: selectedShelters,
        zipPostal: document.getElementById('zip')?.value,
        // Add more filters as needed
    };

    // Only include the size filter in the request filter object when 'Cat' is not selected
    if (document.getElementById('pet-type')?.value !== 'Cat') {
        filters.filterSize = sizeFilterList;
    }

    return filters;
}

// Apply filters
function applyFilters() {
    const filters = getFilters();
    // Update the URL with the selected filters as query parameters
    const params = new URLSearchParams(filters);
    window.history.replaceState({}, '', `?${params.toString()}`);
}
let callInProgress = false;

function waitFor(conditionFunction) {
    const poll = (resolve) => {
        if (conditionFunction()) resolve();
        else setTimeout(() => poll(resolve), 400);
    };

    return new Promise(poll);
}

async function callAnimalList() {
    await waitFor(() => callInProgress === false);
    callInProgress = true;
    applyFilters();
    const petType = document.getElementById('pet-type')?.value;
    let animalType = null;
    if (petType !== 'null') {
        animalType = petType;
    }
    const breedType = selectedBreeds;
    const breeds = [];
    breedType.forEach((breed) => {
        breeds.push(breed);
    });
    let zip = document.getElementById('zip')?.value;
    if (!zip) {
        zip = null;
    }
    let radius = document.getElementById('radius')?.value;
    if (!radius || radius === 'null') {
        radius = 10;
    }
    const genderElements = document.querySelectorAll('input[name="gender"]:checked');
    let gender = '';
        if (genderElements.length === 1) {
            gender = genderElements[0]?.value;
        }
    const age = document.querySelectorAll('input[name="age"]:checked');
    let ageList = [];
    if (age && age?.length === 0) {
        ageList = null;
    } else {
        age?.forEach((item) => {
            ageList.push(item.value);
        });
    }
    const size = document.querySelectorAll('input[name="size"]:checked');
    let sizeList = [];
    if (size && size?.length === 0) {
        sizeList = null;
    } else {
        size?.forEach((item) => {
            sizeList.push(item.value);
        });
    }
    let shelters = null;
    if (selectedShelters.length > 0) {
        shelters = selectedShelters;
    }
    breedType.forEach((breed) => {
        breeds.push(breed);
    });
    // remove 'ANY' from breed selection
    for (let i = 0; i < selectedBreeds.length; i += 1) {
        if (selectedBreeds[i] === 'ANY') {
            selectedBreeds.splice(i, 1);
        }
    }
    const response = await fetch(`${endPoints.apiUrl}/animal`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            locationInformation: {
                clientId: shelters,
                zipPostal: zip,
                milesRadius: radius,
            },
            animalFilters: {
                startIndex: 0,
                filterAnimalType: animalType,
                filterBreed: selectedBreeds,
                filterGender: gender,
                filterAge: ageList,
                filterSize: sizeList,
            },
        }),
    });
    callInProgress = false;
    if (response.status === 204) {
        // eslint-disable-next-line
        buildResultsContainer([]);
        let resultsContainer = document.querySelector('.default-content-wrapper.results');
        if (!resultsContainer) {
            resultsContainer = document.querySelector('.default-content-wrapper');
        }
        const paginationBlock = document.querySelector('.pagination');
        paginationBlock.classList.add('hide');
        resultsContainer.classList.add('no-results');
        resultsContainer.innerHTML = noResultsContent;
        return null;
        // eslint-disable-next-line
    } else {
        document.querySelector('.default-content-wrapper').classList.remove('no-results');
        const paginationBlock = document.querySelector('.pagination');
        paginationBlock?.classList.remove('hide');
    }
    return response.json();
}

async function callBreedList(petType) {
    const breedSelect = document.getElementById('breed-button');
    if (breedSelect && (petType === 'other' || petType === 'null')) {
        breedSelect.setAttribute('disabled', '');
        document.querySelector('#breed-button').innerText = 'Any';
    } else {
        if (breedSelect) {
            breedSelect.removeAttribute('disabled');
            document.querySelector('#breed-button').innerText = 'Select from menu...';
        }
        let endpoint = `${endPoints.apiUrl}/breed`;
        if (petType !== 'null') {
            endpoint = `${endpoint}/${petType}`;
        }
        const response = await fetch(endpoint, {
            method: 'GET',
        });
        return response.json();
    }
    return null;
}

async function callShelterList() {
    const zip = document.getElementById('zip')?.value;
    const radius = document.getElementById('radius')?.value;
    const endpoint = `${endPoints.apiUrl}/shelter/search`;
    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            locationInformation: {
                zipPostal: zip,
                milesRadius: radius,
            },
        }),
    });
    return response.json();
}

function clearShelterSelections() {
    const shelterSelect = document.getElementById('shelter');
    const checkboxes = shelterSelect.querySelectorAll('input');
    checkboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            checkbox.checked = false;
            // Create a new 'change' event
            const event = new Event('change');
            // Dispatch it.
            checkbox.dispatchEvent(event);
        }
        });
    selectedShelters = [];
}

async function updateBreedListSelect() {
    const breedSelect = document.querySelector('#breeds');
    breedSelect.innerHTML = '';

    const divAny = document.createElement('div');
    const inputOptionAny = document.createElement('input');
    inputOptionAny.type = 'checkbox';
    inputOptionAny.id = 'any';
    inputOptionAny.value = 'ANY';
    inputOptionAny.textContent = 'Any';
    divAny.classList.add('multi-select__input');
    const labelAny = document.createElement('label');
    labelAny.setAttribute('for', 'any');
    labelAny.innerText = 'Any';
    divAny.append(inputOptionAny, labelAny);

    breedSelect.append(divAny);
    breedList?.forEach((breed) => {
        const div = document.createElement('div');

        const inputOption = document.createElement('input');
        inputOption.type = 'checkbox';
        inputOption.id = `${breed.breedValue.toLowerCase().replace(/\s/g, '')}`;
        inputOption.value = breed.breedKey;
        inputOption.textContent = breed.breedValue;
        div.classList.add('multi-select__input');
        const label = document.createElement('label');
        label.setAttribute('for', `${inputOption.id}`);
        label.innerText = breed.breedValue;
        div.append(inputOption, label);

        breedSelect.append(div);
    });

    const groupDiv = document.querySelector('#breeds');
    const containerDiv = document.querySelector('.multi-select.breed');
    const checkboxArray = groupDiv.querySelectorAll('input');
    checkboxArray?.forEach((checkbox, index) => {
        checkbox.addEventListener('change', () => {
            if (checkbox.checked && index === 0) {
                const selectedCheckboxes = Array.from(groupDiv.querySelectorAll("input[type='checkbox']")).filter((node) => node.checked);
                selectedCheckboxes.forEach((input) => {
                    input.checked = false;
                });
                checkboxArray[0].checked = true;
            } else if (checkbox.checked && index !== 0) {
                checkboxArray[0].checked = false;
            }
            // updating label
            const buttonText = containerDiv.querySelector('#breed-button');
            const selected = Array.from(groupDiv.querySelectorAll("input[type='checkbox']")).filter((node) => node.checked);
            selectedBreeds = [];
            selected.forEach((select) => {
                if (select.value !== '') {
                    selectedBreeds.push(select.value);
                }
            });
            const displayText = selected.length > 0
                ? `${selected.length} selected`
                : 'Select from menu...';
            buttonText.innerText = displayText;
            getFilters();
            callAnimalList().then((data) => {
                if (data) {
                    // eslint-disable-next-line
                    buildResultsContainer(data);
                }
            });
        });
    });
}

async function updateShelterListSelect() {
    const shelterSelect = document.querySelector('#shelters');
    shelterSelect.innerHTML = '';
    shelterList?.forEach((shelter) => {
        const div = document.createElement('div');

        const inputOption = document.createElement('input');
        inputOption.type = 'checkbox';
        inputOption.id = `${shelter.ClientId}`;
        inputOption.value = shelter.ClientId;
        inputOption.textContent = shelter.ClientName;
        div.classList.add('multi-select__input');
        const label = document.createElement('label');
        label.setAttribute('for', `${inputOption.id}`);
        label.innerText = shelter.ClientName;
        div.append(inputOption, label);

        shelterSelect.append(div);
    });

    const groupDiv = document.querySelector('#shelters');
    const containerDiv = document.querySelector('.multi-select.shelter');
    const checkboxArray = groupDiv.querySelectorAll('input');
    checkboxArray?.forEach((checkbox) => {
        checkbox.addEventListener('change', () => {
            // updating label
            const buttonText = containerDiv.querySelector('#shelter-button');
            const selected = Array.from(groupDiv.querySelectorAll("input[type='checkbox']")).filter((node) => node.checked);
            selectedShelters = [];
            selected.forEach((select) => {
                if (select.value !== '') {
                    selectedShelters.push(select.value);
                }
            });
            const displayText = selected.length > 0
                ? `${selected.length} selected`
                : 'Select from menu...';
            buttonText.innerText = displayText;
            getFilters();
            if (shelterMultiSelect) shelterMultiSelect.close();
            callAnimalList().then((data) => {
                if (data) {
                    // eslint-disable-next-line
                    buildResultsContainer(data);
                }
            });
        });
    });
}

function numPages() {
    // eslint-disable-next-line no-unsafe-optional-chaining
    return Math.ceil(animalArray?.length / recordsPerPage);
}

function getFavorites(response) {
    fetch(`${endPoints.apiUrl}/adopt/api/Favorite`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${response}`,
        },
    }).then((responseData) => responseData.json()).then((data) => {
        // favorite Pet in the UI
        data.forEach((favorite) => {
            const favoriteButton = document.getElementById(favorite?.Animal.ReferenceNumber);
            favoriteButton?.classList.add('favorited');
            favoriteButton?.setAttribute('data-favorite-id', favorite?.Id);
        });
    })
    .catch((error) => {
        errorPage();
        // eslint-disable-next-line no-console
        console.error('Error:', error);
    });
}

function buildResultsList(animalList) {
    const tempResultsBlock = document.getElementById('results-block');
    if (tempResultsBlock.offsetHeight !== 0) {
        tempResultsBlock.style.height = `${tempResultsBlock.offsetHeight.toString()}px`;
    }
    tempResultsBlock.innerHTML = '';
    animalList.forEach((animal) => {
        const div = buildPetCard(animal);
        tempResultsBlock.append(div);
    });
    // check if user is logged in
    isLoggedIn().then((isLoggedInParam) => {
        if (isLoggedInParam) {
            // if logged in set pet as favorite
            acquireToken()
            .then((response) => {
                getFavorites(response);
            })
            .catch((error) => {
                errorPage();
                // eslint-disable-next-line no-console
                console.error('Error:', error);
            });
        } else {
          // not logged in or token is expired without ability to silently refresh its validity
        }
      });
    setTimeout(() => {
        tempResultsBlock.style.removeProperty('height');
    }, '400');
}

function calculatePagination(page) {
    let tempPage = page;
    if (tempPage.currentTarget?.myParam) {
        tempPage = page.currentTarget?.myParam;
        currentPage = page.currentTarget?.myParam;
    }
    const prevButton = document.querySelector('#btn_prev');
    const nextButton = document.querySelector('#btn_next');
    if (currentPage === 1) {
        prevButton.disabled = true;
    } else {
        prevButton.disabled = false;
    }
    if (currentPage === numPages()) {
        nextButton.disabled = true;
    } else {
        nextButton.disabled = false;
    }
    const filteredArray = [];
    // Validate page
    if (tempPage < 1) tempPage = 1;
    if (tempPage > numPages()) tempPage = numPages();
    for (
        let i = (tempPage - 1) * recordsPerPage;
        i < tempPage * recordsPerPage && i < animalArray?.length;
        i += 1
        ) {
        filteredArray.push(animalArray[i]);
        }
    const paginationNumbers = document.querySelector('.pagination-numbers');
    paginationNumbers.innerHTML = '';
    // add pagination numbers
    const maxPagesToShow = 2; // Adjust as needed
    for (let y = 1; y <= numPages(); y += 1) {
        if (
            y === 1
            || y === numPages()
            || (y >= currentPage - Math.floor(maxPagesToShow / 2)
            && y <= currentPage + Math.floor(maxPagesToShow / 2))
        ) {
            const button = document.createElement('button');
            if (y === currentPage) {
                button.className = 'active';
            }
            button.addEventListener('click', calculatePagination);
            button.myParam = y;
            button.innerHTML = y;
            paginationNumbers.append(button);
        } else if (
            y === currentPage - Math.floor(maxPagesToShow / 2) - 1
            || y === currentPage + Math.floor(maxPagesToShow / 2) + 1
            ) {
            const ellipsis = document.createElement('span');
            ellipsis.textContent = '...';
            paginationNumbers.appendChild(ellipsis);
        }
    }
    buildResultsList(filteredArray);
    if (isMobile()) return;
    document.querySelector('.adopt-search-results-container').scrollIntoView({
        behavior: 'smooth',
    });
}

function prevPage() {
    if (currentPage > 1) {
        currentPage -= 1;
        calculatePagination(currentPage);
    }
}

function nextPage() {
    if (currentPage < numPages()) {
        currentPage += 1;
        calculatePagination(currentPage);
    }
}

function clearFilters() {
    selectedBreeds = [];
    clearShelterSelections();
    const radiusSelect = document.getElementById('radius');
    if (radiusSelect) {
        radiusSelect.selectedIndex = 0;
    }
    const radioButtons = document.querySelectorAll('.sidebar input:checked');
    for (let i = 0; i < radioButtons.length; i += 1) {
        radioButtons[i].checked = false;
    }
    const shelterSelect = document.getElementById('shelter');
    const shelterCheckboxes = shelterSelect.querySelectorAll('input');
    shelterCheckboxes.forEach((checkbox) => {
        checkbox.checked = false;
    });
    callAnimalList().then((data) => {
        if (data) {
            // eslint-disable-next-line
            buildResultsContainer(data);
        }
    });
}

function openModal() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.add('show');
    const overlay = document.querySelector('.overlay');
    overlay.classList.add('show');
}

function closeModal() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.remove('show');
    const overlay = document.querySelector('.overlay');
    overlay.classList.remove('show');
}

function buildFilterSidebar(sidebar) {
    const filterLabel = document.createElement('h3');
    filterLabel.className = 'sidebar-label';
    filterLabel.innerHTML = filtersLabel;
    sidebar.append(filterLabel);

    // create mobile close button
    const closeButton = document.createElement('button');
    closeButton.className = 'modal-close';
    closeButton.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4.5 19.5L19.5 4.5" stroke="#09090D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.5 4.5L19.5 19.5" stroke="#09090D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    closeButton.addEventListener('click', closeModal);
    sidebar.append(closeButton);

    // create clear button
    const clearButton = document.createElement('button');
    clearButton.className = 'sidebar-clear';
    clearButton.innerHTML = clearLabel;
    clearButton.addEventListener('click', clearFilters);
    sidebar.append(clearButton);

    // create search radius select
    const radiusLabelElement = document.createElement('label');
    radiusLabelElement.for = 'radius';
    radiusLabelElement.className = 'sidebar-header';
    radiusLabelElement.innerText = radiusLabel;

    const radiusSelect = document.createElement('select');
    radiusSelect.name = 'radius';
    radiusSelect.id = 'radius';
    radiusSelect.className = 'filter-select';
    radiusSelect.addEventListener('change', () => {
        callAnimalList().then((data) => {
            // eslint-disable-next-line
            buildResultsContainer(data);
            callShelterList().then((innerData) => {
                // eslint-disable-next-line
                shelterList = innerData;
                clearShelterSelections();
                updateShelterListSelect();
            });
        });
    });
    const radiusList = radiusOptions.split(',');
        radiusList.forEach((radius) => {
            const radiusListOption = document.createElement('option');
            radiusListOption.innerText = radius;
            radiusListOption.value = radius;

            radiusSelect.append(radiusListOption);
        });
    sidebar.append(radiusLabelElement);
    sidebar.append(radiusSelect);

    // create gender radio buttons
    const genderBlock = document.createElement('div');
    genderBlock.className = 'radio-block';
    const genderLabelElement = document.createElement('div');
    genderLabelElement.className = 'sidebar-header';
    genderLabelElement.innerText = genderLabel;
    genderBlock.append(genderLabelElement);
    sidebar.append(genderBlock);

    const genderList = genderOptions.split(',');
    genderList.forEach((gender) => {
        const genderListLabel = document.createElement('label');
        genderListLabel.for = gender;
        genderListLabel.className = 'radio-container';
        genderListLabel.innerHTML = gender;
        const genderRadio = document.createElement('input');
        genderRadio.type = 'checkbox';
        genderRadio.name = 'gender';
        genderRadio.id = gender;
        genderRadio.value = placeholders[gender.toLowerCase()];
        genderRadio.addEventListener('click', () => {
            callAnimalList().then((data) => {
                if (data) {
                    // eslint-disable-next-line
                    buildResultsContainer(data);
                }
            });
        });
        genderListLabel.append(genderRadio);
        const checkmark = document.createElement('span');
        checkmark.className = 'checkmark';
        genderListLabel.append(checkmark);
        genderBlock.append(genderListLabel);
    });

    // create age radio buttons
    const ageBlock = document.createElement('div');
    ageBlock.className = 'radio-block';
    const ageLabelElement = document.createElement('div');
    ageLabelElement.className = 'sidebar-header';
    ageLabelElement.innerText = ageLabel;
    ageBlock.append(ageLabelElement);
    sidebar.append(ageBlock);

    const ageList = ageOptions.split(',');
    ageList.forEach((age) => {
        const ageListLabel = document.createElement('label');
        ageListLabel.for = age;
        ageListLabel.className = 'radio-container';
        ageListLabel.innerHTML = age;
        const ageRadio = document.createElement('input');
        ageRadio.type = 'checkbox';
        ageRadio.name = 'age';
        ageRadio.id = age;
        ageRadio.addEventListener('click', () => {
            callAnimalList().then((data) => {
                if (data) {
                    // eslint-disable-next-line
                    buildResultsContainer(data);
                }
            });
        });
        const formattedAge = age[0].toLowerCase() + age.slice(1);
        ageRadio.value = placeholders[formattedAge?.replace(/\s+/g, '')?.replace(/\+/g, '')?.replace(/\//g, '')];
        if (formattedAge === 'under 1 Year') {
            ageRadio.value = 'PK';
        }
        ageListLabel.append(ageRadio);
        const checkmark = document.createElement('span');
        checkmark.className = 'checkmark';
        ageListLabel.append(checkmark);
        ageBlock.append(ageListLabel);
    });

    // create size radio buttons
    const sizeBlock = document.createElement('div');
    sizeBlock.className = 'radio-block radio-size';
    const sizeLabelElement = document.createElement('div');
    sizeLabelElement.className = 'sidebar-header';
    sizeLabelElement.innerText = sizeLabel;

    // check if size should be hidden
    const params = new URLSearchParams(window.location.search);
    if (params.get('filterAnimalType') === 'Cat' || params.get('filterAnimalType') === 'Other') {
        sizeBlock.classList.add('hidden');
    }

    sizeBlock.append(sizeLabelElement);
    sidebar.append(sizeBlock);

    const sizeList = sizeOptions.split(',');
    sizeList.forEach((size) => {
        const sizeListLabel = document.createElement('label');
        sizeListLabel.for = size;
        sizeListLabel.className = 'radio-container';
        sizeListLabel.innerHTML = size;
        const sizeRadio = document.createElement('input');
        sizeRadio.type = 'checkbox';
        sizeRadio.name = 'size';
        sizeRadio.id = size;
        sizeRadio.value = placeholders[size.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) => {
            if (+match === 0) return '';
            return index === 0 ? match.toLowerCase() : match.toUpperCase();
        })];
        sizeRadio.addEventListener('click', () => {
            callAnimalList().then((data) => {
                if (data) {
                    // eslint-disable-next-line
                    buildResultsContainer(data);
                }
            });
        });
        sizeListLabel.append(sizeRadio);
        const checkmark = document.createElement('span');
        checkmark.className = 'checkmark';
        sizeListLabel.append(checkmark);
        sizeBlock.append(sizeListLabel);
    });

    // Building Shelter List custom multi select element
    const shelterContainer = document.createElement('div');
    shelterContainer.className = 'radio-block';
    const shelterLabelElement = document.createElement('label');
    shelterLabelElement.for = 'shelter';
    shelterLabelElement.innerText = shelterLabel;
    shelterLabelElement.setAttribute('for', 'shelter');
    shelterLabelElement.className = 'sidebar-header';

    const containerDiv = document.createElement('div');
    containerDiv.className = 'multi-select shelter';
    containerDiv.id = 'shelter';
    containerDiv.append(shelterLabelElement);

    const shelterButton = document.createElement('button');
    shelterButton.id = 'shelter-button';
    shelterButton.classList.add('multi-select__button');
    shelterButton.type = 'button';
    shelterButton.setAttribute('aria-expanded', 'false');
    shelterButton.setAttribute('aria-controls', 'shelters');

    const multiSelectPlaceholder = document.createElement('span');
    multiSelectPlaceholder.className = 'multi-select__button-text';
    multiSelectPlaceholder.innerText = 'Select from menu...';

    const icon = document.createElement('span');
    icon.className = 'multi-select__button-icon';
    shelterButton.append(multiSelectPlaceholder, icon);

    const groupDiv = document.createElement('div');
    groupDiv.setAttribute('role', 'group');
    groupDiv.setAttribute('aria-labelledby', 'shelter-button');
    groupDiv.setAttribute('tabindex', '0');
    groupDiv.className = 'multi-select__options';
    groupDiv.id = 'shelters';

    containerDiv.append(shelterButton, groupDiv);
    // create clear shelter filters button
    const clearSheltersButton = document.createElement('button');
    clearSheltersButton.className = 'shelter-clear';
    clearSheltersButton.innerHTML = clearShelterFilters;
    clearSheltersButton.addEventListener('click', clearShelterSelections);
    containerDiv.append(clearSheltersButton);
    // eslint-disable-next-line
    shelterMultiSelect = new MultiSelect(containerDiv);
    shelterContainer.append(containerDiv);
    sidebar.append(shelterContainer);

    // create mobile filter buttons
    const mobileContainer = document.createElement('div');
    mobileContainer.className = 'mobile-button-container';

    // create clear button
    const clearMobileButton = document.createElement('button');
    clearMobileButton.className = 'sidebar-clear-mobile';
    clearMobileButton.innerHTML = clearLabel;
    clearMobileButton.addEventListener('click', clearFilters);
    mobileContainer.append(clearMobileButton);

    // create filter button
    const mobileFilterButton = document.createElement('button');
    mobileFilterButton.className = 'filter-mobile';
    mobileFilterButton.innerHTML = applyFiltersLabel;
    mobileFilterButton.addEventListener('click', closeModal);
    mobileContainer.append(mobileFilterButton);

    sidebar.append(mobileContainer);
}

function emailOptInConfirmModal() {
    const optInModalEl = document.createElement('div');
    const emailOptInModalStructure = `
        <div class="modal-header">
        <h3 class="modal-title">Allow Email Notifications?</h3>
        </div>
        <div class="modal-body">
            <p>You must opt-in to email communications in order to create a search alert.</p>
            <div class="modal-action-btns">
                <button class="cancel">Cancel</button>
                <button class="confirm">Allow email notifications and create search alert</button>
            </div>
        </div>
    `;
    optInModalEl.classList.add('modal', 'optin-email-modal', 'hidden');

    optInModalEl.innerHTML = emailOptInModalStructure;

    return optInModalEl;
}

function emailOptInOverlay() {
    const optInOverlaylEl = document.createElement('div');
    optInOverlaylEl.classList.add('overlay');

    return optInOverlaylEl;
}

function buildResultsContainer(data) {
    // clear any previous results
    const block = document.querySelector('.adopt-search-results.block');
    const resultsContainer = document.querySelector('.default-content-wrapper.results');
    const sidebarElement = document.querySelector('.sidebar');
    if (resultsContainer) {
        resultsContainer.innerHTML = '';
    }

    // show pagination
    const pagination = document.querySelector('.pagination.hidden');
    pagination?.classList.remove('hidden');

    // temporarily inserting results into empty section on page
    let tempResultsContainer = document.getElementById('results-container');
    if (!tempResultsContainer) {
        tempResultsContainer = block.closest('.section').nextElementSibling;
        tempResultsContainer.id = 'results-container';
    }

    tempResultsContainer.classList.add('adopt-search-results');
    tempResultsContainer.classList.add('list');
    let tempResultsBlock = document.getElementById('results-block');
    if (!tempResultsBlock) {
        tempResultsBlock = tempResultsContainer.firstElementChild;
    }
    tempResultsBlock.classList.add('results');
    tempResultsBlock.innerHTML = '';
    tempResultsBlock.id = 'results-block';
    animalArray = data?.animal;

    // adding filter sidebar

    if (!sidebarElement) {
        const sidebar = document.createElement('div');
        sidebar.classList.add('sidebar');
        buildFilterSidebar(sidebar);
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        tempResultsContainer.prepend(overlay);
        tempResultsContainer.prepend(sidebar);
    }

    // add sorted label
    const sortLabel = document.querySelector('.sorted-label');
    if (!sortLabel) {
        const label = document.createElement('span');
        label.className = 'sorted-label';
        label.innerHTML = sortedLabel;
        tempResultsContainer.append(label);
    }

    // add mobile filter buttton
    const filterToggle = document.querySelector('.filter-button');
    if (!filterToggle) {
        const filterButton = document.createElement('button');
        filterButton.className = 'filter-button';
        filterButton.innerHTML = `<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_1990_3857)"><path d="M5.83008 12.4711H2.01074" stroke="#09090D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M23.4883 12.4711H10.7559" stroke="#09090D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M14.7441 20.5883H2.01074" stroke="#09090D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M23.4883 20.5883H19.6699" stroke="#09090D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M14.7441 4.49451H2.01074" stroke="#09090D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M23.4883 4.49451H19.6699" stroke="#09090D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M5.83008 12.4731C5.83008 12.7965 5.89379 13.1168 6.01756 13.4156C6.14134 13.7144 6.32276 13.986 6.55147 14.2147C6.78018 14.4434 7.0517 14.6248 7.35053 14.7486C7.64935 14.8724 7.96963 14.9361 8.29308 14.9361C8.61652 14.9361 8.9368 14.8724 9.23563 14.7486C9.53445 14.6248 9.80597 14.4434 10.0347 14.2147C10.2634 13.986 10.4448 13.7144 10.5686 13.4156C10.6924 13.1168 10.7561 12.7965 10.7561 12.4731C10.7561 12.1496 10.6924 11.8293 10.5686 11.5305C10.4448 11.2317 10.2634 10.9602 10.0347 10.7315C9.80597 10.5028 9.53445 10.3213 9.23563 10.1976C8.9368 10.0738 8.61652 10.0101 8.29308 10.0101C7.96963 10.0101 7.64935 10.0738 7.35053 10.1976C7.0517 10.3213 6.78018 10.5028 6.55147 10.7315C6.32276 10.9602 6.14134 11.2317 6.01756 11.5305C5.89379 11.8293 5.83008 12.1496 5.83008 12.4731Z" stroke="#09090D" stroke-width="1.5"/>
        <path d="M14.7439 20.5901C14.7439 21.2433 15.0034 21.8698 15.4653 22.3317C15.9272 22.7936 16.5537 23.0531 17.2069 23.0531C17.8601 23.0531 18.4866 22.7936 18.9485 22.3317C19.4104 21.8698 19.6699 21.2433 19.6699 20.5901C19.6699 19.9368 19.4104 19.3104 18.9485 18.8485C18.4866 18.3866 17.8601 18.1271 17.2069 18.1271C16.5537 18.1271 15.9272 18.3866 15.4653 18.8485C15.0034 19.3104 14.7439 19.9368 14.7439 20.5901Z" stroke="#09090D" stroke-width="1.5"/>
        <path d="M14.7439 4.35607C14.7439 5.00929 15.0034 5.63577 15.4653 6.09767C15.9272 6.55957 16.5537 6.81907 17.2069 6.81907C17.8601 6.81907 18.4866 6.55957 18.9485 6.09767C19.4104 5.63577 19.6699 5.00929 19.6699 4.35607C19.6699 3.70284 19.4104 3.07636 18.9485 2.61446C18.4866 2.15256 17.8601 1.89307 17.2069 1.89307C16.5537 1.89307 15.9272 2.15256 15.4653 2.61446C15.0034 3.07636 14.7439 3.70284 14.7439 4.35607Z" stroke="#09090D" stroke-width="1.5"/>
        </g><defs><clipPath id="clip0_1990_3857"><rect width="24" height="24" fill="white" transform="translate(0.75 0.471069)"/></clipPath></defs></svg>${filterCta}`;
        filterButton.addEventListener('click', openModal);
        tempResultsContainer.append(filterButton);
    }

    currentPage = 1;
    calculatePagination(1);
}

function populateSidebarFilters(params) {
    // Populate Sidebar filters
    const petRadius = document.getElementById('radius');
    const petRadiusOptions = petRadius?.options;
    if (petRadiusOptions) {
        for (let i = 0; i < petRadiusOptions.length; i += 1) {
            if (petRadiusOptions[i].value === params.get('milesRadius')) {
                petRadius.selectedIndex = i;
            }
        }
    }
    const genderRadios = document.querySelectorAll('input[name="gender"]');
    for (let i = 0; i < genderRadios.length; i += 1) {
        const genderArray = params.get('filterGender')?.split(',');
        genderArray?.forEach((gender) => {
            if (genderRadios[i].value.toLowerCase() === gender.toLowerCase()) {
                genderRadios[i].checked = true;
            }
        });
    }
    const ageRadios = document.querySelectorAll('input[name="age"]');
    for (let i = 0; i < ageRadios.length; i += 1) {
        const ageArray = params.get('filterAge')?.split(',');
        ageArray?.forEach((age) => {
            if (ageRadios[i].value.toLowerCase() === age.toLowerCase()) {
                ageRadios[i].checked = true;
            }
        });
    }
    const sizeRadios = document.querySelectorAll('input[name="size"]');
    for (let i = 0; i < sizeRadios.length; i += 1) {
        const sizeArray = params.get('filterSize')?.split(',');
        sizeArray?.forEach((size) => {
            if (sizeRadios[i].value.toLowerCase() === size.toLowerCase()) {
                sizeRadios[i].checked = true;
            }
        });
    }
    callAnimalList().then((resultData) => {
        if (resultData) {
            buildResultsContainer(resultData);
        callShelterList().then((data) => {
            // eslint-disable-next-line
            shelterList = data;
            updateShelterListSelect().then(() => {
                const shelterArray = params.get('filterShelter')?.split(',') || [];
                if (shelterArray.length > 0) {
                    shelterArray?.forEach((shelter) => {
                        const checkbox = document.getElementById(shelter);
                        if (checkbox) {
                            checkbox.checked = true;
                            // Create a new 'change' event
                            const event = new Event('change');
                            // Dispatch it.
                            checkbox.dispatchEvent(event);
                        }
                    });
                }
            });
        }).catch((error) => {
            // eslint-disable-next-line
            console.log(error);
        });
        }
    });
}

let hasEventSet = false;

export function openOptInModal(tokenInfo, initialUserData, event) {
    const modal = document.querySelector('.optin-email-modal');
    if (modal) {
        const confirmBtn = document.querySelector('.optin-email-modal .confirm');
        const cancelBtn = document.querySelector('.optin-email-modal .cancel');
        modal.classList.remove('hidden');
        const overlay = document.querySelector('.overlay');
        overlay.classList.add('show');
        if (!hasEventSet) {
            hasEventSet = true;

            confirmBtn.addEventListener('click', async () => {
                initialUserData.EmailOptIn = true;
                await callUserApi(tokenInfo, 'PUT', initialUserData);
                setSaveSearch(event);
                modal.classList.add('hidden');
                overlay.classList.remove('show');
            });

            cancelBtn.addEventListener('click', () => {
                modal.classList.add('hidden');
                overlay.classList.remove('show');
            });
        }
    }
}

export default async function decorate(block) {
    if (document.readyState === 'complete') {
        document.querySelector('body').append(emailOptInConfirmModal());
        document.querySelector('body').append(emailOptInOverlay());
    }

    const form = document.createElement('form');
    form.setAttribute('role', 'search');
    form.className = 'adopt-search-results-box-wrapper';
    form.action = ' ';
    form.addEventListener('submit', (ev) => {
        ev.preventDefault();

        const zipInput = document.getElementById('zip');
        const saveSearchButton = document.querySelector('.adopt-save-search-button');
        const errorSpan = document.getElementById('zip-error');
        const isValidZip = /^(\d{5}|[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d)$/.test(zipInput.value);
        if (isValidZip) {
        zipInput.classList.remove('error');
        errorSpan.classList.remove('active');
        saveSearchButton.disabled = false;
        zipInput.setAttribute('aria-describedby', '');
        zipInput.ariaInvalid = 'false';
            callAnimalList().then((data) => {
                if (data) {
                    buildResultsContainer(data);
                }
            });
        } else {
        zipInput.classList.add('error');
        errorSpan.classList.add('active');
        saveSearchButton.disabled = true;
        zipInput.setAttribute('aria-describedby', 'zip-error');
        zipInput.ariaInvalid = 'true';
        }
    });

    // Building Pet Type select element
    const petTypeContainer = document.createElement('div');
    const petTypeLabelElement = document.createElement('label');
    petTypeLabelElement.for = 'pet-type';
    petTypeLabelElement.innerText = petTypeLabel;

    const petTypeSelect = document.createElement('select');
    petTypeSelect.name = 'pet-type';
    petTypeSelect.id = 'pet-type';
    petTypeSelect.className = 'form-select-wrapper';
    const petOption = document.createElement('option');
    petOption.innerText = 'Any';
    petOption.value = null;

    petTypeSelect.append(petOption);
    const petTypes = petTypeValues.split(',');
        petTypes.forEach((petType) => {
            const petTypeOption = document.createElement('option');
            petTypeOption.innerText = petType;
            petTypeOption.value = petType;
            petTypeSelect.append(petTypeOption);
        });
    petTypeContainer.append(petTypeLabelElement);
    petTypeContainer.append(petTypeSelect);
    petTypeSelect.addEventListener('change', () => {
        callAnimalList().then((data) => {
            if (data) {
                // eslint-disable-next-line
                buildResultsContainer(data);
            }
        });
        callBreedList(petTypeSelect.value.toLowerCase()).then((data) => {
            breedList = data;
            const radioSize = document.querySelector('.radio-size');
            if (petTypeSelect.value.toLowerCase() === 'cat' || petTypeSelect.value.toLowerCase() === 'other') {
                radioSize?.classList.add('hidden');
            } else {
                radioSize?.classList.remove('hidden');
            }
            if (petTypeSelect.value.toLowerCase() === 'other' || petTypeSelect.value.toLowerCase() === 'null') {
                document.querySelector('#breed-button').setAttribute('disabled', '');
                document.querySelector('#breed-button').innerText = 'Any';
            } else {
                document.querySelector('#breed-button').removeAttribute('disabled', '');
                document.querySelector('#breed-button').innerText = 'Select from menu...';
            }
            updateBreedListSelect();
        });
    });

    // Building Breed List custom multi select element
    const breedContainer = document.createElement('div');
    breedContainer.className = 'box-wrapper-breed';
    const breedLabelElement = document.createElement('label');
    breedLabelElement.for = 'breed';
    breedLabelElement.innerText = breedLabel;
    breedLabelElement.setAttribute('for', 'breed');

    const containerDiv = document.createElement('div');
    containerDiv.className = 'multi-select breed';
    containerDiv.id = 'breed';
    containerDiv.append(breedLabelElement);

    const breedButton = document.createElement('button');
    breedButton.id = 'breed-button';
    breedButton.classList.add('multi-select__button');
    breedButton.type = 'button';
    breedButton.setAttribute('aria-expanded', 'false');
    breedButton.setAttribute('aria-controls', 'breeds');

    const multiSelectPlaceholder = document.createElement('span');
    multiSelectPlaceholder.className = 'multi-select__button-text';
    multiSelectPlaceholder.innerText = 'Select from menu...';

    const icon = document.createElement('span');
    icon.className = 'multi-select__button-icon';
    breedButton.append(multiSelectPlaceholder, icon);

    const groupDiv = document.createElement('div');
    groupDiv.setAttribute('role', 'group');
    groupDiv.setAttribute('aria-labelledby', 'breed-button');
    groupDiv.setAttribute('tabindex', '0');
    groupDiv.className = 'multi-select__options';
    groupDiv.id = 'breeds';

    containerDiv.append(breedButton, groupDiv);
    // eslint-disable-next-line
    new MultiSelect(containerDiv);

    breedContainer.append(containerDiv);

    const zipContainer = document.createElement('div');
    const zipLabelElem = document.createElement('label');
    zipLabelElem.setAttribute('for', 'zipCode');
    zipLabelElem.innerText = zipLabel;

    const errorSpan = document.createElement('span');
    errorSpan.className = 'error-message';
    errorSpan.id = 'zip-error';
    errorSpan.textContent = zipErrorMessage;

    const zipInput = document.createElement('input');
    zipInput.setAttribute('aria-label', zipPlaceholder);
    zipInput.className = 'zipCode';
    zipInput.type = 'text';
    zipInput.name = 'zipPostal';
    zipInput.id = 'zip';
    zipInput.title = zipErrorMessage;
    zipInput.placeholder = zipPlaceholder;
    zipInput.addEventListener('blur', () => {
        const saveSearchButton = document.querySelector('.adopt-save-search-button');
        const isValidZip = /^(\d{5}|[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d)$/.test(zipInput.value);
        if (isValidZip) {
        zipInput.classList.remove('error');
        errorSpan.classList.remove('active');
        saveSearchButton.disabled = false;
        zipInput.setAttribute('aria-describedby', '');
        zipInput.ariaInvalid = 'false';
            callAnimalList().then((data) => {
                if (data) {
                    buildResultsContainer(data);
                callShelterList().then((innerData) => {
                    // eslint-disable-next-line
                    shelterList = innerData;
                    clearShelterSelections();
                    updateShelterListSelect();
                });
                }
            });
        } else {
        zipInput.classList.add('error');
        errorSpan.classList.add('active');
        saveSearchButton.disabled = true;
        zipInput.setAttribute('aria-describedby', 'zip-error');
        zipInput.ariaInvalid = 'true';
        }
    });

    zipContainer.append(zipLabelElem);
    zipContainer.append(zipInput);
    zipContainer.append(errorSpan);

    const clearButton = document.createElement('button');
    clearButton.setAttribute('id', 'clearButton');
    clearButton.setAttribute('type', 'button');
    clearButton.innerHTML = '&#10005;';

    zipInput.addEventListener('input', () => {
        if (zipInput.value.trim() !== '') {
            clearButton.classList.add('show');
        } else {
            clearButton.classList.remove('show');
        }
    });

    zipInput.addEventListener('focus', () => {
        if (zipInput.value.trim() !== '') {
            clearButton.classList.add('show');
        }
    });
    zipInput.addEventListener('focusout', () => {
        clearButton.classList.remove('show');
    });

    clearButton.addEventListener('click', () => {
        zipInput.value = '';
        zipInput.focus();
        clearButton.classList.remove('show');
    });
    zipContainer.append(clearButton);
    //   form.append(clearButton);

    const button = document.createElement('button');
    button.type = 'submit';
    button.className = 'adopt-search-button';
    button.textContent = searchAlertText;

    const saveButton = document.createElement('button');
    saveButton.className = 'adopt-save-search-button';
    saveButton.innerHTML = `<svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_1997_2586)"><path d="M10 22.221C10.127 22.6537 10.3908 23.0336 10.7518 23.3039C11.1127 23.5741 11.5516 23.7202 12.0025 23.7202C12.4534 23.7202 12.8923 23.5741 13.2532 23.3039C13.6142 23.0336 13.878 22.6537 14.005 22.221" stroke="#09090D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 3.47104V1.22104" stroke="#09090D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 3.47104C13.9891 3.47104 15.8968 4.26122 17.3033 5.66774C18.7098 7.07426 19.5 8.98192 19.5 10.971C19.5 18.017 21 19.221 21 19.221H3C3 19.221 4.5 17.305 4.5 10.971C4.5 8.98192 5.29018 7.07426 6.6967 5.66774C8.10322 4.26122 10.0109 3.47104 12 3.47104Z" stroke="#09090D" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></g><defs>
        <clipPath id="clip0_1997_2586"><rect width="24" height="24" fill="white" transform="translate(0 0.471039)"/></clipPath></defs></svg>
        ${createSearchAlert}`;
    saveButton.disabled = true;
    saveButton.addEventListener('click', async (event) => {
        event.preventDefault();
        let initialUserData = {};
        isLoggedIn().then(async (isLoggedInParam) => {
            if (isLoggedInParam) {
                const token = await acquireToken();
                if (token) {
                    initialUserData = await callUserApi(token);
                    if (initialUserData.EmailOptIn) {
                        setSaveSearch(event);
                    } else {
                        openOptInModal(token, initialUserData, event);
                    }
                }
            } else {
                // eslint-disable-next-line no-lonely-if
                if (isMobile()) {
                    localStorage.setItem('featureName2', 'openSavedSearchesPopUp');
                    const token = await acquireToken();
                    initRedirectHandlers(token, event);
                } else {
                    acquireToken('Save Search').then(async (token) => {
                        initialUserData = await callUserApi(token);
                        if (initialUserData.EmailOptIn) {
                            setSaveSearch(event);
                        } else {
                            // eslint-disable-next-line
                            const token = await acquireToken();
                            initialUserData = await callUserApi(token);
                            openOptInModal(token, initialUserData, event);
                        }
                    });
                }
            }
        });
    });
    form.append(petTypeContainer);

    form.append(breedContainer);

    form.append(zipContainer);
    form.append(button);
    form.append(saveButton);

    const heroContainer = document.querySelector('.columns.hero');

    if (heroContainer?.firstElementChild?.lastElementChild != null) {
        const formWrapper = document.createElement('div');
        formWrapper.className = 'adopt-search-results-wrapper';
        formWrapper.append(form);
        block.innerHTML = '';

        heroContainer.firstElementChild.lastElementChild.append(formWrapper);
    } else {
        block.innerHTML = '';
        block.append(form);
    }

    //   const usp = new URLSearchParams(window.location.search);
    //   block.querySelector('.search-input').value = usp.get('q') || '';
    window.onload = callBreedList('null').then((data) => {
        breedList = data;
        updateBreedListSelect();
        const tempResultsContainer = document.querySelector('.section.adopt-search-results-container')?.closest('.section').nextElementSibling;
        const div = document.createElement('div');
        div.className = 'pagination hidden';

        // add pagination
        const previousButton = document.createElement('button');
        previousButton.id = ('btn_prev');
        previousButton.addEventListener('click', prevPage);
        previousButton.innerText = '<';
        const nextButton = document.createElement('button');
        nextButton.id = ('btn_next');
        nextButton.addEventListener('click', nextPage);
        nextButton.innerText = '>';
        div.append(previousButton);
        const paginationNumbers = document.createElement('div');
        paginationNumbers.className = 'pagination-numbers';
        div.append(paginationNumbers);
        div.append(nextButton);
        tempResultsContainer?.append(div);

        // When the page loads, check if there are any query parameters in the URL
        const params = new URLSearchParams(window.location.search);

        // If there are, select the corresponding filters - Top filters first
        if (params.has('zipPostal') && params.get('zipPostal') !== '') {
            const petZip = document.getElementById('zip');
            petZip.value = params.get('zipPostal');
            const saveSearchButton = document.querySelector('.adopt-save-search-button');
            saveSearchButton.disabled = false;
            const petType = document.getElementById('pet-type');
            const petTypeParam = String(params.get('filterAnimalType'));
            const petTypesOptions = petType.options;
            for (let i = 0; i < petTypesOptions.length; i += 1) {
                if (petTypesOptions[i].value.toLowerCase() === petTypeParam.toLowerCase()) {
                    petType.selectedIndex = i;
                }
            }
            const breedSelect = document.getElementById('breed-button');
            const petBreed = document.querySelector('#breeds');
            const paramsSelected = params.get('filterBreed');
            callBreedList(petType?.value).then((outputData) => {
                breedList = outputData;
                updateBreedListSelect().then(() => {
                    const inputs = petBreed.querySelectorAll('input');
                    inputs.forEach((input) => {
                        if (paramsSelected?.toLowerCase().includes(input.value.toLowerCase()) && input.value !== '') {
                            selectedBreeds.push(input.value);
                            input.checked = true;
                        }
                    });

                    let displayText = 'Select from menu...';
                    if (selectedBreeds.length > 0) {
                        displayText = `${selectedBreeds.length} selected`;
                    } else if (petType?.value === 'null' || petType?.value === 'Other') {
                        displayText = 'Any';
                    }

                    breedSelect.innerText = displayText;
                    callAnimalList().then((initialData) => {
                        if (initialData) {
                            buildResultsContainer(initialData);
                            populateSidebarFilters(params);
                        }
                    });
                });
            });

            let resultsContainer = document.querySelector('.default-content-wrapper.results');
            if (!resultsContainer) {
                resultsContainer = document.querySelector('.default-content-wrapper');
            }
            const paginationBlock = document.querySelector('.pagination');
            paginationBlock.classList.add('hide');
            resultsContainer.innerHTML = noResultsContent;
        }
        // check if hash exists and if so save the search
        // eslint-disable-next-line
        const hash = getHashFromURL();
        setTimeout(() => {
            // eslint-disable-next-line
            if (hash === 'saveSearch') {
                saveButton.click();
            }
        }, '1000');
    });
}
function getHashFromURL() {
    const hashIndex = window.location.href.indexOf('#');
    if (hashIndex !== -1) {
        return window.location.href.substring(hashIndex + 1);
    }

    return ''; // Return an empty string if there's no hash
}
