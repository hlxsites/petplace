export default function decorate(block) {
  [...block.children].forEach((row) => {
    [...row.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) {
        div.className = 'blade-image';
      } else {
        div.className = 'blade-body';
      }
    });
  });
}
