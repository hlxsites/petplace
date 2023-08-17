export async function getLunrIdx() {
  return fetch('/search-index.json').then((res) => res.json()).then((json) => lunr.Index.load(json));
}

export function lunrSearchArticlePaths(idx, query) {
  return new Set(idx.search(query).map(({ ref }) => ref));
}
