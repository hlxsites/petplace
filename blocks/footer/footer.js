import { readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  // fetch footer content
  const footerPath = cfg.footer || '/footer';
  const resp = await fetch(`${footerPath}.plain.html`, window.location.pathname.endsWith('/footer') ? { cache: 'reload' } : {});

  if (resp.ok) {
    const html = await resp.text();

    // decorate footer DOM
    const footer = document.createElement('div');
    footer.innerHTML = html;

    decorateIcons(footer);

    const sections = ['nav', 'legal'];
    [...footer.children].forEach((child, i) => {
      const container = document.createElement('div');
      container.classList.add(sections[i] ? `footer-${sections[i]}` : '');
      container.append(child);
      decorateIcons(container);
      block.append(container);
    });

    block.querySelector('.footer-nav ul:first-of-type').classList.add('footer-social');

    const nav = document.createElement('nav');
    nav.setAttribute('aria-label', 'Footer Navigation');
    const links = block.querySelector('.footer-nav ul ~ ul');
    links.replaceWith(nav);
    nav.append(links);
  }
}
