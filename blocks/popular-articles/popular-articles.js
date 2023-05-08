export default function decorate(block) {
  const container = document.createElement('div');
  container.innerText = 'popular-articles placeholder';
  block.append(container);
}
