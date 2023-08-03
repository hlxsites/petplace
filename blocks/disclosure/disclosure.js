export default async function decorate(block) {
  let content = block.textContent.trim();
  if (!content) {
    // if no content in the block, default to the disclosure fragment
    content = '/fragments/disclosure.plain.html';
  }
  if (String(content).startsWith('/')) {
    // if the content is a URL, retrieve it and use the response text
    // as the block's content
    const response = await fetch(content);
    if (!response.ok) {
      return;
    }
    block.innerHTML = await response.text();
    return;
  }

  // if the block content isn't empty and isn't a URL, it will be used
  // as-is
  block.innerHTML = `<p>${content}</p>`;
}
