export default function decorate(block) {
  const newDiv = document.createElement('div');
  newDiv.classList.add('anchor-list');

  const currentPage = document.body;
  if (currentPage.classList.contains('traveling-page')) {
    const citiesNames = document.querySelectorAll('.city h3');
    appendItems(citiesNames, newDiv);
  } else {
    const selector = block.querySelector('.anchor>div>div').textContent();
    const elements = document.querySelectorAll(selector);
    block.appendChild(newDiv);
  }
  block.innerHTML = '';
  block.appendChild(newDiv);
}

function appendItems(items, container) {
  items.forEach((item) => {
    const newAnchor = document.createElement('a');
    newAnchor.href = `#${item.id}`;
    newAnchor.innerText = item.innerText;
    container.appendChild(newAnchor);
  });
}
