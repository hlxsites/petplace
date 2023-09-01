// eslint-disable-next-line no-undef
importScripts('/scripts/worker/elasticlunr.js');

const index = (async (global) => {
  const resp = await fetch('/search-index.json');
  if (!resp.ok) {
    // eslint-disable-next-line no-console
    console.error('Failed to load search index', resp.status);
  }
  return global.elasticlunr.Index.load(await resp.json());
})(this);

onmessage = async (e) => {
  const results = (await index).search(e.data.query, { bool: e.data.operator || 'AND' }).map((result) => result.doc);
  postMessage(results);
};
