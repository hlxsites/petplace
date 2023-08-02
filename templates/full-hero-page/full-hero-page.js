// eslint-disable-next-line import/prefer-default-export
export function loadLazy() {
  const heading = document.querySelector('.full-hero-page main .hero h1');
  const paragraphs = document.querySelectorAll('.full-hero-page main .section:not(.hero-container) p');

  let subtext;
  for (let i = 0; i < paragraphs.length; i += 1) {
    if (String(paragraphs[i].innerText).trim()) {
      subtext = paragraphs[i];
      break;
    }
  }

  heading.classList.add('full-hero-page-heading');
  subtext.classList.add('full-hero-page-subtext');

  const heroText = document.createElement('div');
  heroText.classList.add('full-hero-page-text');
  heroText.append(heading, subtext);

  document.querySelector('.full-hero-page main .hero-wrapper').append(heroText);
}
