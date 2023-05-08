export default function decorate(block) {
  const container = document.createElement('div');
  container.innerText = 'paws-up placeholder';
  block.append(container);
}
