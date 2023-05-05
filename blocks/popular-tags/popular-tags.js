export default async function decorate(block) {
  const resp = await fetch('/tags/popular-tags.plain.html');
  if (!resp.ok) {
    block.remove();
    return;
  }

  const hmtl = await resp.text();
  block.innerHTML = hmtl;
}
