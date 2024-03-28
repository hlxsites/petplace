// eslint-disable-next-line no-undef
importScripts('/scripts/worker/elasticlunr.js');

const index = (async (global) => {
  const locale = new URLSearchParams(this.location.search).get('locale') || 'en-US';
  const resp = await fetch(`/search-index${locale && locale !== 'en-US' ? `.${locale.toLowerCase()}` : ''}.db`);
  if (!resp.ok) {
    // eslint-disable-next-line no-console
    console.error('Failed to load search index', resp.url, resp.status);
  }
  return global.elasticlunr.Index.load(await resp.json());
})(this);

onmessage = async (e) => {
  const results = (await index).search(e.data.query, { bool: e.data.operator || 'AND' }).map((result) => result.doc);
  postMessage(results);
};
