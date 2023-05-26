export default async function decorate(block) {
  const resp = await fetch('/categories.json');
  if (!resp.ok) {
    block.remove();
    return;
  }

  const categories = await resp.json();
  const childCategories = categories.data.filter((c) => c['Parent Path'] === window.location.pathname);
  if (!childCategories.length) {
    block.remove();
    return;
  }

  block.innerHTML = '';

  const heading = document.createElement('h2');
  heading.textContent = 'Sub categories';
  block.append(heading);
  childCategories.forEach((c) => {
    const hasDescendants = categories.data.find((d) => d['Parent Path'] === c.Path);
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
