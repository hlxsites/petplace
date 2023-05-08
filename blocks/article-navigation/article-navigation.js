export default function decorate(block) {
  const container = document.createElement('div');
  container.innerText = 'article-navigation placeholder';
  block.append(container);
}
