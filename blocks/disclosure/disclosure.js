export default async function decorate(block) {
  const fragment = block.textContent.trim();
  const response = await fetch(fragment || '/fragments/disclosure.plain.html');
  if (!response.ok) {
    return;
  }
  block.innerHTML = await response.text();
}
