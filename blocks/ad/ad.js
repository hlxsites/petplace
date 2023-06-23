/**
 *
 * @param {HTMLElement} block Ad block to decorate.
 */
export default function decorate(block) {
  if (!block.id) {
    block.id = `ad-${Math.random().toString(32).substring(2)}`;
  }
  [...block.children].forEach((row, index) => {
    if (index === 0) {
      block.dataset.adid = String(row.innerText).trim();
    }
    row.remove();
  });
  const skeleton = document.createElement('div');
  skeleton.classList.add('skeleton');
  block.append(skeleton);
}
