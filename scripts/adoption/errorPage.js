export default function errorPage() {
  const errorWrapper = document.createElement('div');
  errorWrapper.classList.add('error-page');

  const errorIcon = document.createElement('div');
  errorIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80" fill="none">
      <g clip-path="url(#clip0_4715_6749)">
        <path d="M40 57.5C39.3097 57.5 38.75 56.9403 38.75 56.25C38.75 55.5597 39.3097 55 40 55" stroke="black" stroke-width="4"/>
        <path d="M40 57.5C40.6903 57.5 41.25 56.9403 41.25 56.25C41.25 55.5597 40.6903 55 40 55" stroke="black" stroke-width="4"/>
        <path d="M40 45V20" stroke="black" stroke-width="4" stroke-miterlimit="10" stroke-linecap="round"/>
        <path d="M4.2665 44.27C3.13535 43.1373 2.5 41.6023 2.5 40.0017C2.5 38.401 3.13535 36.8657 4.2665 35.7333L35.733 4.26994C36.293 3.70877 36.958 3.26353 37.69 2.95975C38.4223 2.65597 39.207 2.4996 39.9997 2.4996C40.7923 2.4996 41.5773 2.65597 42.3097 2.95975C43.0417 3.26353 43.7067 3.70877 44.2663 4.26994L75.733 35.7333C76.8643 36.8657 77.4997 38.401 77.4997 40.0017C77.4997 41.6023 76.8643 43.1373 75.733 44.27L44.2663 75.7333C43.1347 76.8643 41.6 77.4993 39.9997 77.4993C38.3997 77.4993 36.865 76.8643 35.733 75.7333L4.2665 44.27Z" stroke="black" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
      <defs>
        <clipPath id="clip0_4715_6749">
          <rect width="80" height="80" fill="white"/>
        </clipPath>
      </defs>
    </svg>`;

  const errorTitle = document.createElement('h1');
  errorTitle.innerText = 'Oops! Something went wrong.';

  const errorDescription = document.createElement('p');
  errorDescription.classList.add('error-description');
  errorDescription.innerText = `The page you requested could not be loaded.
    Please refresh the page or try again later.`;

  const homeBtn = document.createElement('a');
  homeBtn.setAttribute('href', '/');
  homeBtn.innerText = 'Back Home';
  homeBtn.classList.add('home-btn');

  const reloadBtn = document.createElement('button');
  reloadBtn.innerText = 'Reload Page';
  reloadBtn.classList.add('reload-btn');
  reloadBtn.addEventListener('click', (e) => {
    e.preventDefault();

    window.location.reload();
  });

  const actionBtns = document.createElement('div');
  actionBtns.classList.add('action-btns');
  actionBtns.append(homeBtn);
  actionBtns.append(reloadBtn);

  errorWrapper.append(errorIcon.children[0]);
  errorWrapper.append(errorTitle);
  errorWrapper.append(errorDescription);
  errorWrapper.append(actionBtns);

  document.querySelector('#main').innerHTML = '';
  document.querySelector('#main').append(errorWrapper);
}
