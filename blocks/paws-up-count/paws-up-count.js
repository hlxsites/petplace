export default function decorate(block) {
  const container = document.createElement('div');
  container.innerText = 'paws-up-count placeholder';
  block.append(container);

}
