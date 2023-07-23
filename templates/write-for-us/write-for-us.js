export async function loadEager() {
  return false;
}

export async function loadLazy(main) {
  // create the hero, imgDiv, and textDiv elements
  const hero = document.createElement('div');
  const imgDiv = document.createElement('div');
  const textDiv = document.createElement('div');

  // select defaultContentWrapper and heroimg
  const defaultContentWrapper = main.querySelector('.default-content-wrapper');
  const heroimg = main.querySelector('.hero-wrapper');

  // add hero-container class to defaultContentWrapper's parent
  defaultContentWrapper.parentElement.classList.add('hero-container');

  // add classes to new elements
  hero.className = 'hero-wrapper';
  imgDiv.className = 'img-div';
  textDiv.className = 'text-div';

  // append all pictures from heroimg to imgDiv
  [...heroimg.querySelectorAll('picture')].forEach((el) => {
    imgDiv.append(el.cloneNode(true));
  });

  // append imgDiv to hero
  hero.append(imgDiv);

  // append first h1 element to textDiv
  textDiv.append(main.querySelector('h1'));

  // append all non-empty p elements from defaultContentWrapper to textDiv
  [...defaultContentWrapper.querySelectorAll('p')].forEach((el) => {
    if (el.innerText.trim() !== '') {
      textDiv.append(el.cloneNode(true));
    }
  });

  // append textDiv to hero
  hero.append(textDiv);

  // replace defaultContentWrapper with hero
  defaultContentWrapper.replaceWith(hero);

  // remove old hero-container
  const heroContainer = main.querySelector('.hero-container');
  if (heroContainer) {
    heroContainer.remove();
  }
}
