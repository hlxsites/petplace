export default function decorate(block) {
  const container = document.createElement('div');
  container.innerText = 'article-author placeholder';
  block.append(container);
}
