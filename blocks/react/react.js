export default async function decorate(block) {
  block.id = 'react-root';
  block.innerHTML = '';

  import('./react-index.js');
}
