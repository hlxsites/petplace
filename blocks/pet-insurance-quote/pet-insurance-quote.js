export default function decorate(block) {
  const container = document.createElement('div');
  container.innerText = 'pet-insurance-quote placeholder';
  block.append(container);
}
