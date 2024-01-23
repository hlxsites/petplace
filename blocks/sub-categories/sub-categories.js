import { fetchPlaceholders } from '../../scripts/lib-franklin.js';
import { getCategories } from '../../scripts/scripts.js';

export function render(block, categories, placeholders) {
  block.innerHTML = '';

  const childCategories = categories.filter((c) => c['Parent Path'] === window.location.pathname);
  if (!childCategories.length) {
    block.style.display = 'none';
    return;
  }
  block.style.display = '';

  const heading = document.createElement('h2');
  heading.textContent = placeholders.subCategories;
  block.append(heading);
  childCategories.forEach((c) => {
    const hasDescendants = categories.find((d) => d['Parent Path'] === c.Path);
    const p = document.createElement('p');
    const link = document.createElement('a');
    if (hasDescendants) {
      link.classList.add('has-children');
    }
    link.textContent = c.Category;
    link.href = c.Path;
    link.style.backgroundColor = `var(--color-${c.Color || 'purple'})`;
    p.append(link);
    block.append(p);
  });
}

export default async function decorate(block) {
  const categories = await getCategories();
  const placeholders = await fetchPlaceholders();
  render(block, categories, placeholders);
}
