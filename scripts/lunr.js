import ffetch from './ffetch.js';

let idx = null;

async function getArticles() {
  return ffetch('/article/query-index.json')
    .sheet('article')
    .withTotal(true);
}

async function createLunrIndex() {
  const articles = await getArticles();
  const res = [];
  // eslint-disable-next-line no-restricted-syntax
  for await (const article of articles) {
    res.push(article);
  }
  // eslint-disable-next-line no-undef
  idx = lunr(function create() {
    this.field('author');
    this.field('category');
    this.field('category name');
    this.field('category slug');
    this.field('date');
    this.field('description');
    this.field('imageAlt');
    this.ref('path');
    this.field('tags');
    this.field('title');
    this.field('type');

    res.forEach((article) => this.add(article));
  });
  return idx;
}

export default async function lunrSearchArticlePaths(query) {
  if (idx === null) {
    await createLunrIndex();
  }
  return new Set(idx.search(query).map(({ ref }) => ref));
}
