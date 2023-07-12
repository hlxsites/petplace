export default async function decorate(block) {
  if (block.textContent.trim()) {
    return;
  }

  const response = await fetch('/fragments/disclosure.plain.html');
  if (!response.ok) {
    return;
  }
  block.innerHTML = await response.text();
}
