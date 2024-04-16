export default function decorate(block) {
  const cols = [...block.firstElementChild.children];

  // eslint-disable-next-line no-unused-vars
  let rowIndex = 0;

  // setup image columns
  [...block.children].forEach((row) => {
    row.classList.add('panel-card');
    [...row.children].forEach((col) => {
      const pic = col.querySelector('picture');
      if (pic) {
        const picWrapper = pic.closest('div');
        if (picWrapper && picWrapper.children.length === 1) {
          picWrapper.classList.add('panel-card-img');
        }
      } else {
        const txtWrapper = col.closest('div');
        if (txtWrapper) {
          txtWrapper.classList.add('panel-card-txt');
        }
      }
    });
    rowIndex += 1;
  });
}
