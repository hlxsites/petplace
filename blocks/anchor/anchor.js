export default function decorate(block) {

  function appendItems(items, container) {
    items.forEach((item) => {
      const newAnchor = document.createElement('a');
      newAnchor.href = `#${item.id}`;
      newAnchor.innerText = item.innerText;
      container.appendChild(newAnchor);
    });
    block.appendChild(container);
  }

  const newDiv = document.createElement('div');
  newDiv.classList.add('anchor-list');

  const currentPage = document.body;

  if (currentPage.classList.contains('traveling-page')) {
    const cities = document.querySelectorAll('.city > children');
    block.innerHTML = '';
    appendItems(cities, newDiv);
  } else {
    const selector = block.querySelector('.anchor>div>div').textContent();
    const elements = document.querySelectorAll(selector);
    block.innerHTML = '';
    appendItems(elements, newDiv);
  }
}
