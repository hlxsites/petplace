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

    const linkBtn = document.createElement('a');
    linkBtn.href = 'https://www.instagram.com/petplace/';
    bannerDiv.appendChild(linkBtn);

    const detailsDiv = document.createElement('div');
    detailsDiv.className = 'pet-card-details';
    cardDesc.forEach((desc, index) => {
      if (index !== 0) {
        detailsDiv.appendChild(desc);
      }
    });

    card.append(bannerDiv);
    card.append(detailsDiv);
  });
}
