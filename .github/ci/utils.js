import fetch from 'node-fetch';

const limit = 1000;

export async function fetchArticles(locale = 'en-US') {
  let offset = 0;
  const allPosts = [];

  const root = locale === 'en-US' ? '' : `/${locale.toLowerCase()}`;

  while (true) {
    const api = new URL(`https://www.petplace.com${root}/article/query-index.json?sheet=article`);
    api.searchParams.append('offset', JSON.stringify(offset));
    api.searchParams.append('limit', limit);
    const response = await fetch(api);
    const result = await response.json();

    allPosts.push(...result.data);

    if (result.offset + result.limit < result.total) {
      // there are more pages
      offset = result.offset + result.limit;
    } else {
      break;
    }
  }
  return allPosts;
}

export function getLocaleForUrl(urlString) {
  const [, lang = 'en', region = 'US'] = new URL(urlString, 'https://www.petplace.com').pathname.split('/')[1].match(/^(\w{2})-(\w{2})$/i) || [];
  return `${lang.toLowerCase()}-${region.toUpperCase()}`;
}
