export default function decorate() {
  const article = document.body.querySelector('main .section:not(.hero-container):not(.article-template-autoblock)');
  if (!article) {
    return;
  }

  const footerDiv = document.createElement('div');
  footerDiv.classList.add('article-footer');
  footerDiv.innerText = '[Article Footer (Insurance Ad, Paw Count) placeholder]';
  article.appendChild(footerDiv);
}
