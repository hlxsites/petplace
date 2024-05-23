function buildCell(rowIndex) {
  const cell = rowIndex ? document.createElement('td') : document.createElement('th');
  if (!rowIndex) cell.setAttribute('scope', 'col');
  return cell;
}

export default function decorate(block) {
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  const header = !block.classList.contains('no-header');
  if (header) {
    table.append(thead);
  }
  table.append(tbody);

  [...block.children].forEach((child, i) => {
    const row = document.createElement('tr');
    if (header && i === 0) thead.append(row);
    else tbody.append(row);
    [...child.children].forEach((col) => {
      const cell = buildCell(header ? i : i + 1);
      cell.innerHTML = col.innerHTML;
      row.append(cell);
    });
  });
  block.innerHTML = '';
  block.append(table);

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
    thead.append(firstRow);
    table.insertBefore(thead, table.querySelector('tbody'));
  }
}
