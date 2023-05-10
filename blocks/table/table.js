export default function decorate(block) {
  const table = block.querySelector('table');
  const p = block.querySelector('table + p');
  if (p) {
    const caption = document.createElement('caption');
    caption.innerHTML = p.innerHTML;
    table.prepend(caption);
    p.remove();
  }

  const firstRow = table.querySelector(':scope tr:first-child');
  const isHeaderRow = [...firstRow.children].every((td) => {
    const child = td.firstElementChild;
    return child.nodeName === 'STRONG' && td.textContent === child.textContent;
  });
  if (isHeaderRow) {
    [...firstRow.children].forEach((td) => {
      const th = document.createElement('th');
      th.innerHTML = td.firstElementChild.innerHTML;
      if (td.getAttribute('colspan')) {
        th.setAttribute('colspan', td.getAttribute('colspan'));
      }
      if (td.getAttribute('rowspan')) {
        th.setAttribute('rowspan', td.getAttribute('rowspan'));
      }
      td.replaceWith(th);
    });
    const thead = document.createElement('thead');
    thead.append(firstRow);
    table.insertBefore(thead, table.querySelector('tbody'));
  }
}
