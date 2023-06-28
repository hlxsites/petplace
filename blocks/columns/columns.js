export default function decorate(block) {
  const cols = [...block.firstElementChild.children];
  block.classList.add(`columns-${cols.length}-cols`);

  let rowIndex = 0;
  const cityPrefix = ['city-header', 'city-middle', 'city-footer'];
  const isCityBlock = block.classList.contains('city');

  // setup image columns
  [...block.children].forEach((row) => {
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('columns-img-col');
          if (isCityBlock) {
            picWrapper.classList.add(`${cityPrefix[rowIndex]}-img`);
          }

          const img = pic.querySelector('img');
          const width = img.getAttribute('width');
          const height = img.getAttribute('height');
          if (width / height > 1.9) {
            picWrapper.classList.add('vertical');
          } else {
            picWrapper.classList.add('horizontal');
          }
        }
      } else {
        const txtWrapper = col.closest('div');
        if (txtWrapper) {
          txtWrapper.classList.add('columns-txt-col');
          if (isCityBlock) {
            txtWrapper.classList.add(`${cityPrefix[rowIndex]}-txt`);
          }
        }
      }
    });
    rowIndex += 1;
  });
}
