import { Feed } from 'feed';
import fs from 'fs';

const targetDirectory = process.argv[2];
const limit = 1000;

function sanitize(str) {
  return str
    .replaceAll('&amp;', '&#x26;')
    .replaceAll('&', '&#x26;')
    .replaceAll('&amp;#x26;', '&#x26;')
    .replaceAll('<', '&#x3C;')
    .replaceAll('\x91', '&#x27;') // single quote (opening)
    .replaceAll('\x92', '&#x27;') // single quote (closing)
    .replaceAll('\x93', '&#x22;') // double quote (opening)
    .replaceAll('\x94', '&#x22;') // double quote (closing)
    .replaceAll('\x96', '&#x2013;') // ndash
    .replaceAll('\x97', '&#x2014;') // mdash
    .replaceAll('\x98', '&#x7e;') // tilda symbole
    .replaceAll('\x99', '&#x2122;'); // TM symbol
}

async function fetchArticles() {
  let offset = 0;
  const allPosts = [];

  while (true) {
    const api = new URL('https://www.petplace.com/article/query-index.json?sheet=article');
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

async function main() {
  const articles = await fetchArticles();
  const newestPost = Math.max(...articles.map((article) => article.date));
  const feed = new Feed({
    title: `PetPlace.com articles`,
    id: 'https://www.petplace.com/',
    link: 'https://www.petplace.com/',
    updated: new Date(newestPost * 1000),
    generator: 'News feed generator (GitHub action)',
    language: 'en',
    copyright: `All rights reserved ${new Date().getFullYear()},  Independence America Holdings Corp.`,
    feedLinks: {
      atom: 'https://www.petplace.com/atom.xml',
      rss: 'https://www.petplace.com/rss.xml'
    },
  });

  articles.forEach((article) => {
    feed.addItem({
      id: `https://www.petplace.com${article.path}`,
      title: sanitize(article.title),
      description: sanitize(article.description),
      link: `https://www.petplace.com${article.path}`,
      author: article.author
        ? [{ name: article.author }]
        : '',
      date: article.date ? new Date(article.date * 1000) : '',
      image: `https://www.petplace.com${article.image.replace(/\?.*/, '')}`,
      category: article['category name']
        ? [{ name: sanitize(article['category name']), term: article.category }]
        : ''
    })
  });

  if (!fs.existsSync(targetDirectory)) {
    fs.mkdirSync(targetDirectory);
  }

  fs.writeFileSync(`${targetDirectory}/atom.xml`, feed.atom1());
  fs.writeFileSync(`${targetDirectory}/rss.xml`, feed.rss2());
}

main()
  .catch((e) => console.error(e));