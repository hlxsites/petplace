export async function loadEager(document) {
  const cardDiv = document.querySelectorAll('.pet-display div > div');
  cardDiv.forEach((card) => {
    card.className = 'pet-card-box';
    const cardTitleName = card.querySelector('h2');
    const cardTitleLoc = card.querySelector('h4');
    const cardDesc = card.querySelectorAll('p');

    const bannerDiv = document.createElement('div');
    bannerDiv.className = 'pet-card-banner-div';

    const titleDiv = document.createElement('div');
    titleDiv.className = 'pet-card-title';
    titleDiv.append(cardTitleName);
    titleDiv.append(cardTitleLoc);
    bannerDiv.appendChild(titleDiv);

    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'pet-card-details';
    cardDesc.forEach((desc, index) => {
      if (index !== 0) {
        detailsDiv.appendChild(desc);
      }
    });

    const learnMore = card.querySelector('h3');
    const linkArrow = document.createElement('p');
    learnMore.append(linkArrow);

    card.addEventListener('click', () => {
      window.open(learnMore.querySelector('a').href, '_blank');
    });

    card.append(bannerDiv);
    card.append(detailsDiv);
    card.append(learnMore);
  });
}
