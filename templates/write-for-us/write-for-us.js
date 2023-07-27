function addSVGClickListener(main) {
  const heroWrapper = main.querySelector('.hero-wrapper');
  const formSection = main.querySelector('.form-container');

  if (heroWrapper && formSection) {
    heroWrapper.addEventListener('click', (event) => {
    // Only trigger if the click was in the lower half of the element
    // This is to approximate a click on the SVG
      if (event.offsetY > heroWrapper.offsetHeight / 1.1) {
        formSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
}

// eslint-disable-next-line import/prefer-default-export
export function loadLazy(main) {
  // Select the h1 and the text from default content wrapper,
  // wrap them as a new hero-container for stylying purposes
  const hero = document.createElement('div');
  const imgDiv = document.createElement('div');
  const textDiv = document.createElement('div');

  const defaultContentWrapper = main.querySelector('.default-content-wrapper');
  const heroImgWrapper = main.querySelector('.hero-wrapper');

  defaultContentWrapper.parentElement.classList.add('hero-container');

  hero.className = 'hero-wrapper';
  imgDiv.className = 'img-div';
  textDiv.className = 'text-div';

  const heroImg = heroImgWrapper.querySelector('picture');
  imgDiv.append(heroImg.cloneNode(true));
  hero.append(imgDiv);

  textDiv.append(main.querySelector('h1'));

  defaultContentWrapper.querySelectorAll('p').forEach((el) => {
    if (el.innerText.trim() !== '') {
      textDiv.append(el.cloneNode(true));
    }
  });
  hero.append(textDiv);
  defaultContentWrapper.replaceWith(hero);
  const heroContainer = main.querySelector('.hero-container');
  if (heroContainer) {
    heroContainer.remove();
  }

  addSVGClickListener(main);
}
