export async function loadEager(document) {
  const cardDiv = document.querySelectorAll('.display-cards div > div');
  cardDiv.forEach((card) => {
    card.className = 'about-card-box';
    const cardTitle = card.querySelector('h3');
    const cardDesc = card.querySelector('h5');

    const titleDiv = document.createElement('div');
    titleDiv.append(cardTitle);
    titleDiv.append(cardDesc);
    card.appendChild(titleDiv);
  });
}
