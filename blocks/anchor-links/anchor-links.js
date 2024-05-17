export default async function decorate(block) {
  // Create list of anchor links
  const sectionList = document.querySelectorAll('[data-anchor-title]');

  if (!sectionList.length) {
    block.classList.add('hidden');
    return;
  }

  const anchorLinks = Array(...sectionList).map((section) => {
    const heading = section.querySelector('[id]');
    const anchor = heading ? heading.id : '';
    const anchorTitle = section.getAttribute('data-anchor-title');

    return `<li><a href="#${anchor}">${anchorTitle}</></li>`;
  });

  const linkList = document.createElement('ul');
  linkList.innerHTML = anchorLinks;
  block.append(linkList);
}
