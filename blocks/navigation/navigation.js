export default function decorate(block) {
  const container = document.createElement('div');
  container.innerText = 'navigation placeholder';
  block.append(container);
}
