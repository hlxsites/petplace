export default async function decorate(block) {
  block.setAttribute('data-block-name', 'attributes');
  block.setAttribute('data-block-status', 'loaded');
  const col1 = document.createElement('div');
  const col2 = document.createElement('div');
  col1.className = 'col col1';
  col2.className = 'col col2';

  [...block.children].forEach((child, i) => {
    child.setAttribute('tabindex', '0');
    const label = child.children[0].textContent;
    const activeCount = Number(child.children[1].textContent);
    const meterLength = 4;
    const meter = document.createElement('div');
    meter.className = 'meter';
    meter.setAttribute('role', 'meter');
    meter.setAttribute('aria-valuemin', '0');
    meter.setAttribute('aria-valuemax', '5');
    meter.setAttribute('aria-valuenow', activeCount.toString());
    meter.setAttribute('aria-label', `${label} : ${activeCount} out of 5`);

    for (let j = 0; j <= meterLength; j += 1) {
      const span = document.createElement('span');

      if (j < activeCount) {
        span.classList.add('active');
      }

      meter.append(span);
    }

    child.children[1].innerHTML = '';
    child.children[1].append(meter);

    if (i < 5) {
      col1.append(child);
    } else {
      col2.append(child);
    }
  });

  block.innerHTML = '';
  block.append(col1);
  block.append(col2);
}
